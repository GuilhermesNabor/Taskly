import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  themeColors: typeof colors.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemScheme || 'light');

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem('@theme') as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme(systemScheme || 'light');
      }
    })();
  }, [systemScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };

  const themeColors = theme === 'light' ? colors.light : colors.dark;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
