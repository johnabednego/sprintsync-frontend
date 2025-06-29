import { useState } from 'react';
import { useAuth }  from '../../contexts/AuthContext';
import { toast }    from 'react-toastify';

export default function SignupForm() {
  const { signup, setStage } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signup({ firstName, lastName, email, password });
      toast.info('OTP sent to your email for verification.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-600">
        Sign Up
      </h2>
      <input
        placeholder="First Name"
        className="w-full border rounded px-3 py-2 bg-gray-50"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        required
      />
      <input
        placeholder="Last Name"
        className="w-full border rounded px-3 py-2 bg-gray-50"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded px-3 py-2 bg-gray-50"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border rounded px-3 py-2 bg-gray-50"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
      >
        Signup & Verify
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
