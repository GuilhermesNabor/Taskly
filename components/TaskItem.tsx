import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task, useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

type Props = {
  task: Task;
  onEdit: () => void;
};

export default function TaskItem({ task, onEdit }: Props) {
  const { toggleTask, deleteTask } = useTasks();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.item}>
        <View style={styles.contentContainer}>
            <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.iconContainer}>
                <Icon 
                name={task.completed ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color={task.completed ? themeColors.success : themeColors.text} 
                />
            </TouchableOpacity>

            <Text style={[styles.title, task.completed && styles.completed]}>
                {task.title}
            </Text>

            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                    <Icon name="edit" size={22} color={themeColors.accent} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(task.id)}>
                    <Icon name="delete" size={24} color={themeColors.error} />
                </TouchableOpacity>
            </View>
        </View>
        {task.imageUri && (
            <Image source={{ uri: task.imageUri }} style={styles.image} />
        )}
    </View>
  );
}

const getStyles = (themeColors: any) => StyleSheet.create({
  item: {
    backgroundColor: themeColors.card,
    borderRadius: 10,
    marginVertical: 5,
    padding: 15,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
});
