import { useState } from 'react';
import { useAuth }  from '../../contexts/AuthContext';
import { toast }    from 'react-toastify';

export default function ForgotForm() {
  const { forgotPassword, setOtpPurpose, setStage } = useAuth();
  const [email, setEmail]            = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setEmail(email)
      setOtpPurpose('Password Reset')
      await forgotPassword(email);
      toast.info('Reset code sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-600 ">
        Forgot Password
      </h2>
      <input
        type="email"
        placeholder="Your email"
        className="w-full border rounded px-3 py-2 bg-gray-50"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
      >
        Send Reset Code
      </button>
      <p className="text-center text-sm">
        <button
          type="button"
          className="text-indigo-600 hover:underline"
          onClick={() => setStage('login')}
        >
          Back to login
        </button>
      </p>
    </form>
  );
}
