import React, { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2, CreditCard } from 'lucide-react';

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailedResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
  [key: string]: unknown;
}

export interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', handler: (response: RazorpayFailedResponse) => void): void;
  on(event: string, handler: (response: unknown) => void): void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

interface PaymentSuccessData {
  paymentId: string;
  orderId: string;
}

export interface PaymentButtonProps {
  tier?: string;
  amount?: number;
  customAmount?: number;
  label?: string;
  gradient?: string;
  theme?: string;
  className?: string;
  onSuccess?: (data: PaymentSuccessData) => void;
  onError?: (error: string) => void;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  tier,
  amount,
  customAmount,
  label,
  gradient = 'from-amber-500 to-orange-500',
  theme = 'dark',
  className = '',
  onSuccess,
  onError,
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successPaymentId, setSuccessPaymentId] = useState<string | null>(null);

  const displayAmount = amount || customAmount || 30;

  const handlePayment = async () => {
    setErrorMessage(null);
    setStatus('loading');

    try {
      // 1. Load Razorpay Checkout SDK if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay payment SDK. Please check your internet connection.');
      }

      // 2. Call serverless backend to create order securely
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          customAmount: tier ? undefined : customAmount,
          notes: {
            source: 'portfolio_supporter_rewards',
          },
        }),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to initiate payment order.');
      }

      // 3. Configure and open Razorpay Checkout modal
      const razorpayKey = orderData.key_id;

      if (!razorpayKey) {
        throw new Error('Razorpay Key ID was not returned by the server.');
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Devesh Singh',
        description: tier ? `Support: ${tier.toUpperCase()}` : 'Supporter Contribution',
        order_id: orderData.order_id,
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setStatus('verifying');
          try {
            // 4. Server-side HMAC SHA256 Signature Verification
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.verified) {
              setStatus('success');
              setSuccessPaymentId(paymentResponse.razorpay_payment_id);
              if (onSuccess) {
                onSuccess({
                  paymentId: paymentResponse.razorpay_payment_id,
                  orderId: paymentResponse.razorpay_order_id,
                });
              }
            } else {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (verifyErr: unknown) {
            const msg = verifyErr instanceof Error ? verifyErr.message : 'Verification failed';
            setStatus('error');
            setErrorMessage(msg);
            if (onError) onError(msg);
          }
        },
        modal: {
          ondismiss: () => {
            // Gracefully handle modal close without throwing an error
            if (status !== 'success') {
              setStatus('idle');
            }
          },
        },
        theme: {
          color: '#f59e0b', // Amber theme
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK is not available.');
      }

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failure event
      razorpayInstance.on('payment.failed', (failResponse: RazorpayFailedResponse) => {
        const errorDescription = failResponse?.error?.description || 'Payment was declined or failed.';
        setStatus('error');
        setErrorMessage(errorDescription);
        if (onError) onError(errorDescription);
      });

      razorpayInstance.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setStatus('error');
      setErrorMessage(msg);
      if (onError) onError(msg);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Primary Payment Action Button */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={status === 'loading' || status === 'verifying'}
        className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm text-white transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none ${
          status === 'success'
            ? 'bg-emerald-600 shadow-emerald-500/20'
            : `bg-gradient-to-r ${gradient}`
        } ${className}`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Initializing Payment...</span>
          </>
        ) : status === 'verifying' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Verifying Signature...</span>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 size={18} className="text-emerald-200" />
            <span>Payment Confirmed!</span>
          </>
        ) : (
          <>
            <CreditCard size={18} />
            <span>{label || `Pay ₹${displayAmount} via Razorpay`}</span>
          </>
        )}
      </button>

      {/* Error Feedback Notice */}
      {status === 'error' && errorMessage && (
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs animate-fadeIn ${
            theme === 'dark'
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Payment Unsuccessful</p>
            <p className="opacity-90 mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setErrorMessage(null);
            }}
            className="text-xs font-medium underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Feedback Notice */}
      {status === 'success' && (
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs animate-fadeIn ${
            theme === 'dark'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Thank you for your generous support!</p>
            {successPaymentId && (
              <p className="opacity-90 font-mono text-[10px] mt-0.5">
                Ref ID: {successPaymentId}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
