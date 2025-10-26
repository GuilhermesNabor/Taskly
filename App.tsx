import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './navigation/AppNavigator';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';

enableScreens();

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TaskProvider>
    </ThemeProvider>
  );
}
