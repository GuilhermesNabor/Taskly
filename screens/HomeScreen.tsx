import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { tasks } = useTasks();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem task={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa ainda 😴</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addText: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 4,
  },
});
