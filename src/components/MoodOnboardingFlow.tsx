import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  ArrowRight, 
  Loader2, 
  CheckCircle,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodOnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '🌱', label: 'Hopeful', value: 'hopeful' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '🤗', label: 'Grateful', value: 'grateful' },
];

export function MoodOnboardingFlow({ onComplete, onSkip }: MoodOnboardingFlowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [additionalThoughts, setAdditionalThoughts] = useState<string[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addThought = () => {
    if (currentThought.trim()) {
      setAdditionalThoughts([...additionalThoughts, currentThought.trim()]);
      setCurrentThought('');
    }
  };

  const removeThought = (index: number) => {
    setAdditionalThoughts(additionalThoughts.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user?.id || !selectedMood) {
      setError('Please select a mood before continuing.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine all thoughts into response field
      const allThoughts = additionalThoughts.length > 0 
        ? additionalThoughts.join(' • ') 
        : null;

      const moodLogData = {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        mood: selectedMood,
        notes: notes.trim() || null,
        response: allThoughts,
      };

      const { error: insertError } = await supabase
        .from('mood_logs')
        .insert([moodLogData]);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Welcome to OvulaCare! 🎉",
        description: "Your mood has been logged. Let's explore your personalized dashboard!",
      });

      onComplete();
    } catch (err: any) {
      console.error('Error saving mood log:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedMood) {
      setError('Please select how you\'re feeling today.');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-lavender-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Welcome to OvulaCare! 💕</CardTitle>
                  <p className="text-sm opacity-90">Let's check in with you</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-white hover:bg-white/20"
              >
                Skip for now
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Hi there! Let's check in—how are you feeling today?
                    </h2>
                    <p className="text-gray-600">
                      Select the emoji that best represents your current mood
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          selectedMood === mood.value
                            ? 'border-pink-500 bg-pink-50 shadow-lg'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                        }`}
                      >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <div className={`text-sm font-medium ${
                          selectedMood === mood.value ? 'text-pink-700' : 'text-gray-700'
                        }`}>
                          {mood.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={nextStep}
                      disabled={!selectedMood}
                      className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Anything on your mind?
                    </h2>
                    <p className="text-gray-600">
                      Share what's happening in your world today (optional)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="I'm feeling... / Today has been... / I'm thinking about..."
                      className="min-h-[120px] resize-none"
                      rows={5}
                    />
                    
                    <div className="text-sm text-gray-500 text-center">
                      This is a safe space to express yourself. Your thoughts are private and secure.
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Any other thoughts you'd like to share?
                    </h2>
                    <p className="text-gray-600">
                      Add additional thoughts or reflections (optional)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Textarea
                        value={currentThought}
                        onChange={(e) => setCurrentThought(e.target.value)}
                        placeholder="Add another thought..."
                        className="flex-1"
                        rows={2}
                      />
                      <Button
                        onClick={addThought}
                        disabled={!currentThought.trim()}
                        variant="outline"
                        size="sm"
                        className="self-start mt-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {additionalThoughts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Your thoughts:</h4>
                        {additionalThoughts.map((thought, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="flex-1 text-sm">{thought}</span>
                            <Button
                              onClick={() => removeThought(index)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Complete Check-in
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}