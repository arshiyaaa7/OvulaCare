import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  PlusCircle,
  ArrowRight,
  BarChart4,
  Droplets,
  Loader2,
} from 'lucide-react';
import { CycleData, CycleDay } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { addDays, format, startOfToday, differenceInDays, isWithinInterval, isSameDay } from 'date-fns';

export function CycleTrackerPage() {
  const { user } = useAuth();
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenstruation, setIsMenstruation] = useState(false);
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isStartNewCycle, setIsStartNewCycle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const today = startOfToday();

  useEffect(() => {
    // Load saved cycle data from localStorage
    const savedData = localStorage.getItem('cycle-data');
    if (savedData) {
      const data = JSON.parse(savedData) as Record<string, CycleData>;
      if (user?.id && data[user.id]) {
        setCycleData(data[user.id]);
      } else if (user?.id) {
        // Initialize new user data with a sample cycle
        const initialData: CycleData = {
          userId: user.id,
          cycles: [
            {
              startDate: addDays(today, -14).toISOString(),
              days: Array.from({ length: 5 }).map((_, index) => ({
                date: addDays(addDays(today, -14), index).toISOString(),
                day: index + 1,
                isMenstruation: true,
                mood: index % 2 === 0 ? 'calm' : 'sad',
              })),
            },
          ],
        };
        setCycleData(initialData);
        
        // Save to localStorage
        const allData = savedData ? JSON.parse(savedData) : {};
        localStorage.setItem('cycle-data', JSON.stringify({
          ...allData,
          [user.id]: initialData,
        }));
      }
    } else if (user?.id) {
      // Initialize new user data with a sample cycle
      const initialData: CycleData = {
        userId: user.id,
        cycles: [
          {
            startDate: addDays(today, -14).toISOString(),
            days: Array.from({ length: 5 }).map((_, index) => ({
              date: addDays(addDays(today, -14), index).toISOString(),
              day: index + 1,
              isMenstruation: true,
              mood: index % 2 === 0 ? 'calm' : 'sad',
            })),
          },
        ],
      };
      setCycleData(initialData);
      
      // Save to localStorage
      localStorage.setItem('cycle-data', JSON.stringify({
        [user.id]: initialData,
      }));
    }
  }, [user?.id]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDialogOpen(true);
      
      // Check if there's existing data for this date
      const existingDay = getDayData(date);
      if (existingDay) {
        setIsMenstruation(existingDay.isMenstruation);
        setMood(existingDay.mood);
        setSymptoms(existingDay.symptoms || []);
        setNotes(existingDay.notes || '');
        
        // Check if this is the first day of a cycle
        const cycle = cycleData?.cycles.find(c => 
          isSameDay(new Date(c.startDate), date)
        );
        setIsStartNewCycle(!!cycle);
      } else {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setIsMenstruation(false);
    setMood(undefined);
    setSymptoms([]);
    setNotes('');
    setIsStartNewCycle(false);
  };

  const saveDayData = async () => {
    if (!selectedDate || !user?.id || !cycleData) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const dateString = selectedDate.toISOString();
    const newDay: CycleDay = {
      date: dateString,
      day: calculateCycleDay(selectedDate),
      isMenstruation,
      mood: mood as any,
      symptoms,
      notes,
    };
    
    let updatedCycleData: CycleData;
    
    if (isStartNewCycle) {
      // Start a new cycle
      const newCycle = {
        startDate: dateString,
        days: [newDay],
      };
      
      updatedCycleData = {
        ...cycleData,
        cycles: [...cycleData.cycles, newCycle],
      };
    } else {
      // Update or add to existing cycle
      const existingDay = getDayData(selectedDate);
      const currentCycleIndex = getCurrentCycleIndex();
      
      if (currentCycleIndex !== -1) {
        // There is a current cycle
        const updatedCycles = [...cycleData.cycles];
        const currentCycle = { ...updatedCycles[currentCycleIndex] };
        
        if (existingDay) {
          // Update existing day
          currentCycle.days = currentCycle.days.map(day => 
            isSameDay(new Date(day.date), selectedDate) ? newDay : day
          );
        } else {
          // Add new day to current cycle
          currentCycle.days = [...currentCycle.days, newDay];
        }
        
        updatedCycles[currentCycleIndex] = currentCycle;
        updatedCycleData = {
          ...cycleData,
          cycles: updatedCycles,
        };
      } else {
        // No current cycle, create one starting today
        const newCycle = {
          startDate: dateString,
          days: [newDay],
        };
        
        updatedCycleData = {
          ...cycleData,
          cycles: [...cycleData.cycles, newCycle],
        };
      }
    }
    
    setCycleData(updatedCycleData);
    
    // Save to localStorage
    const savedData = localStorage.getItem('cycle-data');
    const allData = savedData ? JSON.parse(savedData) : {};
    localStorage.setItem('cycle-data', JSON.stringify({
      ...allData,
      [user.id]: updatedCycleData,
    }));
    
    setIsLoading(false);
    setIsDialogOpen(false);
    resetForm();
  };

  const getDayData = (date: Date): CycleDay | undefined => {
    if (!cycleData) return undefined;
    
    for (const cycle of cycleData.cycles) {
      const dayData = cycle.days.find(day => 
        isSameDay(new Date(day.date), date)
      );
      if (dayData) return dayData;
    }
    
    return undefined;
  };

  const getCurrentCycleIndex = (): number => {
    if (!cycleData || cycleData.cycles.length === 0) return -1;
    
    // For simplicity, we'll consider the most recent cycle as the current one
    return cycleData.cycles.length - 1;
  };

  const calculateCycleDay = (date: Date): number => {
    if (!cycleData || cycleData.cycles.length === 0) return 1;
    
    // Find the most recent cycle start that is before or on the selected date
    let relevantCycle = null;
    for (const cycle of [...cycleData.cycles].reverse()) {
      const cycleStartDate = new Date(cycle.startDate);
      if (cycleStartDate <= date) {
        relevantCycle = cycle;
        break;
      }
    }
    
    if (!relevantCycle) return 1;
    
    // Calculate days since cycle start
    return differenceInDays(date, new Date(relevantCycle.startDate)) + 1;
  };

  const isMenstruationDay = (date: Date): boolean => {
    const dayData = getDayData(date);
    return dayData ? dayData.isMenstruation : false;
  };

  const getMoodForDay = (date: Date): string | undefined => {
    const dayData = getDayData(date);
    return dayData ? dayData.mood : undefined;
  };

  const getAvgCycleLength = (): number => {
    if (!cycleData || cycleData.cycles.length < 2) return 28; // Default cycle length
    
    let totalDays = 0;
    let countedCycles = 0;
    
    for (let i = 1; i < cycleData.cycles.length; i++) {
      const currentStart = new Date(cycleData.cycles[i].startDate);
      const prevStart = new Date(cycleData.cycles[i-1].startDate);
      const cycleDays = differenceInDays(currentStart, prevStart);
      
      if (cycleDays > 0 && cycleDays < 60) { // Ignore outliers
        totalDays += cycleDays;
        countedCycles++;
      }
    }
    
    return countedCycles > 0 ? Math.round(totalDays / countedCycles) : 28;
  };

  const getNextPeriodEstimate = (): Date => {
    if (!cycleData || cycleData.cycles.length === 0) {
      return addDays(today, 28); // Default if no data
    }
    
    const lastCycle = cycleData.cycles[cycleData.cycles.length - 1];
    const lastStart = new Date(lastCycle.startDate);
    const avgCycleLength = getAvgCycleLength();
    
    return addDays(lastStart, avgCycleLength);
  };
  
  const getMoodEmoji = (mood: string | undefined) => {
    if (!mood) return '';
    
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'anxious': return '😰';
      case 'sad': return '😔';
      case 'hopeful': return '🌱';
      default: return '';
    }
  };

  const symptomOptions = [
    { id: 'cramps', label: 'Cramps' },
    { id: 'headache', label: 'Headache' },
    { id: 'bloating', label: 'Bloating' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'acne', label: 'Acne' },
    { id: 'breast-tenderness', label: 'Breast Tenderness' },
    { id: 'mood-swings', label: 'Mood Swings' },
    { id: 'food-cravings', label: 'Food Cravings' },
  ];

  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cycle Tracker</h1>
            <p className="text-muted-foreground">
              Monitor your menstrual cycle and track PCOS symptoms
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left sidebar with stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Cycle Length</p>
                  <p className="text-2xl font-bold">{getAvgCycleLength()} days</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Period (Est.)</p>
                  <p className="text-xl font-semibold">
                    {format(getNextPeriodEstimate(), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    In {differenceInDays(getNextPeriodEstimate(), today)} days
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Phase</p>
                  <div className="flex items-center mt-1">
                    <div className="mr-2 h-3 w-3 rounded-full bg-pink-400"></div>
                    <p>Follicular phase</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#insights">
                    <BarChart4 className="mr-2 h-4 w-4" />
                    View Insights
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PCOS Cycle Patterns</CardTitle>
                <CardDescription>
                  Understanding your unique cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Common PCOS Patterns:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      Longer cycles (35+ days)
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      Irregular cycles
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      Missed periods
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      Heavier or lighter flow
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-lavender-50 p-3">
                  <p className="text-sm">
                    Tracking your cycle can help identify patterns and improve management of PCOS symptoms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main calendar */}
          <div className="md:col-span-2">
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="calendar">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Cycle Calendar</CardTitle>
                    <CardDescription>
                      Click on a day to log menstruation, symptoms, and mood
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border"
                      modifiers={{
                        menstruation: (date) => isMenstruationDay(date),
                      }}
                      modifiersClassNames={{
                        menstruation: "bg-pink-200 text-pink-900 font-bold",
                      }}
                      components={{
                        DayContent: (props) => (
                          <div className="flex flex-col items-center justify-center">
                            <span>{props.day}</span>
                            {isMenstruationDay(props.date) && (
                              <Droplets className="h-3 w-3 text-pink-500" />
                            )}
                            <span className="text-xs">
                              {getMoodEmoji(getMoodForDay(props.date))}
                            </span>
                          </div>
                        ),
                      }}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="mr-1 h-3 w-3 rounded-full bg-pink-200"></div>
                        <span>Period</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">😌</span>
                        <span>Mood</span>
                      </div>
                    </div>
                    <Button onClick={() => {
                      setSelectedDate(new Date());
                      setIsDialogOpen(true);
                      resetForm();
                    }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Log Today
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Entries</CardTitle>
                    <CardDescription>
                      Your recent cycle data and symptoms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cycleData && cycleData.cycles.length > 0 ? (
                      <div className="space-y-4">
                        {cycleData.cycles.slice(-2).reverse().map((cycle, index) => (
                          <div key={index} className="space-y-2">
                            <h3 className="font-medium">
                              Cycle starting {format(new Date(cycle.startDate), 'MMM d, yyyy')}
                            </h3>
                            <div className="rounded-md border divide-y">
                              {cycle.days.map((day, dayIndex) => (
                                <div key={dayIndex} className="flex items-center justify-between p-3">
                                  <div>
                                    <p className="font-medium">
                                      {format(new Date(day.date), 'MMM d')} (Day {day.day})
                                    </p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      {day.isMenstruation && (
                                        <span className="mr-2 flex items-center">
                                          <Droplets className="mr-1 h-3 w-3 text-pink-500" />
                                          Period
                                        </span>
                                      )}
                                      {day.mood && (
                                        <span className="mr-2">{getMoodEmoji(day.mood)}</span>
                                      )}
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDateSelect(new Date(day.date))}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No cycle data recorded yet</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setSelectedDate(new Date());
                            setIsDialogOpen(true);
                            resetForm();
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Log Your First Entry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Insights section */}
            <div id="insights" className="mt-6">
              <Card className="bg-gradient-to-br from-lavender-50 to-pink-50">
                <CardHeader>
                  <CardTitle>Cycle Insights</CardTitle>
                  <CardDescription>
                    Personalized insights based on your cycle data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h3 className="font-medium">Cycle Regularity</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your cycles show some irregularity, which is common with PCOS.
                        Continue tracking to identify patterns.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h3 className="font-medium">Symptom Patterns</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You frequently report mood swings and fatigue before your period.
                        Consider lifestyle adjustments to help manage these symptoms.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h3 className="font-medium">Recommendations</h3>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          <span>Consider stress management techniques during your luteal phase</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          <span>Maintain regular sleep schedule to help regulate hormones</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          <span>Track your diet alongside cycle data to identify trigger foods</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View Detailed Analysis
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Dialog for logging cycle data */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              </DialogTitle>
              <DialogDescription>
                Log your cycle data for this day
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="menstruation" 
                  checked={isMenstruation}
                  onCheckedChange={(checked) => {
                    setIsMenstruation(checked === true);
                    if (checked === true && !isStartNewCycle) {
                      // If this is the first menstruation day logged in a while, suggest starting new cycle
                      setIsStartNewCycle(true);
                    }
                  }}
                />
                <label
                  htmlFor="menstruation"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Menstruation Day
                </label>
              </div>
              
              {isMenstruation && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="start-cycle" 
                    checked={isStartNewCycle}
                    onCheckedChange={(checked) => setIsStartNewCycle(checked === true)}
                  />
                  <label
                    htmlFor="start-cycle"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    This is the first day of a new cycle
                  </label>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mood</label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="How are you feeling?" />
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Symptoms</label>
                <div className="grid grid-cols-2 gap-2">
                  {symptomOptions.map((symptom) => (
                    <div key={symptom.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={symptom.id} 
                        checked={symptoms.includes(symptom.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSymptoms([...symptoms, symptom.id]);
                          } else {
                            setSymptoms(symptoms.filter(s => s !== symptom.id));
                          }
                        }}
                      />
                      <label
                        htmlFor={symptom.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {symptom.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  placeholder="Add any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveDayData} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}