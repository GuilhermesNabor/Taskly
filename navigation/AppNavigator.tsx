import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { themeColors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: themeColors.card },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="AddTask" 
        component={AddTaskScreen} 
        options={{ title: 'Nova Tarefa' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
