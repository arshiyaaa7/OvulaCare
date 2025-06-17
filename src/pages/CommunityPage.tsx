import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Users, MessageSquarePlus, AlertCircle } from 'lucide-react';

export function CommunityPage() {
  return (
    <MainLayout requireAuth>
      <div className="container py-8">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">
              Connect with others on their PCOS journey
            </p>
          </div>
          <Button>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Sidebar */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2">🌟</span> All Posts
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2">💪</span> Success Stories
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2">❓</span> Questions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2">🌱</span> Natural Remedies
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span className="mr-2">🥗</span> Diet & Nutrition
                  </Button>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-medium">Community Guidelines</h4>
                  <p className="text-sm text-muted-foreground">
                    Be respectful, supportive, and kind. This is a safe space for everyone to share
                    their PCOS journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-9">
            {/* New post input */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Share your thoughts or ask a question..."
                  className="mb-4"
                />
                <div className="flex justify-end">
                  <Button>Post</Button>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon Notice */}
            <Card className="mb-6 bg-lavender-50">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <AlertCircle className="mr-2 h-5 w-5 text-pink-500" />
                  Community Features Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're working hard to build a supportive community space for you. 
                  Soon you'll be able to connect with others, share experiences, and
                  find support on your PCOS journey.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Join Waitlist</Button>
              </CardFooter>
            </Card>

            {/* Sample post */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jane P.</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Has anyone tried inositol supplements? My doctor recommended them for my insulin resistant PCOS and I'm curious about others' experiences.
                </p>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-pink-500">
                    <Heart className="mr-1 h-4 w-4" /> 24
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-1 h-4 w-4" /> 8 replies
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sample post with replies */}
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                      <AvatarFallback>MM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Maria M.</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Just wanted to share a small victory - I've been consistent with my anti-inflammatory diet for a month now and my skin is finally clearing up! Has anyone else noticed improvements with dietary changes?
                </p>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-pink-500">
                    <Heart className="mr-1 h-4 w-4 fill-current" /> 42
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-1 h-4 w-4" /> 5 replies
                  </Button>
                </div>

                {/* Replies */}
                <div className="mt-6 space-y-4 border-t pt-4">
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                      <AvatarFallback>EK</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-muted p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Elena K.</p>
                        <p className="text-xs text-muted-foreground">12h ago</p>
                      </div>
                      <p className="text-sm">
                        Congratulations! 🎉 I've had a similar experience with cutting out dairy. My skin has improved so much!
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <Heart className="mr-1 h-3 w-3" /> 7
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Write a reply..." 
                      className="min-h-0 resize-none" 
                      rows={1}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button size="sm">Reply</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}