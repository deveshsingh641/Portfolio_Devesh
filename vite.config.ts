import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function razorpayDevApiPlugin(): Plugin {
  return {
    name: 'razorpay-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/razorpay/')) {
          return next();
        }

        const endpoint = req.url.split('?')[0];

        try {
          // Read request body
          const bodyBuffer: Buffer[] = [];
          for await (const chunk of req) {
            bodyBuffer.push(chunk as Buffer);
          }
          const rawBody = Buffer.concat(bodyBuffer).toString('utf-8');
          const body = rawBody ? JSON.parse(rawBody) : {};

          // Attach body and mock VercelRequest / VercelResponse helper methods
          (req as unknown as { body: unknown }).body = body;

          const vercelRes = res as unknown as {
            status: (code: number) => typeof vercelRes;
            json: (data: unknown) => typeof vercelRes;
          };

          vercelRes.status = function (code: number) {
            res.statusCode = code;
            return vercelRes;
          };
          vercelRes.json = function (data: unknown) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return vercelRes;
          };

          if (endpoint === '/api/razorpay/create-order') {
            const mod = await server.ssrLoadModule('/api/razorpay/create-order.ts');
            return mod.default(req, res);
          } else if (endpoint === '/api/razorpay/verify-payment') {
            const mod = await server.ssrLoadModule('/api/razorpay/verify-payment.ts');
            return mod.default(req, res);
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          }
        } catch (err: unknown) {
          console.error('Local Razorpay API error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          const message = err instanceof Error ? err.message : 'Internal server error';
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Populate process.env with values from .env and .env.local for local serverless functions
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), razorpayDevApiPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['react-parallax-tilt', 'react-type-animation', 'lucide-react'],
        },
      },
    },
  },
    server: {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
  };
});

