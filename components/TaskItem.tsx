import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task, useTasks } from '../context/TaskContext';

type Props = {
  task: Task;
};

export default function TaskItem({ task }: Props) {
  const { toggleTask, deleteTask } = useTasks();

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => toggleTask(task.id)}>
        <Text style={[styles.title, task.completed && styles.completed]}>
          {task.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTask(task.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  delete: {
    fontSize: 18,
  },
});
