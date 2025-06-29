import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast }   from 'react-toastify';

export default function LoginForm() {
  const { login, setStage, setOtpPurpose } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
       if(err.response?.data?.message === "Email not verified"){
        setOtpPurpose('emailVerification')
        setStage('verifyEmail')
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">
        Sign In
      </h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full border  rounded px-3 py-2 bg-gray-50 "
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border  rounded px-3 py-2 bg-gray-50"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
      >
        Login
      </button>
      <div className="flex justify-between text-sm">
        <button
          type="button"
          className="text-indigo-600 hover:underline dark:text-indigo-400"
          onClick={() => setStage('forgot')}
        >
          Forgot Password?
        </button>
        <button
          type="button"
          className="text-indigo-600 hover:underline dark:text-indigo-400"
          onClick={() => setStage('signup')}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
