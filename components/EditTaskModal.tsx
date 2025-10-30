import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Task, Priority } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newTitle: string, newPriority: Priority) => void;
  task: Task | null;
};

export default function EditTaskModal({ visible, onClose, onSubmit, task }: Props) {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  useEffect(() => {
    if (task) {
      setNewTitle(task.title);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = () => {
    if (newTitle.trim()) {
      ReactNativeHapticFeedback.trigger("impactMedium", hapticOptions);
      onSubmit(newTitle.trim(), priority);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Editar Tarefa</Text>
          <TextInput
            style={styles.input}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Novo título da tarefa"
            placeholderTextColor={themeColors.subtext}
            autoFocus={true}
          />
          <View style={styles.priorityContainer}>
            <View style={styles.priorityButtons}>
              <TouchableOpacity 
                style={[styles.priorityButton, priority === 'low' && styles.lowSelected]} 
                onPress={() => setPriority('low')}>
                <Text style={[styles.priorityButtonText, priority === 'low' && styles.selectedText]}>Baixa</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.priorityButton, priority === 'medium' && styles.mediumSelected]} 
                onPress={() => setPriority('medium')}>
                <Text style={[styles.priorityButtonText, priority === 'medium' && styles.selectedText]}>Média</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.priorityButton, priority === 'high' && styles.highSelected]} 
                onPress={() => setPriority('high')}>
                <Text style={[styles.priorityButtonText, priority === 'high' && styles.selectedText]}>Alta</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSubmit]} onPress={handleSubmit}>
              <Text style={styles.textStyle}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const getStyles = (themeColors: any) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: themeColors.card,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  input: {
    width: '100%',
    backgroundColor: themeColors.background,
    color: themeColors.text,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  priorityContainer: {
    width: '100%',
    marginBottom: 20,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: themeColors.card,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: themeColors.seperator,
  },
  lowSelected: { backgroundColor: '#3498db', borderColor: '#3498db' },
  mediumSelected: { backgroundColor: '#f1c40f', borderColor: '#f1c40f' },
  highSelected: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
  priorityButtonText: {
    color: themeColors.text,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonClose: {
    backgroundColor: themeColors.error,
  },
  buttonSubmit: {
    backgroundColor: themeColors.accent,
  },
  textStyle: {
    color: themeColors.buttonText,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
