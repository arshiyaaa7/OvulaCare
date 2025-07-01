import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RecommendationRequest {
  userProfile: any
  recentSymptoms: string[]
  cycleData: any
  moodData: any
  journalEntries: any[]
}

interface Recommendation {
  id: string
  title: string
  description: string
  category: 'nutrition' | 'exercise' | 'lifestyle' | 'medical' | 'mental-health'
  confidence: number
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  resources?: string[]
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

    // Authenticate user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authentication token')
    }

    const requestData: RecommendationRequest = await req.json()
    
    // Generate personalized recommendations
    const recommendations = await generateRecommendations(requestData, user.id)
    
    // Store recommendations in database
    await storeRecommendations(supabase, user.id, recommendations)
    
    return new Response(
      JSON.stringify({
        recommendations,
        generated_at: new Date().toISOString(),
        user_id: user.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Recommendations engine error:', error)
    
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

async function generateRecommendations(
  data: RecommendationRequest,
  userId: string
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []
  
  // Analyze user profile and recent data
  const analysis = analyzeUserData(data)
  
  // Generate nutrition recommendations
  recommendations.push(...generateNutritionRecommendations(analysis))
  
  // Generate exercise recommendations
  recommendations.push(...generateExerciseRecommendations(analysis))
  
  // Generate lifestyle recommendations
  recommendations.push(...generateLifestyleRecommendations(analysis))
  
  // Generate mental health recommendations
  recommendations.push(...generateMentalHealthRecommendations(analysis))
  
  // Sort by priority and confidence
  return recommendations
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (priorityOrder[b.priority] - priorityOrder[a.priority]) || (b.confidence - a.confidence)
    })
    .slice(0, 8) // Return top 8 recommendations
}

function analyzeUserData(data: RecommendationRequest) {
  const analysis = {
    pcosType: determinePCOSType(data.recentSymptoms),
    stressLevel: analyzeMoodData(data.moodData),
    cycleRegularity: analyzeCycleData(data.cycleData),
    nutritionalNeeds: analyzeNutritionalNeeds(data.userProfile, data.recentSymptoms),
    exerciseCapacity: analyzeExerciseCapacity(data.userProfile, data.recentSymptoms),
    mentalHealthStatus: analyzeJournalEntries(data.journalEntries)
  }
  
  return analysis
}

function determinePCOSType(symptoms: string[]): string {
  const typeScores = {
    'insulin-resistant': 0,
    'inflammatory': 0,
    'adrenal': 0,
    'post-pill': 0
  }
  
  const symptomMap = {
    'weight-gain': ['insulin-resistant'],
    'sugar-cravings': ['insulin-resistant'],
    'fatigue': ['insulin-resistant', 'adrenal'],
    'acne': ['inflammatory', 'insulin-resistant'],
    'hair-growth': ['insulin-resistant'],
    'hair-loss': ['insulin-resistant'],
    'mood-changes': ['adrenal', 'inflammatory'],
    'sleep-issues': ['adrenal'],
    'brain-fog': ['insulin-resistant', 'inflammatory'],
    'irregular-periods': ['insulin-resistant', 'adrenal']
  }
  
  symptoms.forEach(symptom => {
    const types = symptomMap[symptom] || []
    types.forEach(type => {
      typeScores[type] += 1
    })
  })
  
  return Object.entries(typeScores)
    .sort(([,a], [,b]) => b - a)[0][0]
}

function generateNutritionRecommendations(analysis: any): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  if (analysis.pcosType === 'insulin-resistant') {
    recommendations.push({
      id: 'nutrition-low-gi',
      title: 'Focus on Low Glycemic Index Foods',
      description: 'Choose foods that help stabilize blood sugar levels, such as quinoa, sweet potatoes, and leafy greens.',
      category: 'nutrition',
      confidence: 85,
      priority: 'high',
      actionable: true,
      resources: [
        'Low GI food list',
        'Meal planning guide',
        'Blood sugar tracking tips'
      ]
    })
    
    recommendations.push({
      id: 'nutrition-omega3',
      title: 'Increase Omega-3 Fatty Acids',
      description: 'Add fatty fish, walnuts, and flax seeds to help reduce inflammation and improve insulin sensitivity.',
      category: 'nutrition',
      confidence: 78,
      priority: 'medium',
      actionable: true
    })
  }
  
  if (analysis.pcosType === 'inflammatory') {
    recommendations.push({
      id: 'nutrition-anti-inflammatory',
      title: 'Anti-Inflammatory Diet',
      description: 'Focus on foods rich in antioxidants like berries, turmeric, and green tea to reduce inflammation.',
      category: 'nutrition',
      confidence: 82,
      priority: 'high',
      actionable: true
    })
  }
  
  return recommendations
}

