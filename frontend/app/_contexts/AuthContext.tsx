"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getProfile } from "@/app/_apis/user/account";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id?: number;
    role?: string;
    email?: string;
    fullName?: string;
    birthday?: string;
    profileImg?: string | null;
  } | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProfile();

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.content) {
          const profileData = data.content;

          // Store essential user info
          const userData = {
            id: profileData.id,
            role: profileData.role,
            email: profileData.email,
            fullName: profileData.fullName,
            birthday: profileData.birthday,
            profileImg: profileData.profileImg,
          };

          // Save user data to localStorage
          localStorage.setItem("user", JSON.stringify(userData));

          setUser(userData);
          setIsAuthenticated(true);
        } else {
          throw new Error("Failed to get profile data");
        }
      } else {
        throw new Error("Failed to authenticate");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error("Authentication error:", error);
          logout();
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [fetchUserProfile, logout]);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
