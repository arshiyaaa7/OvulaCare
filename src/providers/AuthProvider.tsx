import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session} from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUserExists: (email: string) => Promise<boolean>;
  resendConfirmation: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle successful signup or signin - redirect to dashboard
      if ((event === 'SIGNED_UP' || event === 'SIGNED_IN') && session?.user) {
        console.log('User authenticated:', session.user.email);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      // Note: This is a workaround since Supabase doesn't provide a direct way to check if user exists
      // We'll try to sign in with a dummy password and check the error
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: 'dummy_password_check_12345',
      });

      if (error) {
        // If error is "Invalid login credentials", user might exist but password is wrong
        // If error is "Email not confirmed", user exists but needs confirmation
        // If error is "User not found", user doesn't exist
        return error.message !== 'User not found';
      }

      return true;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  const resendConfirmation = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim(),
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Confirmation email sent",
        description: "Please check your email and click the confirmation link.",
      });
    } catch (error: any) {
      console.error('Error resending confirmation:', error);
      throw new Error(error.message || 'Failed to resend confirmation email');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Clean and validate email
      const cleanEmail = email.toLowerCase().trim();
      
      console.log('Attempting signup for:', cleanEmail);

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup response:', data);

      if (data.user && data.session) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to OvulaCare! Let's get started.",
        });
        // Navigation will be handled by the auth state change listener
      } else if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      
      // Provide specific error messages
      let errorMessage = error.message;
      if (error.message?.includes('already registered')) {
        errorMessage = 'An account with this email already exists. Please try signing in instead.';
      } else if (error.message?.includes('Password should be')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      }

      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean and validate email
      const cleanEmail = email.toLowerCase().trim();
      
      console.log('Attempting signin for:', cleanEmail);

      // First check if user exists
      const userExists = await checkUserExists(cleanEmail);
      console.log('User exists check:', userExists);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        console.error('Signin error:', error);
        
        // Provide specific error messages based on error type
        let errorMessage = error.message;
        
        if (error.message === 'Invalid login credentials') {
          if (!userExists) {
            errorMessage = 'No account found with this email address. Please check your email or sign up for a new account.';
          } else {
            errorMessage = 'Incorrect password. Please check your password and try again.';
          }
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
          // Offer to resend confirmation
          toast({
            title: "Email not confirmed",
            description: "Please check your inbox or contact support to confirm your email.",
          });
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        }

        throw new Error(errorMessage);
      }

      console.log('Signin successful:', data.user?.email);

      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
      
      // Navigation will be handled by the auth state change listener
    } catch (error: any) {
      console.error('Signin failed:', error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear any local storage data
      localStorage.clear();

      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });

      // Redirect to home page
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signOut, 
      checkUserExists, 
      resendConfirmation 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}