function generateExerciseRecommendations(analysis: any): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  if (analysis.exerciseCapacity === 'low') {
    recommendations.push({
      id: 'exercise-gentle-start',
      title: 'Start with Gentle Movement',
      description: 'Begin with 10-15 minutes of walking or gentle yoga to build your fitness foundation.',
      category: 'exercise',
      confidence: 90,
      priority: 'high',
      actionable: true,
      resources: [
        'Beginner yoga videos',
        'Walking schedule template',
        'Low-impact exercise guide'
      ]
    })
  } else {
    recommendations.push({
      id: 'exercise-strength-training',
      title: 'Add Strength Training',
      description: 'Include 2-3 strength training sessions per week to improve insulin sensitivity and metabolism.',
      category: 'exercise',
      confidence: 85,
      priority: 'medium',
      actionable: true
    })
  }
  
  return recommendations
}

function generateLifestyleRecommendations(analysis: any): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  if (analysis.stressLevel === 'high') {
    recommendations.push({
      id: 'lifestyle-stress-management',
      title: 'Implement Stress Management Techniques',
      description: 'Try meditation, deep breathing, or progressive muscle relaxation for 10 minutes daily.',
      category: 'lifestyle',
      confidence: 88,
      priority: 'high',
      actionable: true,
      resources: [
        'Guided meditation apps',
        'Breathing exercise videos',
        'Stress management workbook'
      ]
    })
  }
  
  if (analysis.cycleRegularity === 'irregular') {
    recommendations.push({
      id: 'lifestyle-sleep-hygiene',
      title: 'Improve Sleep Hygiene',
      description: 'Maintain a consistent sleep schedule and create a relaxing bedtime routine to support hormone balance.',
      category: 'lifestyle',
      confidence: 80,
      priority: 'medium',
      actionable: true
    })
  }
  
  return recommendations
}

function generateMentalHealthRecommendations(analysis: any): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  if (analysis.mentalHealthStatus === 'concerning') {
    recommendations.push({
      id: 'mental-health-journaling',
      title: 'Continue Regular Journaling',
      description: 'Keep expressing your thoughts and feelings through journaling to process emotions and track patterns.',
      category: 'mental-health',
      confidence: 75,
      priority: 'medium',
      actionable: true,
      resources: [
        'Journaling prompts',
        'Mood tracking templates',
        'Self-reflection exercises'
      ]
    })
    
    recommendations.push({
      id: 'mental-health-support',
      title: 'Consider Professional Support',
      description: 'Connect with a therapist who specializes in chronic health conditions for additional support.',
      category: 'mental-health',
      confidence: 70,
      priority: 'high',
      actionable: true
    })
  }
  
  return recommendations
}

// Helper functions for analysis
function analyzeMoodData(moodData: any): string {
  // Analyze mood patterns and return stress level
  return 'medium' // Simplified for example
}

function analyzeCycleData(cycleData: any): string {
  // Analyze cycle regularity
  return 'irregular' // Simplified for example
}

function analyzeNutritionalNeeds(userProfile: any, symptoms: string[]): any {
  // Analyze nutritional requirements based on profile and symptoms
  return {}
}

function analyzeExerciseCapacity(userProfile: any, symptoms: string[]): string {
  // Determine exercise capacity based on profile and symptoms
  return 'medium' // Simplified for example
}

function analyzeJournalEntries(journalEntries: any[]): string {
  // Analyze journal entries for mental health indicators
  return 'stable' // Simplified for example
}

async function storeRecommendations(
  supabase: any,
  userId: string,
  recommendations: Recommendation[]
) {
  // Store recommendations in database for tracking and analytics
  const recommendationsToStore = recommendations.map(rec => ({
    user_id: userId,
    type: rec.category,
    title: rec.title,
    description: rec.description,
    confidence_score: rec.confidence / 100,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  }))
  
  await supabase
    .from('ai_recommendations')
    .insert(recommendationsToStore)
}