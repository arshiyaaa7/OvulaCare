import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatRequest {
  message: string
  context?: any
  timestamp: string
}

interface ChatResponse {
  response: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  suggestions?: string[]
  timestamp: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authentication token')
    }

    // Parse request body
    const { message, context, timestamp }: ChatRequest = await req.json()

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string')
    }

    // Simple AI response logic (replace with actual AI service)
    const aiResponse = await generateAIResponse(message, context, user.id)

    // Log the conversation (optional)
    await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        message: message,
        response: aiResponse.response,
        sentiment: aiResponse.sentiment,
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify(aiResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('AI Chat error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400,
      },
    )
  }
})

async function generateAIResponse(
  message: string, 
  context: any, 
  userId: string
): Promise<ChatResponse> {
  // Simple rule-based responses (replace with actual AI service like OpenAI)
  const lowerMessage = message.toLowerCase()
  
  let response = "I understand you're reaching out. How can I support you today?"
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  let suggestions: string[] = []

  // PCOS-related responses
  if (lowerMessage.includes('pcos') || lowerMessage.includes('symptom')) {
    response = "I'm here to help you understand your PCOS journey. Would you like to track your symptoms or learn about management strategies?"
    suggestions = [
      "Track my symptoms",
      "Learn about PCOS types",
      "Get lifestyle tips",
      "Connect with community"
    ]
  }
  
  // Emotional support
  else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('overwhelmed')) {
    response = "I hear that you're going through a difficult time. Your feelings are valid, and you're not alone in this journey. Would you like to try some journaling or breathing exercises?"
    sentiment = 'negative'
    suggestions = [
      "Start journaling",
      "Try breathing exercises",
      "Connect with support",
      "Learn coping strategies"
    ]
  }
  
  // Positive responses
  else if (lowerMessage.includes('good') || lowerMessage.includes('better') || lowerMessage.includes('happy')) {
    response = "I'm so glad to hear you're feeling positive! It's wonderful to celebrate these moments. How can we build on this positive energy?"
    sentiment = 'positive'
    suggestions = [
      "Track this mood",
      "Share with community",
      "Set new goals",
      "Plan self-care"
    ]
  }
  
  // Cycle tracking
  else if (lowerMessage.includes('period') || lowerMessage.includes('cycle') || lowerMessage.includes('menstrual')) {
    response = "Tracking your cycle is so important for understanding your body's patterns. Would you like help logging your cycle data or understanding your patterns?"
    suggestions = [
      "Log cycle data",
      "View cycle insights",
      "Learn about phases",
      "Track symptoms"
    ]
  }

  return {
    response,
    sentiment,
    suggestions,
    timestamp: new Date().toISOString()
  }
}