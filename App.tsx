import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './navigation/AppNavigator';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

enableScreens();

export default function App() {
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    async function setupNotifee() {
      await notifee.requestPermission();

      await notifee.createChannel({
        id: 'alarms',
        name: 'Alarmes de Tarefas',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        const { notification } = initialNotification;
        navigationRef.current?.navigate('Alarm', { 
          taskTitle: notification.body, 
          taskId: notification.data?.taskId,
          notificationId: notification.id
        });
      }
    }

    setupNotifee();

    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        navigationRef.current?.navigate('Alarm', { 
          taskTitle: detail.notification?.body, 
          taskId: detail.notification?.data?.taskId,
          notificationId: detail.notification?.id
        });
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        navigationRef.current?.navigate('Alarm', { 
          taskTitle: detail.notification?.body, 
          taskId: detail.notification?.data?.taskId,
          notificationId: detail.notification?.id
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <TaskProvider>
            <NavigationContainer ref={navigationRef}>
              <AppNavigator />
            </NavigationContainer>
          </TaskProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
