import { supabase } from './supabase';

// API helper functions for external services and edge functions

/**
 * Call Supabase Edge Function
 */
export const callEdgeFunction = async (
  functionName: string, 
  payload: any = {},
  options: { requireAuth?: boolean } = {}
) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth header if required
    if (options.requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } else {
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Edge function ${functionName} error:`, error);
    throw new Error(error.message || 'Edge function call failed');
  }
};

/**
 * AI Chat Integration
 */
export const sendAIMessage = async (message: string, context?: any) => {
  return callEdgeFunction('ai-chat', { 
    message, 
    context,
    timestamp: new Date().toISOString()
  }, { requireAuth: true });
};

/**
 * Symptom Analysis
 */
export const analyzeSymptoms = async (symptoms: string[], userProfile?: any) => {
  return callEdgeFunction('symptom-analyzer', {
    symptoms,
    userProfile,
    timestamp: new Date().toISOString()
  }, { requireAuth: true });
};

/**
 * Journal Sentiment Analysis
 */
export const analyzeJournalSentiment = async (content: string) => {
  return callEdgeFunction('sentiment-analysis', {
    content,
    timestamp: new Date().toISOString()
  }, { requireAuth: true });
};

/**
 * External API Integration Helper
 */
export const callExternalAPI = async (
  url: string, 
  options: RequestInit = {},
  timeout: number = 10000
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    console.error('External API error:', error);
    throw error;
  }
};

/**
 * Health Check for APIs
 */
export const healthCheck = async () => {
  const checks = {
    supabase: false,
    edgeFunctions: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Test Supabase connection
    const { error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });
    
    checks.supabase = !error;
  } catch (error) {
    console.error('Supabase health check failed:', error);
  }

  try {
    // Test edge functions (if available)
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );
    
    checks.edgeFunctions = response.ok;
  } catch (error) {
    console.error('Edge functions health check failed:', error);
  }

  return checks;
};

/**
 * Rate limiting helper
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Retry helper for failed requests
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (i === maxRetries) {
        break;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError!;
};