// Simple authentication utility for API routes

interface User {
  id: string;
  role: 'admin' | 'user';
}

interface Session {
  user: User | null;
}

/**
 * Check authentication status based on cookies
 * This is a simple implementation for the newsletter application
 */
export async function auth(): Promise<Session> {
  // In a browser environment, check cookies
  if (typeof document !== 'undefined') {
    const hasAdminCookie = document.cookie.includes('admin-auth=true');
    
    if (hasAdminCookie) {
      return {
        user: {
          id: 'admin',
          role: 'admin'
        }
      };
    }
  }
  
  // For server components and API routes, check the authorization header or cookies
  // This is a simplified version - in production, you would verify tokens properly
  try {
    // For server-side authentication checking
    // This would typically involve verifying a JWT or session token
    
    // Mock implementation for demo purposes
    // In a real app, this would validate a token and decode user information
    
    return {
      user: null
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      user: null
    };
  }
}

/**
 * Helper function to parse cookies from a request
 */
function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      cookies[name] = value;
    }
  });
  
  return cookies;
}

/**
 * Utility to check if a request is authenticated
 * Used for API routes
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  // Check cookies in the request
  const cookieHeader = request.headers.get('cookie') || '';
  
  // Log for debugging
  console.log('Auth check - Cookie header:', cookieHeader);
  
  // Parse cookies and look for admin-auth
  const cookies = parseCookies(cookieHeader);
  const hasAdminCookie = cookies['admin-auth'] === 'true';
  
  console.log('Auth check - Has admin cookie:', hasAdminCookie);
  
  return hasAdminCookie;
}

/**
 * Get user from request
 * Returns user object if authenticated, null otherwise
 */
export async function getUser(request: Request): Promise<User | null> {
  const isAuth = await isAuthenticated(request);
  
  if (isAuth) {
    return {
      id: 'admin',
      role: 'admin'
    };
  }
  
  return null;
} 