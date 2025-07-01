import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { APP_NAME } from '@/lib/constants';
import { MainLayout } from '@/components/layout/MainLayout';

type AuthMode = 'login' | 'register' | 'forgot-password';

export function AuthPage({ isLogin = true }: { isLogin?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>(isLogin ? 'login' : 'register');
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleAuthSuccess = () => {
    navigate(from);
  };

  const handleForgotPassword = () => {
    setMode('forgot-password');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-lavender-500 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
            <p className="mt-2 text-gray-600">
              {mode === 'login' && 'Welcome back to your healing journey'}
              {mode === 'register' && 'Start your PCOS healing journey today'}
              {mode === 'forgot-password' && 'Reset your password'}
            </p>
          </div>

          {/* Auth Forms */}
          {mode === 'login' && (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onForgotPassword={handleForgotPassword}
            />
          )}
          
          {mode === 'register' && (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}
          
          {mode === 'forgot-password' && (
            <ForgotPasswordForm onBack={handleBackToLogin} />
          )}

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to {APP_NAME}'s{' '}
            <a href="/terms" className="font-medium text-pink-600 hover:text-pink-700 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-medium text-pink-600 hover:text-pink-700 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </MainLayout>
  );
}