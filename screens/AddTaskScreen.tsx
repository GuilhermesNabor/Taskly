import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const { addTask } = useTasks();
  const navigation = useNavigation<any>();

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Digite uma descrição para a tarefa!');
      return;
    }
    addTask(title);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descreva sua tarefa..."
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Salvar" onPress={handleAdd} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    fontSize: 16,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
});
