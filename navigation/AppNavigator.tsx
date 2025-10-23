import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Minhas Tarefas' }} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Nova Tarefa' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
