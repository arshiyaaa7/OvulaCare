import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, RefreshCw, Save, PlusCircle, Calendar, BookHeart, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { JournalEntry } from '@/types';
import { JOURNAL_PROMPTS } from '@/lib/constants';
import { format } from 'date-fns';

export function JournalPage() {
  const { user } = useAuth();
  const [journalText, setJournalText] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('calm');
  const [saving, setSaving] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);
  const [sentiment, setSentiment] = useState<'calm' | 'anxious' | 'hopeful' | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  useEffect(() => {
    // Load saved journal entries from localStorage
    const savedEntries = localStorage.getItem('journal-entries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries) as JournalEntry[];
      const userEntries = entries.filter(entry => entry.userId === user?.id);
      setJournalEntries(userEntries);
    }
  }, [user?.id]);

  const getNewPrompt = () => {
    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
  };

  const analyzeJournal = async () => {
    if (!journalText.trim()) return;
    
    setSentimentLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simple sentiment analysis (would use AI in a real app)
    const text = journalText.toLowerCase();
    if (text.includes('grateful') || text.includes('happy') || text.includes('better')) {
      setSentiment('hopeful');
    } else if (text.includes('worried') || text.includes('stress') || text.includes('anxious')) {
      setSentiment('anxious');
    } else {
      setSentiment('calm');
    }
    
    setSentimentLoading(false);
  };

  const saveJournalEntry = async () => {
    if (!journalText.trim()) return;
    
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      userId: user?.id || '',
      content: journalText,
      mood: mood,
      createdAt: new Date().toISOString(),
    };
    
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    
    // Save to localStorage
    const allEntries = localStorage.getItem('journal-entries') 
      ? JSON.parse(localStorage.getItem('journal-entries') || '[]') 
      : [];
    
    const filteredEntries = allEntries.filter((entry: JournalEntry) => entry.userId !== user?.id);
    localStorage.setItem('journal-entries', JSON.stringify([...updatedEntries, ...filteredEntries]));
    
    setSaving(false);
    setJournalText('');
    setMood('calm');
    setSentiment(null);
    setIsNewEntryOpen(false);
  };
  
  const getSelectedEntry = () => {
    return journalEntries.find(entry => entry.id === selectedEntryId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  const getMoodEmoji = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'anxious': return '😰';
      case 'sad': return '😔';
      case 'hopeful': return '🌱';
      default: return '😌';
    }
  };

  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Journal</h1>
            <p className="text-muted-foreground">
              Record your thoughts and track your mental health journey
            </p>
          </div>
          <Button onClick={() => setIsNewEntryOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>

        <Tabs defaultValue="entries">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="entries" className="flex items-center">
              <BookHeart className="mr-2 h-4 w-4" />
              Journal Entries
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries">
            {journalEntries.length === 0 ? (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>No entries yet</CardTitle>
                  <CardDescription>
                    Start journaling to track your PCOS journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <Button onClick={() => setIsNewEntryOpen(true)} variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create your first entry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {journalEntries.map((entry) => (
                  <Card 
                    key={entry.id} 
                    className="hover:shadow-md transition-shadow"
                    onClick={() => setSelectedEntryId(entry.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {formatDate(entry.createdAt)}
                        </CardTitle>
                        <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-5 text-sm">
                        {entry.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  View your journal entries by date
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <p className="text-center text-muted-foreground">
                  Calendar view will be available in the next update
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* New Entry Dialog */}
        <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
              <DialogDescription>
                Record your thoughts, feelings, and experiences
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <p className="text-sm font-medium mr-3">Today's Prompt:</p>
                <p className="text-sm italic text-muted-foreground">{currentPrompt}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={getNewPrompt} title="Get new prompt">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Start writing here..."
                className="min-h-[200px]"
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
              />

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex-1">
                  <label className="text-sm font-medium">Mood</label>
                  <Select
                    value={mood}
                    onValueChange={(value) => setMood(value as JournalEntry['mood'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">Happy 😊</SelectItem>
                      <SelectItem value="calm">Calm 😌</SelectItem>
                      <SelectItem value="anxious">Anxious 😰</SelectItem>
                      <SelectItem value="sad">Sad 😔</SelectItem>
                      <SelectItem value="hopeful">Hopeful 🌱</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium">Sentiment Analysis</label>
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={analyzeJournal}
                      disabled={!journalText.trim() || sentimentLoading}
                    >
                      {sentimentLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : sentiment ? (
                        <>
                          <BadgeCheck className="mr-2 h-4 w-4 text-green-500" />
                          {sentiment === 'calm' && 'Calm'}
                          {sentiment === 'anxious' && 'Anxious'}
                          {sentiment === 'hopeful' && 'Hopeful'}
                        </>
                      ) : (
                        'Analyze Entry'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsNewEntryOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveJournalEntry} 
                disabled={!journalText.trim() || saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Entry
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Entry Dialog */}
        <Dialog open={!!selectedEntryId} onOpenChange={(open) => !open && setSelectedEntryId(null)}>
          {getSelectedEntry() && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{formatDate(getSelectedEntry()!.createdAt)}</span>
                  <span className="text-2xl">{getMoodEmoji(getSelectedEntry()!.mood)}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <p className="whitespace-pre-line">{getSelectedEntry()!.content}</p>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedEntryId(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </MainLayout>
  );
}