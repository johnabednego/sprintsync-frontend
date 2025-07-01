import { useAuth } from "../contexts/AuthContext";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import VerifyEmailForm from "./auth/VerifyEmailForm";
import ForgotForm from "./auth/ForgotForm";
import ResetPasswordForm from "./auth/ResetPasswordForm";
import logo from '../assets/logo.svg';

export default function AuthModalManager() {
  const { stage, user } = useAuth();
  if (user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Gradient & Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
      <div className="absolute inset-0 bg-black/40" />


      {/* Responsive modal container */}
      <div className="relative z-10 w-full h-screen">
        <div className="flex gap-1 items-center mt-10">
          <img src={logo} alt="Logo" className="w-6 h-6" />
          <h1 className="text-xl text-white font-bold">SprintSync</h1>
        </div>
        <div className=" -mt-10 relative w-full h-screen flex items-center max-w-md sm:max-w-lg mx-auto">
          {stage === "login" && <LoginForm />}
          {stage === "signup" && <SignupForm />}
          {stage === "verifyEmail" && <VerifyEmailForm />}
          {stage === "forgot" && <ForgotForm />}
          {stage === "reset" && <ResetPasswordForm />}
        </div>
      </div>
    </div>
  );
}
