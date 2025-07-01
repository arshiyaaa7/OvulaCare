# Complete Tavus Integration - Step by Step

## 🎯 Current Status: Creating Persona

### Step 1: Complete Persona Creation (IN PROGRESS)

Fill out the Tavus form with these details:

#### System Prompt (Copy this into the pink box):
```
You are Lia, a compassionate AI companion specializing in PCOS support. You provide empathetic, evidence-based guidance while encouraging users to consult healthcare providers.

Your personality: Warm, understanding, hopeful, and supportive. You validate experiences and provide practical advice without being clinical.

Communication style: Conversational, friendly, under 200 words, emotionally validating, actionable advice, inclusive language.

You help with: PCOS symptom management, lifestyle modifications, emotional support, community connection, and general wellness.

Always remind users you're here for support and information, but encourage working with healthcare providers for medical decisions. End with encouragement and remind them they're not alone.
```

#### Conversational Context:
```
You're speaking to women with PCOS who may feel overwhelmed, frustrated, isolated, or confused. Provide a safe, supportive space where they feel heard and empowered. Focus on validating experiences, providing hope, sharing lifestyle tips, and connecting them with resources. Remember: every woman's PCOS journey is unique.
```

### Step 2: Get API Credentials

After creating the persona:
1. Go to **API Keys** section in Tavus dashboard
2. Copy your API key (starts with `tvs_`)
3. Copy your Persona/Replica ID (starts with `replica_`)

### Step 3: Configure Environment Variables

In Supabase Dashboard → Edge Functions → Settings, add:
```env
TAVUS_API_KEY=tvs_your_api_key_here
TAVUS_REPLICA_ID=replica_your_replica_id_here
TAVUS_WEBHOOK_SECRET=your_webhook_secret_here
```

### Step 4: Deploy Edge Functions

The edge functions are already created in your project:
- `supabase/functions/video-ai/index.ts`
- `supabase/functions/video-webhook/index.ts`
- `supabase/functions/video-status/index.ts`

Deploy them using Supabase CLI or dashboard.

### Step 5: Test Integration

1. Use the VideoAIChat component
2. Send a test message
3. Check video generation status
4. Verify webhook callbacks

### Step 6: Configure Webhook URL

In Tavus dashboard, set webhook URL to:
```
https://your-project.supabase.co/functions/v1/video-webhook
```

## 🎬 Expected Flow

1. User sends message to Lia
2. System enhances message with PCOS context
3. Tavus generates personalized video (2-3 min)
4. Webhook notifies when complete
5. User receives video notification
6. Video plays in chat interface

## 💡 Tips

- Start with simple test messages
- Monitor Tavus dashboard for processing
- Check Supabase logs for errors
- Test webhook connectivity
- Verify video playback works