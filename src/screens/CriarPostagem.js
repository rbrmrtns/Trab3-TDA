import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

export default function CriarPostagem({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    if (!titulo || !conteudo || !image) {
      return Alert.alert('Atenção', 'Preencha todos os campos e selecione uma imagem.');
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', titulo);
    formData.append('content', conteudo);
    
    const localUri = image;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image/jpeg`;

    if (type === 'image/jpg') type = 'image/jpeg';

    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });

    try {
      await api.post('/posts', formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
           return data; 
        },
      });
      Alert.alert('Sucesso', 'Post criado!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar o post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={conteudo} 
        onChangeText={setConteudo} 
        multiline 
      />

      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>{image ? 'Alterar Imagem' : 'Selecionar Imagem'}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <View style={styles.submitContainer}>
        <Button title={loading ? "Enviando..." : "Publicar Post"} onPress={handleCreatePost} disabled={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 5, backgroundColor: '#fff' },
  textArea: { height: 100, textAlignVertical: 'top' },
  imageButton: { backgroundColor: '#ddd', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  imageButtonText: { fontWeight: 'bold' },
  preview: { width: '100%', height: 200, marginTop: 10, borderRadius: 5 },
  submitContainer: { marginTop: 30 }
});