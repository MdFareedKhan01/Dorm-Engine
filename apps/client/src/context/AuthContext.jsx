import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMyProfile, login as loginApi, mapError, signup as signupApi, updateMyProfile } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'de_token';
const USER_KEY = 'de_user';

const ONBOARDED_KEY = 'de_onboarded';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const data = await getMyProfile();
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data?.user || null;
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (!token || !storedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    } catch {
      localStorage.removeItem(USER_KEY);
    }

    refreshProfile()
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    try {
      const result = await loginApi({ email, password });
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      setUser(result.user);
      return result.user;
    } catch (error) {
      throw new Error(mapError(error));
    }
  };

  const signup = async ({ name, email, password }) => {
    try {
      const result = await signupApi({ name, email, password });
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      setUser(result.user);
      return result.user;
    } catch (error) {
      throw new Error(mapError(error));
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ONBOARDED_KEY);
    setUser(null);
  };

  const setOnboarded = () => {
    if (user?.role === 'student') {
      localStorage.setItem(ONBOARDED_KEY, 'true');
    }
  };

  const saveProfile = async (payload) => {
    try {
      const result = await updateMyProfile(payload);
      if (result?.user) {
        setUser(result.user);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      }
      return result?.user;
    } catch (error) {
      throw new Error(mapError(error));
    }
  };

  const isOnboarded = () => {
    return user?.role === 'student' && localStorage.getItem(ONBOARDED_KEY) === 'true';
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    logout,
    refreshProfile,
    saveProfile,
    setOnboarded,
    isOnboarded: isOnboarded(),
    isAuthenticated: Boolean(user),
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
