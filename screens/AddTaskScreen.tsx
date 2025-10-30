import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, Image, Platform, ScrollView } from 'react-native';
import { useTasks, Priority } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import fs from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const hapticOptions = { enableVibrateFallback: true, ignoreAndroidSystemSettings: false };

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  const { addTask } = useTasks();
  const navigation = useNavigation<any>();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      const currentDate = selectedDate;
      if (pickerMode === 'date') {
        setPickerMode('time');
        setShowPicker(true);
        setDueDate(currentDate);
      } else {
        setDueDate(currentDate);
      }
    }
  };

  const handleImageResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
    else if (response.assets && response.assets[0].uri) {
      const sourceUri = response.assets[0].uri;
      const fileName = sourceUri.split('/').pop();
      const destPath = `${fs.DocumentDirectoryPath}/${fileName}`;
      try {
        await fs.copyFile(sourceUri, destPath);
        setImageUri(Platform.OS === 'android' ? 'file://' + destPath : destPath);
      } catch { Alert.alert('Erro', 'Falha ao salvar a imagem.'); }
    }
  };

  const selectImage = () => {
    Alert.alert('Adicionar Imagem', 'Escolha uma opção', [
        { text: 'Tirar Foto', onPress: () => launchCamera({ mediaType: 'photo', saveToPhotos: true }, handleImageResponse) },
        { text: 'Escolher da Galeria', onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImageResponse) },
        { text: 'Cancelar', style: 'cancel' },
    ], { cancelable: true });
  };

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Digite uma descrição para a tarefa!');
      return;
    }
    ReactNativeHapticFeedback.trigger("impactMedium", hapticOptions);
    addTask(title, imageUri || undefined, priority, dueDate?.getTime());
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput style={styles.input} placeholder="Descreva sua tarefa..." placeholderTextColor={themeColors.subtext} value={title} onChangeText={setTitle} />

      <View style={styles.priorityContainer}>
        <Text style={styles.priorityLabel}>Prioridade:</Text>
        <View style={styles.priorityButtons}>
          <TouchableOpacity style={[styles.priorityButton, priority === 'low' && styles.lowSelected]} onPress={() => setPriority('low')}><Text style={[styles.priorityButtonText, priority === 'low' && styles.selectedText]}>Baixa</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.priorityButton, priority === 'medium' && styles.mediumSelected]} onPress={() => setPriority('medium')}><Text style={[styles.priorityButtonText, priority === 'medium' && styles.selectedText]}>Média</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.priorityButton, priority === 'high' && styles.highSelected]} onPress={() => setPriority('high')}><Text style={[styles.priorityButtonText, priority === 'high' && styles.selectedText]}>Alta</Text></TouchableOpacity>
        </View>
      </View>

      {imageUri && (
        <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeImageButton}><Icon name="close" size={20} color={themeColors.buttonText} /></TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.optionButton} onPress={selectImage}>
        <Icon name="photo-camera" size={20} color={themeColors.accent} />
        <Text style={styles.optionButtonText}>Adicionar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={() => { setPickerMode('date'); setShowPicker(true); }}>
        <Icon name="alarm" size={20} color={themeColors.accent} />
        <Text style={styles.optionButtonText}>{dueDate ? `Lembrete: ${dueDate.toLocaleString('pt-BR')}` : 'Agendar Lembrete'}</Text>
      </TouchableOpacity>

      {dueDate && <TouchableOpacity onPress={() => setDueDate(undefined)}><Text style={styles.removeDateText}>Remover lembrete</Text></TouchableOpacity>}

      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Salvar Tarefa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (themeColors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColors.background, padding: 20 },
  input: { backgroundColor: themeColors.card, color: themeColors.text, fontSize: 16, padding: 15, borderRadius: 10, marginBottom: 20 },
  priorityContainer: { marginBottom: 20 },
  priorityLabel: { color: themeColors.text, fontSize: 16, marginBottom: 10 },
  priorityButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', backgroundColor: themeColors.card, marginHorizontal: 4, borderWidth: 1, borderColor: themeColors.seperator },
  lowSelected: { backgroundColor: '#3498db', borderColor: '#3498db' },
  mediumSelected: { backgroundColor: '#f1c40f', borderColor: '#f1c40f' },
  highSelected: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
  priorityButtonText: { color: themeColors.text },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  optionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: themeColors.card, padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: themeColors.seperator },
  optionButtonText: { color: themeColors.accent, fontSize: 16, marginLeft: 10 },
  removeDateText: { color: themeColors.error, textAlign: 'center', marginBottom: 20 },
  imagePreviewContainer: { marginBottom: 20, alignItems: 'center' },
  imagePreview: { width: '100%', height: 200, borderRadius: 10 },
  removeImageButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, padding: 5 },
  button: { backgroundColor: themeColors.button, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: themeColors.buttonText, fontSize: 16, fontWeight: 'bold' },
});
