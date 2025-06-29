import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../components/baseUrl';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user, setUser } = useAuth();
  const [dark, setDark] = useState(false);

  // 1) Initialize from localStorage fallback, then override from user.preferences.theme
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    setDark(stored === 'dark');
  }, []);

  // 2) When `user` loads/changes, sync from their saved preference
  useEffect(() => {
    if (user?.preferences?.theme) {
      setDark(user.preferences.theme === 'dark');
    }
  }, [user]);

  // 3) Whenever `dark` toggles, update <html> and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme','dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme','light');
    }
  }, [dark]);

  // 4) When toggling, push the new preference back to the server
  const toggle = async () => {
    const next = !dark;
    setDark(next);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
