# OvulaCare AI - Complete Implementation Guide

## 🎯 AI Features Architecture

### Core AI Features for PCOS Platform:
1. **Conversational AI Agent** (Tavus + OpenAI)
2. **Symptom Analysis & PCOS Type Detection**
3. **Personalized Recommendations Engine**
4. **Mood & Journal Sentiment Analysis**
5. **Cycle Pattern Recognition**

## 🏗️ Architecture Decision

### Recommended: Supabase Edge Functions + External AI APIs

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Edge Functions│────│   AI Services   │
│   (Bolt)        │    │   (Supabase)    │    │   (OpenAI/etc)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   (Supabase)    │
                    └─────────────────┘
```

**Benefits:**
- ✅ **Secure**: API keys hidden in Edge Functions
- ✅ **Scalable**: Serverless auto-scaling
- ✅ **Cost-effective**: Pay per use
- ✅ **Simple**: No server management
- ✅ **Fast**: Edge deployment worldwide

## 🚀 Implementation Steps

### Step 1: Set up AI Edge Functions

#### 1.1 OpenAI Integration
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
    const { message, context } = await req.json()
    
    // OpenAI API call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are Lia, a compassionate AI assistant specializing in PCOS support. 
                     Provide empathetic, evidence-based guidance while encouraging users to 
                     consult healthcare providers for medical advice.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const aiData = await openaiResponse.json()
    
    return new Response(
      JSON.stringify({
        response: aiData.choices[0].message.content,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

#### 1.2 Symptom Analysis Function
```typescript
// supabase/functions/symptom-analyzer/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PCOS_TYPES = {
  'insulin-resistant': {
    keywords: ['weight gain', 'sugar cravings', 'fatigue', 'dark patches'],
    score_threshold: 0.7
  },
  'inflammatory': {
    keywords: ['joint pain', 'skin issues', 'digestive problems', 'headaches'],
    score_threshold: 0.6
  },
  'adrenal': {
    keywords: ['stress', 'anxiety', 'sleep issues', 'normal insulin'],
    score_threshold: 0.6
  },
  'post-pill': {
    keywords: ['recent birth control', 'sudden onset', 'after stopping pill'],
    score_threshold: 0.8
  }
}

