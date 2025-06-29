import { createContext, useState, useEffect, useContext } from 'react';
import baseUrl from '../components/baseUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stage, setStage] = useState('login');
  // 'login' | 'signup' | 'verifyEmail' | 'forgot' | 'reset'
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${baseUrl}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  // --- Auth Actions ---
  const login = async (email, password) => {
    setOtpEmail(email)
    const { data } = await axios.post(`${baseUrl}/auth/login`, { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    navigate('/');
  };

  const signup = async (payload) => {
    // payload includes firstName, lastName, email, password...
    const { data } = await axios.post(`${baseUrl}/auth/signup`, payload);
    // signup returns message + email
    setOtpEmail(data.email);
    setOtpPurpose('emailVerification');
    setStage('verifyEmail');
  };

  const verifyEmail = async (otp) => {
    const { data } = await axios.post(`${baseUrl}/auth/verify-email`, {
      email: otpEmail,
      otp
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setStage('login');
    navigate('/');
  };

  const forgotPassword = async (email) => {
    await axios.post(`${baseUrl}/auth/forgot-password`, { email });
    setOtpEmail(email);
    setOtpPurpose('passwordReset');
    setStage('reset');
  };

  const resetPassword = async (otp, newPassword) => {
    await axios.post(`${baseUrl}/auth/reset-password`, {
      email: otpEmail,
      otp,
      newPassword
    });
    setStage('login');
  };

  const resendOtp = async () => {
    if (!otpEmail || !otpPurpose) {
      const error = {
        response: {
          data: { message: 'Missing OTP email or purpose' }
        }
      };
      throw error;
    }

    try {
      await axios.post(`${baseUrl}/auth/resend-otp`, {
        email: otpEmail,
        purpose: otpPurpose
      });
    } catch (err) {
      // Re-throw the original Axios error to preserve err.response
      throw err;
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user, setUser, stage, setStage,
      login, signup, verifyEmail,
      forgotPassword, resetPassword,
      setOtpEmail, setOtpPurpose, resendOtp,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
