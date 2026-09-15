import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.error('Missing RAZORPAY_KEY_SECRET in environment variables.');
    return res.status(500).json({
      error: 'Razorpay key secret is not configured on the server.',
    });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        error: 'Missing required payment verification parameters (order_id, payment_id, or signature).',
      });
    }

    // Compute expected HMAC SHA256 signature using key_secret
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    // Constant-time string comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(razorpay_signature, 'utf8');

    const isValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      console.warn(`Payment signature mismatch for order: ${razorpay_order_id}`);
      return res.status(400).json({
        verified: false,
        error: 'Invalid payment signature. Transaction could not be verified.',
      });
    }

    // Payment successfully verified
    console.log(`Payment verified successfully: ${razorpay_payment_id} for order ${razorpay_order_id}`);

    return res.status(200).json({
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      message: 'Payment verified successfully.',
    });
  } catch (error: unknown) {
    console.error('Error during payment verification:', error);
    const message = error instanceof Error ? error.message : 'Verification failed';
    return res.status(500).json({ verified: false, error: message });
  }
}
