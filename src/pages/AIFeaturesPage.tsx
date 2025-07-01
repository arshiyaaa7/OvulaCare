import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AIFeaturesHub } from '@/components/ai/AIFeaturesHub';

export function AIFeaturesPage() {
  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered PCOS Support</h1>
          <p className="text-muted-foreground mt-2">
            Experience personalized AI assistance for your PCOS journey
          </p>
        </div>
        
        <AIFeaturesHub />
      </div>
    </MainLayout>
  );
}