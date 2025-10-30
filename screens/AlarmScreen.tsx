import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function AlarmScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const { taskTitle, taskId, notificationId } = route.params;

  const handleSnooze = async () => {
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    };

    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: 'Lembrete de Tarefa (Adiado)',
        body: taskTitle,
        android: { channelId: 'alarms', pressAction: { id: 'default' } },
        data: { taskId },
      },
      trigger,
    );

    navigation.goBack();
  };

  const handleStop = async () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    if (notificationId) {
      await notifee.cancelNotification(notificationId);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="alarm" size={120} color={themeColors.accent} />
        <Text style={styles.title}>Lembrete!</Text>
        <Text style={styles.taskTitle}>{taskTitle}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.snoozeButton]} onPress={handleSnooze}>
          <Text style={styles.buttonText}>Adiar (10 min)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
          <Text style={styles.buttonText}>Parar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (themeColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    marginTop: 30,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 20,
    color: themeColors.subtext,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 150,
    alignItems: 'center',
    elevation: 3,
  },
  snoozeButton: {
    backgroundColor: themeColors.accent,
  },
  stopButton: {
    backgroundColor: themeColors.error,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
