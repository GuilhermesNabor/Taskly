import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, Image, Platform } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import fs from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { addTask } = useTasks();
  const navigation = useNavigation<any>();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const handleImageResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
    } else if (response.assets && response.assets[0].uri) {
      const sourceUri = response.assets[0].uri;
      const fileName = sourceUri.split('/').pop();
      const destPath = `${fs.DocumentDirectoryPath}/${fileName}`;

      try {
        await fs.copyFile(sourceUri, destPath);
        setImageUri(Platform.OS === 'android' ? 'file://' + destPath : destPath);
      } catch (error) {
        console.error('Error copying file', error);
        Alert.alert('Erro', 'Falha ao salvar a imagem.');
      }
    }
  };

  const selectImage = () => {
    Alert.alert(
      'Adicionar Imagem',
      'Escolha uma opção',
      [
        {
          text: 'Tirar Foto',
          onPress: () => launchCamera({ mediaType: 'photo', saveToPhotos: true }, handleImageResponse),
        },
        {
          text: 'Escolher da Galeria',
          onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImageResponse),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Digite uma descrição para a tarefa!');
      return;
    }
    addTask(title, imageUri || undefined);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descreva sua tarefa..."
        placeholderTextColor={themeColors.subtext}
        value={title}
        onChangeText={setTitle}
      />

      {imageUri && (
        <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeImageButton}>
                <Icon name="close" size={20} color={themeColors.buttonText} />
            </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.imagePickerButton} onPress={selectImage}>
        <Icon name="photo-camera" size={20} color={themeColors.accent} />
        <Text style={styles.imagePickerButtonText}>Adicionar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Salvar Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (themeColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    padding: 20,
  },
  input: {
    backgroundColor: themeColors.card,
    color: themeColors.text,
    fontSize: 16,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: themeColors.seperator,
  },
  imagePickerButtonText: {
    color: themeColors.accent,
    fontSize: 16,
    marginLeft: 10,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 5,
  },
  button: {
    backgroundColor: themeColors.button,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: themeColors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
