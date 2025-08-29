'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const adminUser = localStorage.getItem('adminUser');
      
      if (adminAuth === 'true' && adminUser) {
        setIsAuthenticated(true);
        setUser(adminUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        
        // Redirect to admin login if trying to access admin pages without auth
        if (pathname?.startsWith('/admin') && pathname !== '/admin') {
          router.push('/admin');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const login = (username: string, password: string): boolean => {
    // Hardcoded credentials for development
    if (username === 'FCODER' && password === 'FCODER') {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUser', username);
      setIsAuthenticated(true);
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/admin');
  };

  const value: AdminContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

// Higher-order component for protecting admin routes
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAdmin();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/admin');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
