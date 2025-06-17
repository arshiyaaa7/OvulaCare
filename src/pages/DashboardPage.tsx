import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/providers/AuthProvider';
import { 
  ActivitySquare, 
  BookHeart, 
  Calendar, 
  Compass,
  Clock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PCOS_TYPES } from '@/lib/constants';

export function DashboardPage() {
  const { user } = useAuth();
  const timeOfDay = getTimeOfDay();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
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
            <span className="text-sm text-muted-foreground">Last login: Today</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hopeful</div>
              <div className="mt-1 flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span>Improved from yesterday</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cycle Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Day 14</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Ovulation phase
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Journal Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Days</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Keep going!
              </div>
            </CardContent>
          </Card>
        </div>

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