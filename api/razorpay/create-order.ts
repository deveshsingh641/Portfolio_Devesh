import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

// Server-side source of truth for supporter tier prices (in INR)
const TIER_PRICING: Record<string, number> = {
  espresso: 30,
  pizza: 100,
  headphones: 250,
  rocket: 500,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Missing Razorpay credentials in environment variables.');
    return res.status(500).json({
      error: 'Razorpay keys are not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    });
  }

  try {
    const { tier, customAmount, notes = {} } = req.body || {};

    let amountInRupees: number;

    // Server-side validation: client cannot tamper with tier pricing
    if (tier && TIER_PRICING[tier.toLowerCase()]) {
      amountInRupees = TIER_PRICING[tier.toLowerCase()];
    } else if (typeof customAmount === 'number' && customAmount >= 10 && customAmount <= 100000) {
      amountInRupees = Math.round(customAmount);
    } else {
      // Default to espresso tier if unspecified or invalid
      amountInRupees = TIER_PRICING.espresso;
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = amountInRupees * 100;
    const currency = 'INR';

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes: {
        ...notes,
        tier: tier || 'custom',
        amountInRupees: String(amountInRupees),
      },
    });

    // Send only public key_id and order details to frontend (never the secret)
    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (error: unknown) {
    console.error('Error creating Razorpay order:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return res.status(500).json({ error: message });
  }
}
