import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task, useTasks, Priority } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Swipeable } from 'react-native-gesture-handler';

const hapticOptions = { enableVibrateFallback: true, ignoreAndroidSystemSettings: false };

const priorityColors: Record<Priority, string> = {
  low: '#3498db',
  medium: '#f1c40f',
  high: '#e74c3c',
};

type Props = {
  task: Task;
  onEdit: () => void;
};

export default function TaskItem({ task, onEdit }: Props) {
  const { toggleTask, deleteTask } = useTasks();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors, task.priority);

  const handleToggle = () => {
    ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
    toggleTask(task.id);
  }

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <TouchableOpacity style={styles.leftAction} onPress={() => deleteTask(task.id)}>
        <Animated.View style={[styles.actionIcon, { transform: [{ translateX: trans }] }]}>
          <Icon name="delete" size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [-1, 0, 0, 20],
    });
    return (
      <TouchableOpacity style={styles.rightAction} onPress={handleToggle}>
        <Animated.View style={[styles.actionIcon, { transform: [{ translateX: trans }] }]}>
          <Icon name={task.completed ? "close" : "check"} size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
      <View style={styles.item}>
          <View style={styles.contentContainer}>
              <TouchableOpacity onPress={handleToggle} style={styles.iconContainer}>
                  <Icon 
                  name={task.completed ? "check-box" : "check-box-outline-blank"} 
                  size={24} 
                  color={task.completed ? themeColors.success : themeColors.text} 
                  />
              </TouchableOpacity>

              <TouchableOpacity onLongPress={onEdit} style={styles.editButton}>
                <Text style={[styles.title, task.completed && styles.completed]}>
                    {task.title}
                </Text>
              </TouchableOpacity>

          </View>

          {task.dueDate && (
              <View style={styles.dueDateContainer}>
                  <Icon name="alarm" size={16} color={themeColors.subtext} />
                  <Text style={styles.dueDateText}>Lembrete: {new Date(task.dueDate).toLocaleString('pt-BR')}</Text>
              </View>
          )}

          {task.imageUri && (
              <Image source={{ uri: task.imageUri }} style={styles.image} />
          )}
      </View>
    </Swipeable>
  );
}

const getStyles = (themeColors: any, priority: Priority) => StyleSheet.create({
  item: {
    backgroundColor: themeColors.card,
    borderRadius: 10,
    marginVertical: 5,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: priorityColors[priority],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
  },
  editButton: {
    flex: 1,
  },
  title: {
    color: themeColors.text,
    fontSize: 16,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: themeColors.subtext,
  },
  leftAction: {
    backgroundColor: themeColors.error,
    justifyContent: 'center',
    flex: 1,
    borderRadius: 10,
    marginVertical: 5,
  },
  rightAction: {
    backgroundColor: themeColors.success,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    borderRadius: 10,
    marginVertical: 5,
  },
  actionIcon: {
    padding: 20,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
    backgroundColor: themeColors.background,
    borderRadius: 6,
  },
  dueDateText: {
    color: themeColors.subtext,
    fontSize: 12,
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
});
