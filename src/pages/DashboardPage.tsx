import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { FullPageLoader } from '@/components/ui/loading-spinner';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { 
  ActivitySquare, 
  BookHeart, 
  Calendar, 
  Compass,
  Clock, 
  TrendingUp,
  ArrowRight,
  Heart,
  MessageCircle,
  Sparkles,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PCOS_TYPES } from '@/lib/constants';
import { MoodOnboardingFlow } from '@/components/MoodOnboardingFlow';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  height: number;
  weight: number;
  cycle_length: number;
  last_period_date: string;
  diagnosed_with_pcos: boolean;
  common_symptoms: string[];
  mental_health_concerns: string | null;
  personal_goal: string;
  created_at: string;
  updated_at: string;
}

interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  notes: string | null;
  response: string | null;
  created_at: string;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [needsMoodOnboarding, setNeedsMoodOnboarding] = useState(false);
  const timeOfDay = getTimeOfDay();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          console.error('Error fetching profile:', profileError);
        }

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch mood logs
        const { data: moodData, error: moodError } = await supabase
          .from('mood_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (moodError) {
          console.error('Error fetching mood logs:', moodError);
        } else {
          setMoodLogs(moodData || []);
          
          // Check if user needs mood onboarding (no mood logs exist)
          if (!moodData || moodData.length === 0) {
            setNeedsMoodOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const getUserDisplayName = () => {
    return profile?.full_name?.split(' ')[0] || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
  };

  const calculateCycleDay = () => {
    if (!profile?.last_period_date) return 1;
    
    const lastPeriod = new Date(profile.last_period_date);
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    
    return (daysSinceLastPeriod % profile.cycle_length) + 1;
  };

  const getCyclePhase = () => {
    if (!profile) return 'Unknown';
    
    const cycleDay = calculateCycleDay();
    const cycleLength = profile.cycle_length;
    
    if (cycleDay <= 5) return 'Menstrual phase';
    if (cycleDay <= cycleLength / 2) return 'Follicular phase';
    if (cycleDay <= (cycleLength / 2) + 2) return 'Ovulation phase';
    return 'Luteal phase';
  };

  const getJournalStreak = () => {
    // Get actual journal streak from localStorage or database
    const savedEntries = localStorage.getItem('journal-entries');
    if (!savedEntries || !user?.id) return 0;
    
    try {
      const entries = JSON.parse(savedEntries);
      const userEntries = entries.filter((entry: any) => entry.userId === user.id);
      
      if (userEntries.length === 0) return 0;
      
      // Calculate streak (simplified - count entries in last 7 days)
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const recentEntries = userEntries.filter((entry: any) => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= sevenDaysAgo;
      });
      
      return recentEntries.length;
    } catch (error) {
      console.error('Error calculating journal streak:', error);
      return 0;
    }
  };

  const getMoodStreak = () => {
    if (moodLogs.length === 0) return 0;
    
    // Calculate consecutive days with mood logs
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const hasLogForDate = moodLogs.some(log => log.date === dateString);
      
      if (hasLogForDate) {
        streak++;
      } else if (i === 0) {
        // If no log for today, streak is 0
        break;
      } else {
        // If we hit a day without a log, stop counting
        break;
      }
    }
    
    return streak;
  };

  const getRecentMood = () => {
    if (moodLogs.length === 0) return null;
    return moodLogs[0]; // Most recent mood log
  };

  const featuredCards = [
    {
      title: "Start Symptom Check",
      description: "Answer a few questions to help identify your PCOS type",
      icon: <ActivitySquare className="h-6 w-6" />,
      link: "/symptom-checker",
      gradient: "from-pink-100 to-lavender-100"
    },
    {
      title: "Write Journal Entry",
      description: "Record how you're feeling today with AI-assisted journaling",
      icon: <BookHeart className="h-6 w-6" />,
      link: "/journal",
      gradient: "from-lavender-100 to-teal-100"
    },
    {
      title: "Track Cycle",
      description: "Log your cycle data and symptoms for better insights",
      icon: <Calendar className="h-6 w-6" />,
      link: "/cycle-tracker",
      gradient: "from-teal-100 to-pink-100"
    },
    {
      title: "Explore PCOS Types",
      description: "Learn about different PCOS types and their management",
      icon: <Compass className="h-6 w-6" />,
      link: "/pcos-guide",
      gradient: "from-pink-100 to-teal-100"
    }
  ];

  const handleOnboardingComplete = () => {
    setNeedsMoodOnboarding(false);
    // Refresh mood logs
    window.location.reload();
  };

  const handleOnboardingSkip = () => {
    setNeedsMoodOnboarding(false);
  };

  if (loading) {
    return <FullPageLoader text="Loading your dashboard..." />;
  }

  // Show mood onboarding if needed
  if (needsMoodOnboarding) {
    return (
      <MoodOnboardingFlow 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Good {timeOfDay}, {getUserDisplayName()}
            </h1>
            <p className="text-muted-foreground">{currentDate}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Welcome to OvulaCare!</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Cycle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Day {profile ? calculateCycleDay() : '--'}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {profile ? getCyclePhase() : 'Set up profile to track'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">PCOS Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile ? (profile.diagnosed_with_pcos ? 'Diagnosed' : 'Monitoring') : 'Unknown'}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {profile ? `${profile.common_symptoms.length} symptoms tracked` : 'Complete profile to track'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Journal Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getJournalStreak()} Days</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {getJournalStreak() === 0 ? 'Start journaling today!' : 'Keep going!'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mood Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getMoodStreak()} Days</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {getMoodStreak() === 0 ? 'Start tracking today!' : 'Great consistency!'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Mood */}
        {getRecentMood() && (
          <Card className="mb-8 bg-gradient-to-r from-pink-50 to-lavender-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-pink-500" />
                Recent Mood Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {getRecentMood()?.mood === 'happy' && '😊'}
                  {getRecentMood()?.mood === 'calm' && '😌'}
                  {getRecentMood()?.mood === 'anxious' && '😰'}
                  {getRecentMood()?.mood === 'sad' && '😔'}
                  {getRecentMood()?.mood === 'hopeful' && '🌱'}
                  {getRecentMood()?.mood === 'frustrated' && '😤'}
                  {getRecentMood()?.mood === 'tired' && '😴'}
                  {getRecentMood()?.mood === 'grateful' && '🤗'}
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{getRecentMood()?.mood}</p>
                  {getRecentMood()?.notes && (
                    <p className="text-sm text-gray-600 mt-1">{getRecentMood()?.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(getRecentMood()!.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNeedsMoodOnboarding(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Check-in
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No mood data fallback */}
        {moodLogs.length === 0 && (
          <Card className="mb-8 bg-gradient-to-r from-pink-50 to-lavender-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-pink-500" />
                Welcome to OvulaCare! Let's start with a mood check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Start tracking your daily mood to get personalized insights and build healthy habits.
              </p>
              <Button 
                onClick={() => setNeedsMoodOnboarding(true)}
                className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Your First Check-in
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Personal Goal */}
        {profile?.personal_goal && (
          <Card className="mb-8 bg-gradient-to-r from-pink-50 to-lavender-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-pink-500" />
                Your Personal Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-gray-800">{profile.personal_goal}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We're here to support you every step of the way on your journey.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Feature Cards */}
        <h2 className="mb-4 text-2xl font-bold tracking-tight">What would you like to do?</h2>
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredCards.map((card) => (
            <Link key={card.title} to={card.link}>
              <Card className={`h-full bg-gradient-to-br ${card.gradient} hover:shadow-md transition-shadow`}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm">
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {card.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* PCOS Types Section */}
        <h2 className="mb-4 text-2xl font-bold tracking-tight">PCOS Types Guide</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PCOS_TYPES.map((type) => (
            <Card key={type.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{type.description}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Common Symptoms:</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {type.commonSymptoms.slice(0, 3).map((symptom, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}