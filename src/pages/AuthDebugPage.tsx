import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthDebugPanel } from '@/components/auth/AuthDebugPanel';

export function AuthDebugPage() {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Authentication Debug</h1>
          <p className="text-muted-foreground">
            Debug and troubleshoot Supabase authentication issues
          </p>
        </div>
        
        <AuthDebugPanel />
      </div>
    </MainLayout>
  );
}