# Tavus AI Integration Guide for OvulaCare

## 🎯 Overview

This guide walks you through integrating Tavus AI to create personalized video responses from Lia, your AI companion, for PCOS support.

## 📋 Prerequisites

1. **Tavus Account Setup**
   - Sign up at [tavus.io](https://tavus.io)
   - Get API key from dashboard
   - Create your AI replica (Lia)

2. **Required Information**
   - Tavus API Key
   - Replica ID (your AI avatar)
   - Webhook URL for callbacks

## 🚀 Step 1: Tavus Account & Replica Setup

### 1.1 Create Tavus Account
```bash
# Visit https://tavus.io and sign up
# Navigate to Dashboard → API Keys
# Copy your API key: tvs_xxxxxxxxxxxxx
```

### 1.2 Create AI Replica (Lia)
```bash
# In Tavus Dashboard:
# 1. Go to "Replicas" section
# 2. Click "Create New Replica"
# 3. Upload a video of your chosen avatar (or use stock)
# 4. Name it "Lia - PCOS Support Companion"
# 5. Wait for processing (15-30 minutes)
# 6. Copy the Replica ID: replica_xxxxxxxxxxxxx
```

## 🔧 Step 2: Environment Variables

Add these to your Supabase Edge Functions environment:

```env
TAVUS_API_KEY=tvs_your_api_key_here
TAVUS_REPLICA_ID=replica_your_replica_id_here
TAVUS_WEBHOOK_SECRET=your_webhook_secret_here
```

## 🛠️ Step 3: Database Schema

```sql
-- Video AI conversations table
CREATE TABLE IF NOT EXISTS video_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  tavus_video_id text,
  video_url text,
  status text DEFAULT 'processing', -- processing, completed, failed
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE video_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage their own video conversations"
  ON video_conversations FOR ALL TO authenticated
  USING (auth.uid() = user_id);
```

## 🎥 Step 4: Edge Functions Implementation

The edge functions are implemented in the following files:
- `supabase/functions/video-ai/index.ts` - Main video generation
- `supabase/functions/video-webhook/index.ts` - Webhook handler
- `supabase/functions/video-status/index.ts` - Status checker

## 🎨 Step 5: Frontend Integration

The frontend components are implemented in:
- `src/components/ai/VideoAIChat.tsx` - Main video chat component
- `src/components/ai/VideoPlayer.tsx` - Video player component
- Integration in existing AI features hub

## 📱 Step 6: Usage Flow

1. User types message to Lia
2. Frontend calls video-ai edge function
3. Edge function sends request to Tavus API
4. Tavus processes video (2-3 minutes)
5. Webhook notifies when complete
6. User receives personalized video response

## 🔐 Step 7: Security & Rate Limiting

- API keys secured in edge functions
- Rate limiting: 5 videos per user per day
- Input validation and sanitization
- Webhook signature verification

## 💰 Step 8: Cost Management

- Tavus pricing: ~$2-5 per video
- Implement daily/monthly limits
- Cache common responses
- Offer text fallback for cost control

## 🚀 Step 9: Deployment

1. Deploy edge functions to Supabase
2. Set environment variables
3. Configure webhook URL
4. Test with sample requests
5. Monitor usage and costs

## 📊 Step 10: Analytics & Monitoring

- Track video generation success rates
- Monitor response times
- User engagement metrics
- Cost tracking per user

## 🎯 Next Steps

1. Set up Tavus account and replica
2. Deploy the edge functions
3. Configure environment variables
4. Test the integration
5. Launch to users with proper onboarding