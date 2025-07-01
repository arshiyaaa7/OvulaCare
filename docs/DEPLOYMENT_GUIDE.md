# OvulaCare AI - Full-Stack Deployment Guide

## 🏗️ Architecture Overview

Your OvulaCare AI app uses the **Bolt + Supabase** architecture:

```
Frontend (Bolt)  →  Supabase (Backend)  →  Edge Functions (API)
     ↓                    ↓                      ↓
- React/Vite        - Authentication         - Custom Logic
- UI Components     - PostgreSQL DB         - AI Integration
- Client Logic      - Real-time Updates     - External APIs
- Static Assets     - Row Level Security    - Background Tasks
```

## 🚀 Deployment Options

### Option 1: Bolt Deployment (Current Setup)
**✅ Recommended for your app**

**Pros:**
- Seamless integration with your current setup
- Automatic deployments from Bolt
- Built-in domain management
- No additional configuration needed

**Cons:**
- Limited to frontend applications
- No custom server-side logic outside Supabase

**Setup:**
```bash
# Your app is already configured for this!
# Just click "Deploy" in Bolt interface
```

### Option 2: Vercel Deployment
**✅ Good alternative with more flexibility**

**Pros:**
- Excellent Next.js support
- Edge functions support
- Custom domains
- Environment variable management

**Setup:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Option 3: Netlify Deployment
**✅ Great for static sites**

**Setup:**
```bash
# 1. Build your app
npm run build

# 2. Deploy to Netlify
# Upload dist/ folder to Netlify dashboard
# Or connect GitHub repo for auto-deployment
```

## 🔐 Environment Variables & Security

### For Bolt Deployment:
```env
# .env (already configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### For External Deployment:
```env
# Production .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**🔒 Security Best Practices:**
- ✅ Use Row Level Security (RLS) in Supabase
- ✅ Never expose service role key in frontend
- ✅ Use environment variables for all secrets
- ✅ Enable HTTPS in production
- ✅ Configure CORS properly in Supabase

## 🛠️ API Routes with Supabase Edge Functions

Since Bolt doesn't support traditional backend routes, use Supabase Edge Functions:

### Creating Edge Functions:
```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { message } = await req.json()
    
    // Your AI logic here
    const response = await processAIChat(message)
    
    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### Calling Edge Functions from Frontend:
```typescript
// src/lib/api.ts
export const callAIChat = async (message: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }
  )
  
  return response.json()
}
```

## 🌐 Custom Domains

### With Bolt:
1. Click "Connect Domain" in Bolt dashboard
2. Follow DNS configuration instructions
3. SSL certificates are handled automatically

### With Vercel:
```bash
# Add domain in Vercel dashboard
# Configure DNS records:
# CNAME: your-domain.com → cname.vercel-dns.com
```

### With Netlify:
```bash
# Add domain in Netlify dashboard
# Configure DNS records:
# CNAME: your-domain.com → your-site.netlify.app
```

## 📊 Database Management

### Supabase Database Schema:
```sql
-- Your existing tables are already set up!
-- user_profiles table ✅
-- mood_logs table ✅

-- Add new tables as needed:
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  mood text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can manage their own entries"
  ON journal_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
```

## 🔄 Real-time Features

```typescript
// Real-time subscriptions with Supabase
const subscription = supabase
  .channel('journal_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'journal_entries',
      filter: `user_id=eq.${user.id}`
    },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI accordingly
    }
  )
  .subscribe()
```

## 🚀 Deployment Checklist

### Pre-deployment:
- [ ] Environment variables configured
- [ ] Supabase RLS policies enabled
- [ ] Database migrations applied
- [ ] Edge functions deployed (if using)
- [ ] CORS settings configured
- [ ] Error handling implemented

### Post-deployment:
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Check API endpoints
- [ ] Test real-time features
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

## 🔧 Troubleshooting

### Common Issues:

**1. CORS Errors:**
```typescript
// Add to Supabase project settings
// Authentication → URL Configuration
// Site URL: https://your-domain.com
// Redirect URLs: https://your-domain.com/**
```

**2. Environment Variables:**
```bash
# Verify in deployment platform
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

**3. Database Connection:**
```typescript
// Test connection
const { data, error } = await supabase
  .from('user_profiles')
  .select('count', { count: 'exact', head: true })

if (error) console.error('DB Error:', error)
```

## 📈 Scaling Considerations

### Performance:
- Use Supabase connection pooling
- Implement proper indexing
- Cache frequently accessed data
- Optimize bundle size

### Security:
- Regular security audits
- Monitor authentication logs
- Update dependencies regularly
- Implement rate limiting

### Monitoring:
- Set up Supabase monitoring
- Use error tracking (Sentry)
- Monitor performance metrics
- Set up alerts for critical issues

## 🎯 Next Steps

1. **Deploy your current app** using Bolt's built-in deployment
2. **Set up custom domain** if needed
3. **Implement Edge Functions** for AI features
4. **Add real-time features** using Supabase subscriptions
5. **Monitor and optimize** performance

Your app is already well-architected for this deployment strategy! 🎉