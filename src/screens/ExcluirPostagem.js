import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function ExcluirPostagem({ route, navigation }) {
  const { post } = route.params;
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

    async function handleConfirmDelete() {
        if (!user || user.id !== post.authorId) {
        Alert.alert('Não autorizado', 'Você não tem permissão para excluir este post.');
        return;
        }

        setLoading(true);
        try {
            await api.delete(`/posts/${post.id}`);
            Alert.alert('Sucesso', 'Postagem excluída!');
            navigation.goBack();
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 403) {
                Alert.alert('Erro', 'O servidor negou a exclusão (permissão insuficiente).');
            } else {
                Alert.alert('Erro', 'Não foi possível excluir a postagem.');
            }
        } finally {
            setLoading(false);
        }
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.warningText}>Tem certeza que quer excluir esta postagem?</Text>
      <Text style={styles.subWarningText}>Essa ação não pode ser desfeita.</Text>

      <View style={styles.card}>
         <View style={styles.header}>
            <Ionicons name="person-circle-outline" size={30} color="#555" />
            <Text style={styles.authorName}>{post.author?.name || "Você"}</Text>
         </View>

         {post.imageId && (
           <Image source={{ uri: post.imageId }} style={styles.postImage} resizeMode="cover" />
         )}
         
         <View style={styles.content}>
           <Text style={styles.title}>{post.title}</Text>
           <Text style={styles.body}>{post.content}</Text>
         </View>
      </View>

      <TouchableOpacity 
        style={[styles.deleteButton, loading && styles.disabledButton]} 
        onPress={handleConfirmDelete}
        disabled={loading}
      >
        <Text style={styles.deleteButtonText}>
            {loading ? "EXCLUINDO..." : "EXCLUIR PERMANENTEMENTE"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>CANCELAR</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  warningText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  subWarningText: { fontSize: 14, color: '#666', marginBottom: 20 },
  
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', elevation: 3, marginBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  authorName: { fontWeight: 'bold', marginLeft: 10 },
  postImage: { width: '100%', height: 200, backgroundColor: '#eee' },
  content: { padding: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  body: { fontSize: 14, color: '#333' },

  deleteButton: { backgroundColor: '#d32f2f', width: '100%', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  disabledButton: { opacity: 0.6 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { padding: 15 },
  cancelButtonText: { color: '#666', fontWeight: 'bold' }
});