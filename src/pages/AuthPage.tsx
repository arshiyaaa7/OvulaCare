import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Heart, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { APP_NAME } from '@/lib/constants';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export function AuthPage({ isLogin = true }: { isLogin?: boolean }) {
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
      navigate(from);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      await signUp(data.email, data.password, data.name);
      // Don't navigate immediately - user might need to confirm email
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto flex flex-col items-center justify-center py-12 md:py-24">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <h2 className="text-3xl font-bold">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
            <p className="mt-2 text-muted-foreground">
              {isLogin ? 'Log in to continue your PCOS journey' : 'Join OvulaCare AI and start your healing journey'}
            </p>
          </div>

          <Tabs defaultValue={isLogin ? 'login' : 'signup'}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" asChild>
                <Link to="/login">Login</Link>
              </TabsTrigger>
              <TabsTrigger value="signup" asChild>
                <Link to="/signup">Sign Up</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Log in'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create account'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to {APP_NAME}'s{' '}
            <Link to="/terms" className="font-medium text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </MainLayout>
  );
}