serve(async (req) => {
  try {
    const { symptoms, userProfile } = await req.json()
    
    // Analyze symptoms using ML logic
    const analysis = analyzeSymptoms(symptoms, userProfile)
    
    // Generate personalized recommendations
    const recommendations = generateRecommendations(analysis, userProfile)
    
    return new Response(
      JSON.stringify({
        pcosType: analysis.mostLikelyType,
        confidence: analysis.confidence,
        recommendations: recommendations,
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

function analyzeSymptoms(symptoms: string[], userProfile: any) {
  const scores = {}
  
  for (const [type, config] of Object.entries(PCOS_TYPES)) {
    let score = 0
    const matchedKeywords = []
    
    for (const symptom of symptoms) {
      for (const keyword of config.keywords) {
        if (symptom.toLowerCase().includes(keyword.toLowerCase())) {
          score += 1
          matchedKeywords.push(keyword)
        }
      }
    }
    
    scores[type] = {
      score: score / config.keywords.length,
      matchedKeywords,
      meetsThreshold: (score / config.keywords.length) >= config.score_threshold
    }
  }
  
  const mostLikelyType = Object.entries(scores)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  return {
    mostLikelyType: mostLikelyType[0],
    confidence: mostLikelyType[1].score,
    allScores: scores
  }
}
```

#### 1.3 Tavus Video AI Integration
```typescript
// supabase/functions/video-ai/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { message, userId } = await req.json()
    
    // Create Tavus video response
    const tavusResponse = await fetch('https://api.tavus.io/v1/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('TAVUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: message,
        replica_id: Deno.env.get('TAVUS_REPLICA_ID'),
        video_name: `PCOS_Support_${userId}_${Date.now()}`,
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/video-callback`
      })
    })

    const videoData = await tavusResponse.json()
    
    return new Response(
      JSON.stringify({
        videoId: videoData.video_id,
        status: 'processing',
        estimatedTime: '2-3 minutes'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Step 2: Frontend Integration

#### 2.1 AI Chat Component Enhancement
```typescript
// src/components/ai/EnhancedAIChat.tsx
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Video, MessageCircle, Brain, Heart } from 'lucide-react'
import { callEdgeFunction } from '@/lib/api'

interface AIResponse {
  response: string
  videoId?: string
  recommendations?: string[]
  pcosInsights?: any
}

export function EnhancedAIChat() {
  const [messages, setMessages] = useState([])
  const [isVideoMode, setIsVideoMode] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)

  const sendMessage = async (message: string) => {
    try {
      if (isVideoMode) {
        // Request video response
        const videoResponse = await callEdgeFunction('video-ai', {
          message,
          userId: user.id
        })
        
        setCurrentVideo(videoResponse.videoId)
        // Poll for video completion
        pollVideoStatus(videoResponse.videoId)
      } else {
        // Regular text response
        const response = await callEdgeFunction('ai-chat', {
          message,
          context: { recentMessages: messages.slice(-5) }
        })
        
        addMessage('ai', response.response)
      }
    } catch (error) {
      console.error('AI Chat error:', error)
    }
  }

  const analyzeSymptoms = async (symptoms: string[]) => {
    try {
      const analysis = await callEdgeFunction('symptom-analyzer', {
        symptoms,
        userProfile: await getUserProfile()
      })
      
      return analysis
    } catch (error) {
      console.error('Symptom analysis error:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-pink-500" />
            Lia - Your AI Companion
          </div>
          <div className="flex space-x-2">
            <Button
              variant={isVideoMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsVideoMode(!isVideoMode)}
            >
              <Video className="mr-1 h-4 w-4" />
              Video Mode
            </Button>
            <Button variant="outline" size="sm">
              <Brain className="mr-1 h-4 w-4" />
              Analyze Symptoms
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chat interface with video support */}
        {currentVideo && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              🎥 Creating your personalized video response...
            </p>
          </div>
        )}
        
        {/* Rest of chat implementation */}
      </CardContent>
    </Card>
  )
}
```

#### 2.2 ML Recommendations Engine
```typescript
// src/components/ai/RecommendationsEngine.tsx
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, Calendar, Heart } from 'lucide-react'
import { callEdgeFunction } from '@/lib/api'

export function RecommendationsEngine({ userProfile, recentData }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateRecommendations()
  }, [userProfile, recentData])

  const generateRecommendations = async () => {
    try {
      const response = await callEdgeFunction('recommendations-engine', {
        userProfile,
        recentSymptoms: recentData.symptoms,
        cycleData: recentData.cycle,
        moodData: recentData.mood,
        journalEntries: recentData.journal
      })
      
      setRecommendations(response.recommendations)
    } catch (error) {
      console.error('Recommendations error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="outline">{rec.category}</Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {rec.confidence}% match
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4">
                    {rec.category === 'nutrition' && <Heart className="h-5 w-5 text-red-500" />}
                    {rec.category === 'exercise' && <TrendingUp className="h-5 w-5 text-blue-500" />}
                    {rec.category === 'cycle' && <Calendar className="h-5 w-5 text-purple-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### Step 3: Database Schema for AI Features

```sql
-- AI Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  sentiment text,
  video_id text,
  created_at timestamptz DEFAULT now()
);

-- AI Recommendations Table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'nutrition', 'exercise', 'lifestyle', 'medical'
  title text NOT NULL,
  description text NOT NULL,
  confidence_score decimal(3,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Symptom Analysis Results
CREATE TABLE IF NOT EXISTS symptom_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms jsonb NOT NULL,
  pcos_type text,
  confidence_score decimal(3,2),
  recommendations jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own AI data"
  ON ai_conversations FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own recommendations"
  ON ai_recommendations FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own analyses"
  ON symptom_analyses FOR ALL TO authenticated
  USING (auth.uid() = user_id);
```

## 🔐 Security & Environment Setup

### Environment Variables (Supabase Edge Functions)
```bash
# Set in Supabase Dashboard → Edge Functions → Settings
OPENAI_API_KEY=sk-...
TAVUS_API_KEY=tvs_...
TAVUS_REPLICA_ID=replica_...
ANTHROPIC_API_KEY=sk-ant-... # Optional for Claude
```

### Rate Limiting & Cost Control
```typescript
// src/lib/aiRateLimiter.ts
export class AIRateLimiter {
  private static instance: AIRateLimiter
  private requests: Map<string, number[]> = new Map()

  static getInstance() {
    if (!AIRateLimiter.instance) {
      AIRateLimiter.instance = new AIRateLimiter()
    }
    return AIRateLimiter.instance
  }

  canMakeRequest(userId: string, type: 'chat' | 'video' | 'analysis'): boolean {
    const limits = {
      chat: { max: 50, window: 24 * 60 * 60 * 1000 }, // 50 per day
      video: { max: 5, window: 24 * 60 * 60 * 1000 },  // 5 per day
      analysis: { max: 10, window: 24 * 60 * 60 * 1000 } // 10 per day
    }

    const limit = limits[type]
    const key = `${userId}:${type}`
    const now = Date.now()
    
    const userRequests = this.requests.get(key) || []
    const validRequests = userRequests.filter(time => now - time < limit.window)
    
    if (validRequests.length >= limit.max) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true
  }
}
```

## 📊 Monitoring & Analytics

### AI Usage Analytics
```typescript
// src/lib/aiAnalytics.ts
export const trackAIUsage = async (
  userId: string,
  feature: string,
  success: boolean,
  responseTime: number
) => {
  await supabase
    .from('ai_usage_analytics')
    .insert({
      user_id: userId,
      feature,
      success,
      response_time: responseTime,
      timestamp: new Date().toISOString()
    })
}
```

## 🚀 Deployment Strategy

### 1. Current Setup (Recommended)
- ✅ **Frontend**: Deploy on Bolt (current setup)
- ✅ **Backend**: Supabase Edge Functions
- ✅ **AI Services**: External APIs (OpenAI, Tavus)
- ✅ **Database**: Supabase PostgreSQL

### 2. Alternative: Netlify + Supabase
- ✅ **Frontend**: Netlify
- ✅ **Backend**: Supabase Edge Functions
- ✅ **Benefits**: More deployment flexibility

### 3. NOT Recommended: Separate Backend
- ❌ **Complexity**: Additional server management
- ❌ **Cost**: Higher infrastructure costs
- ❌ **Security**: More attack surfaces

## 💰 Cost Optimization

### AI API Costs (Estimated Monthly)
- **OpenAI GPT-4**: ~$50-200 (1000-5000 conversations)
- **Tavus Video**: ~$100-500 (100-500 videos)
- **Supabase**: ~$25 (Pro plan)
- **Total**: ~$175-725/month for moderate usage

### Cost Reduction Strategies:
1. **Smart Caching**: Cache common responses
2. **Tiered Models**: Use GPT-3.5 for simple queries
3. **Batch Processing**: Group similar requests
4. **User Limits**: Implement fair usage policies

## 🎯 Implementation Timeline

### Phase 1 (Week 1-2): Basic AI Chat
- ✅ Set up OpenAI Edge Function
- ✅ Implement basic chat interface
- ✅ Add sentiment analysis

### Phase 2 (Week 3-4): Symptom Analysis
- ✅ Build symptom analyzer
- ✅ PCOS type detection
- ✅ Personalized recommendations

### Phase 3 (Week 5-6): Video AI
- ✅ Integrate Tavus API
- ✅ Video response system
- ✅ Async processing

### Phase 4 (Week 7-8): ML Recommendations
- ✅ Pattern recognition
- ✅ Predictive insights
- ✅ Continuous learning

## 🔧 Testing Strategy

### 1. Unit Tests for Edge Functions
```typescript
// tests/edge-functions/ai-chat.test.ts
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts"

Deno.test("AI Chat responds correctly", async () => {
  const response = await fetch("http://localhost:54321/functions/v1/ai-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello" })
  })
  
  const data = await response.json()
  assertEquals(response.status, 200)
  assertEquals(typeof data.response, "string")
})
```

### 2. Integration Tests
```typescript
// tests/integration/ai-features.test.ts
describe('AI Features Integration', () => {
  test('Complete AI conversation flow', async () => {
    // Test full conversation flow
    // Test symptom analysis
    // Test recommendations generation
  })
})
```

## 📈 Success Metrics

### Key Performance Indicators:
1. **User Engagement**: AI chat usage frequency
2. **Accuracy**: Symptom analysis accuracy rate
3. **Satisfaction**: User feedback scores
4. **Retention**: Users returning after AI interactions
5. **Performance**: Response times < 3 seconds

### Monitoring Dashboard:
- Real-time AI usage statistics
- Error rates and response times
- Cost tracking per feature
- User satisfaction scores

This architecture gives you the best of both worlds: powerful AI capabilities with simple deployment and management! 🚀