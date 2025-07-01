import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  XCircle, 
  Loader2, 
  Bug, 
  User, 
  Settings
} from 'lucide-react';

export function AuthDebugPanel() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const debugUser = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    setResults(null);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const debugInfo: any = {
        email: cleanEmail,
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Check current session
      const { data: sessionData } = await supabase.auth.getSession();
      debugInfo.tests.currentSession = {
        hasSession: !!sessionData.session,
        user: sessionData.session?.user?.email || null,
        status: sessionData.session ? 'authenticated' : 'not authenticated'
      };

      // Test 2: Try to sign in with dummy password to check if user exists
      const { error: dummyError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: 'dummy_password_12345_test',
      });

      debugInfo.tests.userExists = {
        exists: dummyError?.message !== 'User not found',
        error: dummyError?.message || null,
        interpretation: dummyError?.message === 'Invalid login credentials' 
          ? 'User exists but password is wrong'
          : dummyError?.message === 'Email not confirmed'
          ? 'User exists but email not confirmed'
          : dummyError?.message === 'User not found'
          ? 'User does not exist'
          : 'Unknown status'
      };

      // Test 3: Check database connection
      try {
        const { error: dbError } = await supabase
          .from('user_profiles')
          .select('count', { count: 'exact', head: true });

        debugInfo.tests.database = {
          connected: !dbError,
          error: dbError?.message || null,
          status: dbError ? 'error' : 'connected'
        };
      } catch (err: any) {
        debugInfo.tests.database = {
          connected: false,
          error: err.message,
          status: 'error'
        };
      }

      // Test 4: Check environment variables
      debugInfo.tests.environment = {
        hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        url: import.meta.env.VITE_SUPABASE_URL || 'missing',
        urlValid: import.meta.env.VITE_SUPABASE_URL?.includes('supabase.co') || false
      };

      // Test 5: Check auth settings
      try {
        const { data: authSettings } = await supabase.auth.getUser();
        debugInfo.tests.authService = {
          working: true,
          currentUser: authSettings.user?.email || null,
          status: 'operational'
        };
      } catch (err: any) {
        debugInfo.tests.authService = {
          working: false,
          error: err.message,
          status: 'error'
        };
      }

      setResults(debugInfo);
    } catch (error: any) {
      setResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: 'TestPassword123!',
        options: {
          data: {
            name: 'Test User'
          }
        }
      });

      if (error) {
        throw error;
      }

      setResults({
        ...results,
        testUserCreated: {
          success: true,
          user: data.user?.email,
          needsConfirmation: !data.session,
          message: data.session 
            ? 'Test user created and signed in'
            : 'Test user created, check email for confirmation'
        }
      });
    } catch (error: any) {
      setResults({
        ...results,
        testUserCreated: {
          success: false,
          error: error.message
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: boolean | string) => {
    if (typeof status === 'boolean') {
      return status 
        ? <Badge className="bg-green-100 text-green-800">✓ OK</Badge>
        : <Badge variant="destructive">✗ Error</Badge>;
    }
    
    switch (status) {
      case 'connected':
      case 'operational':
      case 'authenticated':
        return <Badge className="bg-green-100 text-green-800">✓ OK</Badge>;
      case 'error':
        return <Badge variant="destructive">✗ Error</Badge>;
      case 'not authenticated':
        return <Badge variant="secondary">Not Auth</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="mr-2 h-5 w-5" />
          Supabase Auth Debug Panel
        </CardTitle>
        <CardDescription>
          Debug authentication issues and test user accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="debug" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="debug">Debug User</TabsTrigger>
            <TabsTrigger value="settings">Auth Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="debug" className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="debug-email">Email to Debug</Label>
                <Input
                  id="debug-email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={debugUser} disabled={loading || !email.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Debug'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={createTestUser} 
                  disabled={loading || !email.trim()}
                >
                  Create Test User
                </Button>
              </div>
            </div>

            {results && (
              <div className="space-y-4">
                {results.error ? (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{results.error}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <User className="h-4 w-4" />
                      <AlertDescription>
                        Debug results for: <strong>{results.email}</strong>
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Current Session */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Current Session</h3>
                          {getStatusBadge(results.tests.currentSession?.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {results.tests.currentSession?.hasSession 
                            ? `Authenticated as: ${results.tests.currentSession.user}`
                            : 'No active session'
                          }
                        </p>
                      </div>

                      {/* User Exists */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">User Account</h3>
                          {getStatusBadge(results.tests.userExists?.exists)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {results.tests.userExists?.interpretation}
                        </p>
                        {results.tests.userExists?.error && (
                          <p className="text-xs text-red-600 mt-1">
                            Error: {results.tests.userExists.error}
                          </p>
                        )}
                      </div>

                      {/* Database */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Database</h3>
                          {getStatusBadge(results.tests.database?.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {results.tests.database?.connected 
                            ? 'Database connection working'
                            : `Database error: ${results.tests.database?.error}`
                          }
                        </p>
                      </div>

                      {/* Auth Service */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Auth Service</h3>
                          {getStatusBadge(results.tests.authService?.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {results.tests.authService?.working 
                            ? 'Auth service operational'
                            : `Auth error: ${results.tests.authService?.error}`
                          }
                        </p>
                      </div>
                    </div>

                    {/* Environment Variables */}
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Environment Variables</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>VITE_SUPABASE_URL:</span>
                          {getStatusBadge(results.tests.environment?.hasUrl)}
                        </div>
                        <div className="flex justify-between">
                          <span>VITE_SUPABASE_ANON_KEY:</span>
                          {getStatusBadge(results.tests.environment?.hasKey)}
                        </div>
                        <div className="flex justify-between">
                          <span>URL Valid:</span>
                          {getStatusBadge(results.tests.environment?.urlValid)}
                        </div>
                        {results.tests.environment?.url && (
                          <div className="text-xs text-muted-foreground mt-2">
                            URL: {results.tests.environment.url}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Test User Creation Result */}
                    {results.testUserCreated && (
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Test User Creation</h3>
                        {results.testUserCreated.success ? (
                          <div className="text-green-600">
                            <p>✓ {results.testUserCreated.message}</p>
                            <p className="text-sm">Email: {results.testUserCreated.user}</p>
                            <p className="text-sm">Password: TestPassword123!</p>
                          </div>
                        ) : (
                          <div className="text-red-600">
                            <p>✗ Failed to create test user</p>
                            <p className="text-sm">{results.testUserCreated.error}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Check these Supabase project settings to resolve login issues:
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">1. Email Confirmation Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Go to Authentication → Settings in your Supabase dashboard
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Enable email confirmations:</strong> Turn OFF for testing</li>
                    <li>• <strong>Enable email change confirmations:</strong> Turn OFF for testing</li>
                    <li>• <strong>Secure email change:</strong> Turn OFF for testing</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">2. Site URL Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Go to Authentication → URL Configuration
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Site URL:</strong> http://localhost:5173 (for development)</li>
                    <li>• <strong>Redirect URLs:</strong> Add http://localhost:5173/**</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">3. Rate Limiting</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you're getting "Too many requests" errors
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Wait 15-60 minutes between failed attempts</li>
                    <li>• Use different email addresses for testing</li>
                    <li>• Check Authentication → Rate Limits in dashboard</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">4. Common Issues</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Case sensitivity:</strong> Emails are case-insensitive</li>
                    <li>• <strong>Whitespace:</strong> Trim spaces from email/password</li>
                    <li>• <strong>Password requirements:</strong> Minimum 6 characters</li>
                    <li>• <strong>Network issues:</strong> Check CORS and firewall settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}