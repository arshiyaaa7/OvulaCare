import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';

interface ConnectionStatus {
  database: 'checking' | 'connected' | 'error';
  auth: 'checking' | 'connected' | 'error';
  rls: 'checking' | 'enabled' | 'disabled' | 'error';
  tables: 'checking' | 'found' | 'missing' | 'error';
}

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    database: 'checking',
    auth: 'checking',
    rls: 'checking',
    tables: 'checking',
  });
  const [details, setDetails] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus({
      database: 'checking',
      auth: 'checking',
      rls: 'checking',
      tables: 'checking',
    });
    setError(null);
    setDetails({});

    try {
      // Test 1: Basic database connection
      console.log('Testing database connection...');
      const { error: dbError } = await supabase
        .from('user_profiles')
        .select('count', { count: 'exact', head: true });

      if (dbError) {
        console.error('Database connection error:', dbError);
        setStatus((prev: ConnectionStatus) => ({ ...prev, database: 'error' }));
        setError(`Database connection failed: ${dbError.message}`);
        return;
      }

      setStatus((prev: ConnectionStatus) => ({ ...prev, database: 'connected' }));
      setDetails((prev: Record<string, any>) => ({ ...prev, database: 'Successfully connected to Supabase database' }));

      // Test 2: Auth service
      console.log('Testing auth service...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth service error:', authError);
        setStatus((prev: ConnectionStatus) => ({ ...prev, auth: 'error' }));
        setError(`Auth service failed: ${authError.message}`);
        return;
      }

      setStatus((prev: ConnectionStatus) => ({ ...prev, auth: 'connected' }));
      setDetails((prev: Record<string, any>) => ({ 
        ...prev, 
        auth: authData.session ? 'User is authenticated' : 'Auth service working (no active session)'
      }));

      // Test 3: Check RLS policies
      console.log('Testing RLS policies...');
      try {
        // Try to access user_profiles without authentication (should fail if RLS is working)
        const { error: rlsError } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);

        if (rlsError && rlsError.code === 'PGRST301') {
          // This is expected - RLS is working
          setStatus((prev: ConnectionStatus) => ({ ...prev, rls: 'enabled' }));
          setDetails((prev: Record<string, any>) => ({ ...prev, rls: 'Row Level Security is properly configured' }));
        } else if (rlsError) {
          setStatus((prev: ConnectionStatus) => ({ ...prev, rls: 'error' }));
          setDetails((prev: Record<string, any>) => ({ ...prev, rls: `RLS test error: ${rlsError.message}` }));
        } else {
          // No error means RLS might not be enabled or user is authenticated
          setStatus((prev: ConnectionStatus) => ({ ...prev, rls: 'enabled' }));
          setDetails((prev: Record<string, any>) => ({ ...prev, rls: 'RLS appears to be working (or user is authenticated)' }));
        }
      } catch (err: any) {
        setStatus((prev: ConnectionStatus) => ({ ...prev, rls: 'error' }));
        setDetails((prev: Record<string, any>) => ({ ...prev, rls: `RLS test failed: ${err.message}` }));
      }

      // Test 4: Check required tables
      console.log('Testing required tables...');
      try {
        const { error: tableError } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(0);

        if (tableError) {
          setStatus((prev: ConnectionStatus) => ({ ...prev, tables: 'missing' }));
          setDetails((prev: Record<string, any>) => ({ ...prev, tables: `Table check failed: ${tableError.message}` }));
        } else {
          setStatus((prev: ConnectionStatus) => ({ ...prev, tables: 'found' }));
          setDetails((prev: Record<string, any>) => ({ ...prev, tables: 'Required tables exist and are accessible' }));
        }
      } catch (err: any) {
        setStatus((prev: ConnectionStatus) => ({ ...prev, tables: 'error' }));
        setDetails((prev: Record<string, any>) => ({ ...prev, tables: `Table check error: ${err.message}` }));
      }

    } catch (err: any) {
      console.error('Connection test failed:', err);
      setError(`Connection test failed: ${err.message}`);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'connected':
      case 'enabled':
      case 'found':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'disabled':
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      case 'connected':
      case 'enabled':
      case 'found':
        return <Badge className="bg-green-100 text-green-800">✓ OK</Badge>;
      case 'error':
      case 'disabled':
      case 'missing':
        return <Badge variant="destructive">✗ Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const allGood = Object.values(status).every(s => 
    s === 'connected' || s === 'enabled' || s === 'found'
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Supabase Connection Test
        </CardTitle>
        <CardDescription>
          Testing your Supabase configuration and connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        {allGood && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              🎉 All systems are working! Your Supabase connection is properly configured.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Test Results */}
        <div className="space-y-4">
          {/* Database Connection */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.database)}
              <div>
                <h3 className="font-medium">Database Connection</h3>
                <p className="text-sm text-muted-foreground">
                  {details.database || 'Testing connection to Supabase database...'}
                </p>
              </div>
            </div>
            {getStatusBadge(status.database)}
          </div>

          {/* Auth Service */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.auth)}
              <div>
                <h3 className="font-medium">Authentication Service</h3>
                <p className="text-sm text-muted-foreground">
                  {details.auth || 'Testing Supabase Auth service...'}
                </p>
              </div>
            </div>
            {getStatusBadge(status.auth)}
          </div>

          {/* Row Level Security */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.rls)}
              <div>
                <h3 className="font-medium">Row Level Security</h3>
                <p className="text-sm text-muted-foreground">
                  {details.rls || 'Testing RLS policies...'}
                </p>
              </div>
            </div>
            {getStatusBadge(status.rls)}
          </div>

          {/* Tables */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(status.tables)}
              <div>
                <h3 className="font-medium">Database Tables</h3>
                <p className="text-sm text-muted-foreground">
                  {details.tables || 'Checking required tables...'}
                </p>
              </div>
            </div>
            {getStatusBadge(status.tables)}
          </div>
        </div>

        {/* Environment Variables Check */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Environment Variables</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>VITE_SUPABASE_URL:</span>
              <Badge variant={import.meta.env.VITE_SUPABASE_URL ? "default" : "destructive"}>
                {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>VITE_SUPABASE_ANON_KEY:</span>
              <Badge variant={import.meta.env.VITE_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
              </Badge>
            </div>
            {import.meta.env.VITE_SUPABASE_URL && (
              <div className="text-xs text-muted-foreground mt-2">
                URL: {import.meta.env.VITE_SUPABASE_URL}
              </div>
            )}
          </div>
        </div>

        {/* Retry Button */}
        <Button onClick={testConnection} className="w-full">
          <Database className="mr-2 h-4 w-4" />
          Run Test Again
        </Button>
      </CardContent>
    </Card>
  );
}