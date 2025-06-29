import { useAuth } from "../contexts/AuthContext";
import LoginForm     from "./auth/LoginForm";
import SignupForm    from "./auth/SignupForm";
import VerifyEmailForm    from "./auth/VerifyEmailForm";
import ForgotForm    from "./auth/ForgotForm";
import ResetPasswordForm     from "./auth/ResetPasswordForm";

export default function AuthModalManager() {
  const { stage, user } = useAuth();
  if (user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Gradient & Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Responsive modal container */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg mx-auto">
        {stage === "login"       && <LoginForm     />}
        {stage === "signup"      && <SignupForm    />}
        {stage === "verifyEmail" && <VerifyEmailForm    />}
        {stage === "forgot"      && <ForgotForm    />}
        {stage === "reset"       && <ResetPasswordForm     />}
      </div>
    </div>
  );
}
