import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Heart, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z.number().min(13).max(100, 'Please enter a valid age'),
  height: z.number().min(100).max(250, 'Please enter height in cm (100-250)'),
  weight: z.number().min(30).max(300, 'Please enter weight in kg (30-300)'),
  cycleLength: z.number().min(21).max(45, 'Cycle length should be between 21-45 days'),
  lastPeriodDate: z.date({
    required_error: 'Please select your last period date',
  }),
  diagnosedWithPCOS: z.boolean(),
  commonSymptoms: z.array(z.string()).min(0),
  mentalHealthConcerns: z.string().optional(),
  personalGoal: z.string().min(5, 'Please share your personal goal (at least 5 characters)'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const symptomOptions = [
  { id: 'bloating', label: 'Bloating' },
  { id: 'hair-fall', label: 'Hair fall' },
  { id: 'acne', label: 'Acne' },
  { id: 'irregular-periods', label: 'Irregular periods' },
  { id: 'weight-gain', label: 'Weight gain' },
];

export function ProfileSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      age: 25,
      height: 160,
      weight: 60,
      cycleLength: 28,
      diagnosedWithPCOS: false,
      commonSymptoms: [],
      mentalHealthConcerns: '',
      personalGoal: '',
    },
  });

  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (data) {
          // Profile already exists, redirect to dashboard
          navigate('/dashboard');
          return;
        }

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          console.error('Error checking profile:', error);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [user, navigate]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to continue.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        full_name: data.fullName,
        age: data.age,
        height: data.height,
        weight: data.weight,
        cycle_length: data.cycleLength,
        last_period_date: format(data.lastPeriodDate, 'yyyy-MM-dd'),
        diagnosed_with_pcos: data.diagnosedWithPCOS,
        common_symptoms: data.commonSymptoms,
        mental_health_concerns: data.mentalHealthConcerns || null,
        personal_goal: data.personalGoal,
      };

      const { error } = await supabase
        .from('user_profiles')
        .insert([profileData]);

      if (error) {
        throw error;
      }

      toast({
        title: '✅ Profile saved. Welcome to OvulaCare!',
        description: 'Your personalized care journey begins now.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error saving profile',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-lavender-50 to-teal-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
          <span className="text-lg font-medium text-gray-700">Setting up your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-teal-50 py-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <Sparkles className="h-4 w-4 text-pink-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="container relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-lavender-400 shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Let's Personalize Your Care
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Help us understand your unique journey so we can provide the best support for you 💕
          </p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-800">Your Personal Profile</CardTitle>
            <CardDescription className="text-gray-600">
              This information helps us create a personalized experience just for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-pink-100 pb-2">
                    Basic Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="25" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="160" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="60" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Menstrual Health */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-pink-100 pb-2">
                    Menstrual Health
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cycleLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Menstrual Cycle Length (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="28" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
                            />
                          </FormControl>
                          <FormDescription>
                            Average number of days between periods
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastPeriodDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Last Period Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal border-pink-200 focus:border-pink-400",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="diagnosedWithPCOS"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-pink-200 p-4 bg-pink-50/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            Diagnosed with PCOS?
                          </FormLabel>
                          <FormDescription>
                            Have you been officially diagnosed with Polycystic Ovary Syndrome?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Symptoms */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-pink-100 pb-2">
                    Common Symptoms
                  </h3>

                  <FormField
                    control={form.control}
                    name="commonSymptoms"
                    render={() => (
                      <FormItem>
                        <FormLabel>Which symptoms do you experience?</FormLabel>
                        <FormDescription>
                          Select all that apply to you
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {symptomOptions.map((symptom) => (
                            <FormField
                              key={symptom.id}
                              control={form.control}
                              name="commonSymptoms"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={symptom.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(symptom.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, symptom.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== symptom.id
                                                )
                                              );
                                        }}
                                        className="border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-sm">
                                      {symptom.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mental Health & Goals */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-pink-100 pb-2">
                    Mental Health & Goals
                  </h3>

                  <FormField
                    control={form.control}
                    name="mentalHealthConcerns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mental Health Concerns</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share any mental health concerns or challenges you're facing (optional)"
                            className="min-h-[100px] border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This helps us provide better emotional support and resources
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personalGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Goal</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What would you like to achieve with OvulaCare?"
                            {...field}
                            className="border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
                          />
                        </FormControl>
                        <FormDescription>
                          e.g., "Better manage my PCOS symptoms", "Improve my mental health", "Track my cycle better"
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving your profile...
                    </>
                  ) : (
                    <>
                      Complete Setup & Start Journey
                      <Heart className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Your information is secure and private. We use it only to personalize your OvulaCare experience.
          </p>
        </div>
      </div>
    </div>
  );
}