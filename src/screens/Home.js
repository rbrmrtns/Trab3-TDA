import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Home({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [temMais, setTemMais] = useState(true);

  const { user } = useAuth();

  async function carregarPosts(reset = false) {
    if (loading) return;
    
    const paginaACarregar = reset ? 1 : pagina;
    setLoading(true);

    try {
      const response = await api.get('/posts', {
        params: { page: paginaACarregar, limit: 5 }
      });

      const novosPosts = response.data.posts || [];

      if (reset) {
        setPosts(novosPosts);
        setPagina(2);
        setTemMais(novosPosts.length > 0);
      } else {
        if (novosPosts.length > 0) {
          setPosts(old => [...old, ...novosPosts]);
          setPagina(old => old + 1);
        } else {
          setTemMais(false);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar posts:', error);
      Alert.alert("Erro", "Não foi possível carregar o feed.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarPosts(true);
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Excluir", "Deseja apagar este post?", [
      { text: "Cancelar" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          try {
            await api.delete(`/posts/${id}`);
            setPosts(current => current.filter(post => post.id !== id));
            Alert.alert("Sucesso", "Post excluído.");
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir (você só pode apagar seus próprios posts).");
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
    const isDono = user && item.authorId === user.id;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={30} color="#555" />
          <View style={{marginLeft: 10}}>
              <Text style={styles.authorName}>{item.author?.name || "Anônimo"}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
          </View>
        </View>

        {item.imageId ? (
          <Image 
            source={{ uri: item.imageId }} 
            style={styles.postImage} 
            resizeMode="cover" 
          />
        ) : null}
        
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.content}</Text>
          
          <View style={styles.footer}>
            {isDono && (
              <TouchableOpacity
                onPress={() => navigation.navigate('ExcluirPostagem', { post: item })} 
                style={styles.deleteButton}
              >
                 <Ionicons name="trash-outline" size={22} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => String(item.id)} 
        renderItem={renderItem}
        onEndReached={() => { if(temMais) carregarPosts(); }}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>Nenhum post encontrado.</Text>}
        ListFooterComponent={loading && <ActivityIndicator size="small" color="#000" style={{margin: 20}}/>}
      />
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CriarPostagem')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#fff', margin: 10, borderRadius: 8, overflow: 'hidden', elevation: 3 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  authorName: { fontWeight: 'bold', fontSize: 14 },
  date: { fontSize: 12, color: '#666' },
  postImage: { width: '100%', height: 300, backgroundColor: '#eee' },
  content: { padding: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  body: { fontSize: 14, color: '#333', marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  deleteText: { color: 'red', marginLeft: 5, fontSize: 12 },
  fab: {
    position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center',
    right: 20, bottom: 20, backgroundColor: '#2196F3', borderRadius: 30, elevation: 5
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }
});