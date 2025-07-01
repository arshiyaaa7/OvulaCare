import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';

export function ConnectionTestPage() {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Supabase Connection Test</h1>
          <p className="text-muted-foreground">
            Verify that your Supabase configuration is working correctly
          </p>
        </div>
        
        <SupabaseConnectionTest />
      </div>
    </MainLayout>
  );
}