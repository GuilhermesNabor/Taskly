import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useTasks, Task } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import TaskItem from '../components/TaskItem';
import EditTaskModal from '../components/EditTaskModal';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
  const { tasks, editTask } = useTasks();
  const { theme, toggleTheme, themeColors } = useTheme();
  const navigation = useNavigation<any>();

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleEditSubmit = (newTitle: string) => {
    if (selectedTask) {
      editTask(selectedTask.id, newTitle);
    }
    handleCloseEditModal();
  };

  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Taskly</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Icon name="brightness-6" size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onEdit={() => handleOpenEditModal(item)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa ainda 😴</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addText}>＋</Text>
      </TouchableOpacity>

      <EditTaskModal
        visible={isModalVisible}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        task={selectedTask}
      />
    </View>
  );
}

const getStyles = (themeColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  empty: {
    color: themeColors.subtext,
    textAlign: 'center',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: themeColors.button,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addText: {
    color: themeColors.buttonText,
    fontSize: 32,
    marginBottom: 4,
  },
});
