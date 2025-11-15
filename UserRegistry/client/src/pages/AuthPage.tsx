import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { type AuthResponse } from "@/lib/api";

interface AuthPageProps {
  onLogin: (response: AuthResponse) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {isLogin ? (
        <LoginForm
          onLogin={onLogin}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onRegister={onLogin}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}
