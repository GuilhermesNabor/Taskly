import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  imageUri?: string;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (title: string, imageUri?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newTitle: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('@tasks');
      if (stored) setTasks(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, imageUri?: string) => {
    setTasks([...tasks, { id: Date.now().toString(), title, completed: false, imageUri }]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const editTask = (id: string, newTitle: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, title: newTitle } : t)));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, editTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks deve ser usado dentro de TaskProvider');
  return context;
};
