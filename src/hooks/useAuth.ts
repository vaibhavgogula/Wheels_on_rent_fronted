import { useState, useEffect } from 'react';
import { getUserRole } from '@/lib/auth';

export function useAuth() {
  const [role, setRole] = useState<'renter' | 'owner' | 'admin' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = () => {
    const userRole = getUserRole();
    setRole(userRole);
    setIsLoggedIn(!!userRole);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  // Listen for storage changes (when token is added/removed)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        refreshAuth();
      }
    };

    const handleAuthStateChange = () => {
      refreshAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    refreshAuth();
    // Force a full refresh to clear all state
    window.location.href = '/';
  };

  return {
    role,
    isLoggedIn,
    isLoading,
    refreshAuth,
    logout
  };
} 