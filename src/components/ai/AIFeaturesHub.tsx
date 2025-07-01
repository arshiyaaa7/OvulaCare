import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  Heart, 
  Sparkles,
  Activity,
  Calendar,
  BookHeart,
  Loader2
} from 'lucide-react';
import { callEdgeFunction } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { AIChat } from '@/components/AIChat';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'processing' | 'disabled';
  lastUsed?: Date;
  isNew?: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  resources?: string[];
}

export function AIFeaturesHub() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeFeature, setActiveFeature] = useState<string>('chat');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const aiFeatures: AIFeature[] = [
    {
      id: 'chat',
      name: 'AI Text Chat',
      description: 'Quick text conversations with Lia for immediate support',
      icon: <MessageCircle className="h-5 w-5" />,
      status: 'available'
    },
    {
      id: 'symptoms',
      name: 'Symptom Analysis',
      description: 'AI-powered PCOS type identification and insights',
      icon: <Activity className="h-5 w-5" />,
      status: 'available'
    },
    {
      id: 'recommendations',
      name: 'Smart Recommendations',
      description: 'Personalized health and lifestyle suggestions based on your data',
      icon: <Sparkles className="h-5 w-5" />,
      status: 'available'
    }
  ];

  useEffect(() => {
    if (activeFeature === 'recommendations') {
      loadRecommendations();
    }
  }, [activeFeature]);

  const loadRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get user profile and recent data
      const userProfile = await getUserProfile();
      const recentData = await getRecentUserData();
      
      const response = await callEdgeFunction('recommendations-engine', {
        userProfile,
        recentSymptoms: recentData.symptoms || [],
        cycleData: recentData.cycle || {},
        moodData: recentData.mood || {},
        journalEntries: recentData.journal || []
      }, { requireAuth: true });
      
      setRecommendations(response.recommendations || []);
    } catch (error: any) {
      console.error('Failed to load recommendations:', error);
      toast({
        title: "Unable to load recommendations",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeSymptoms = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get user's recent symptoms
      const symptoms = await getUserSymptoms();
      
      const response = await callEdgeFunction('symptom-analyzer', {
        symptoms,
        userProfile: await getUserProfile()
      }, { requireAuth: true });
      
      toast({
        title: "Analysis Complete",
        description: `Your PCOS type appears to be: ${response.pcosType} (${Math.round(response.confidence * 100)}% confidence)`,
      });
      
      // Refresh recommendations after analysis
      if (activeFeature === 'recommendations') {
        loadRecommendations();
      }
    } catch (error: any) {
      console.error('Symptom analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'exercise':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'lifestyle':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'mental-health':
        return <BookHeart className="h-4 w-4 text-pink-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-gray-500" />;
    }
  };

  // Helper functions (simplified for demo)
  const getUserProfile = async () => {
    return {
      age: 28,
      diagnosed_with_pcos: true,
      common_symptoms: ['irregular-periods', 'weight-gain', 'fatigue']
    };
  };

  const getRecentUserData = async () => {
    return {
      symptoms: ['fatigue', 'mood-changes', 'sugar-cravings'],
      cycle: { irregular: true, lastPeriod: '2024-01-15' },
      mood: { averageMood: 'anxious', stressLevel: 'high' },
      journal: [
        { content: 'Feeling overwhelmed today...', mood: 'sad' },
        { content: 'Had a good day with friends', mood: 'happy' }
      ]
    };
  };

  const getUserSymptoms = async () => {
    return ['irregular-periods', 'weight-gain', 'fatigue', 'mood-changes'];
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* AI Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-6 w-6 text-purple-500" />
            AI-Powered PCOS Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md relative ${
                  activeFeature === feature.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                {feature.isNew && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-gradient-to-r from-pink-500 to-lavender-500 text-white text-xs">
                      NEW
                    </Badge>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{feature.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                      <Badge 
                        className={`mt-2 text-xs ${
                          feature.status === 'available' ? 'bg-green-100 text-green-800' :
                          feature.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Feature Content */}
      <Tabs value={activeFeature} onValueChange={setActiveFeature}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="symptoms">Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <AIChat />
        </TabsContent>

        <TabsContent value="symptoms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-green-500" />
                AI Symptom Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Our AI analyzes your symptoms to help identify your PCOS type and provide 
                personalized recommendations.
              </p>
              <Button 
                onClick={analyzeSymptoms}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze My Symptoms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                  Personalized Recommendations
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadRecommendations}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getCategoryIcon(rec.category)}
                              <h3 className="font-medium">{rec.title}</h3>
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline">
                                {rec.confidence}% match
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                            {rec.resources && rec.resources.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {rec.resources.map((resource, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {rec.actionable && (
                            <Button size="sm" variant="outline">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recommendations available yet.</p>
                  <p className="text-sm">Use the app more to get personalized suggestions!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}