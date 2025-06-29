import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function VerifyEmailForm() {
  const { verifyEmail, resendOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await verifyEmail(otp);
      toast.success('Email verified! Logged in.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendOtp();
      toast.success('Verification code resent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-600">
        Enter OTP
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300">
        We’ve sent a code to your email. Enter it below.
      </p>
      <input
        placeholder="6‑digit code"
        className="w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-50"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
      >
        Verify Email
      </button>
      <div className="w-full flex items-center justify-center">
        <button
          type="button"
          onClick={handleResend}
          className="text-center cursor-pointer text-indigo-600 underline"
          disabled={loading}
        >
          {loading ? 'Resending...' : 'Resend Verification OTP'}
        </button>
      </div>
    </form>
  );
}
