import React, { createContext, useContext, useEffect, useState } from 'react';
import { LayoutAnimation, UIManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  imageUri?: string;
  dueDate?: number;
  notificationId?: string;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (title: string, imageUri: string | undefined, priority: Priority, dueDate?: number) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newTitle: string, newPriority: Priority, newDueDate?: number) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

async function setupNotifications() {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'alarms',
    name: 'Alarmes de Tarefas',
    importance: AndroidImportance.HIGH,
    sound: 'default', // Placeholder, will be customized in Phase 2
  });

  return channelId;
}

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setupNotifications();
    (async () => {
      const stored = await AsyncStorage.getItem('@tasks');
      if (stored) setTasks(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (title: string, imageUri: string | undefined, priority: Priority, dueDate?: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const id = Date.now().toString();
    let notificationId: string | undefined;

    if (dueDate && dueDate > Date.now()) {
      notificationId = Math.random().toString(36).substring(7);
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: dueDate,
      };
      await notifee.createTriggerNotification(
        { 
          id: notificationId,
          title: 'Lembrete de Tarefa', 
          body: title, 
          android: { 
            channelId: 'alarms', 
            pressAction: { id: 'default' },
            fullScreenAction: {
              id: 'default',
            },
          },
          data: { taskId: id }
        },
        trigger,
      );
    }

    const newTask: Task = { id, title, completed: false, imageUri, priority, dueDate, notificationId };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete && taskToDelete.notificationId) {
      await notifee.cancelNotification(taskToDelete.notificationId);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const editTask = async (id: string, newTitle: string, newPriority: Priority, newDueDate?: number) => {
    const taskToEdit = tasks.find(t => t.id === id);
    if (taskToEdit && taskToEdit.notificationId) {
      await notifee.cancelNotification(taskToEdit.notificationId);
    }

    let newNotificationId: string | undefined;
    if (newDueDate && newDueDate > Date.now()) {
      newNotificationId = Math.random().toString(36).substring(7);
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: newDueDate,
      };
      await notifee.createTriggerNotification(
        { 
          id: newNotificationId,
          title: 'Tarefa Atualizada', 
          body: newTitle, 
          android: { 
            channelId: 'alarms', 
            pressAction: { id: 'default' },
            fullScreenAction: {
              id: 'default',
            },
          },
          data: { taskId: id }
        },
        trigger,
      );
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.map(t => (t.id === id ? { ...t, title: newTitle, priority: newPriority, dueDate: newDueDate, notificationId: newNotificationId } : t)));
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
