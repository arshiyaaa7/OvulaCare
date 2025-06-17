import React from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { useAuth } from '@/providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function MainLayout({ children, requireAuth = false }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login if auth is required but user is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}