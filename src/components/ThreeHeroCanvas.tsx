import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MorphingParticlesProps {
  theme: string;
}

const MorphingParticles: React.FC<MorphingParticlesProps> = ({ theme }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // 1. Generate programmatic soft round dot texture using HTML5 Canvas (prevents rendering blocky square dots)
  const dotTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // 2. Generate 3D Spherical Coordinate distributions for 2,000 particles
  const particleCount = 2200;
  const [positions, originalPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const orig = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      // Base radius of the sphere + small noise spread
      const r = 1.35 + Math.random() * 0.12;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3. Frame rendering loop: Apply dynamic wave morphing + rotation + mouse tracking
  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const time = state.clock.getElapsedTime();
    
    const geom = points.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];
      
      // Multi-frequency wave formula to make the sphere organically morph
      const wave = Math.sin(ox * 2.2 + time * 1.4) * 0.15 + 
                   Math.cos(oy * 2.5 + time * 1.1) * 0.15 + 
                   Math.sin(oz * 1.8 + time * 0.9) * 0.08;
      
      const scale = 1.0 + wave;
      
      array[i3] = ox * scale;
      array[i3 + 1] = oy * scale;
      array[i3 + 2] = oz * scale;
    }
    
    posAttr.needsUpdate = true;

    // Slow orbital rotation
    points.rotation.y = time * 0.08;
    points.rotation.x = time * 0.04;
    
    // Add magnetic cursor tracking
    points.rotation.x += mouse.current.y * 0.3;
    points.rotation.y += mouse.current.x * 0.3;
  });

  const isDark = theme === "dark";

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={isDark ? "#a855f7" : "#4f46e5"}
        size={0.048}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.88}
        depthWrite={false}
        map={dotTexture}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface ThreeHeroCanvasProps {
  theme: string;
}

const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({ theme }) => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const isSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglSupported(isSupported);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (webglSupported === false) {
    return null; // CSS gradient fallback takes over
  }

  if (webglSupported === null) {
    return <div className="absolute inset-0 z-0 bg-transparent" />;
  }

  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden select-none">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <MorphingParticles theme={theme} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default ThreeHeroCanvas;
