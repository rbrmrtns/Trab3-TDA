import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function ListaUsuarios() {
  const [users, setUsers] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function carregarUsers() {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await api.get('/users', {
        params: { page: pagina, limit: 15 }
      });

      const novosUsuarios = response.data.users || [];

      if (novosUsuarios.length > 0) {
        setUsers(oldUsers => {
          const allUsers = [...oldUsers, ...novosUsuarios];
          const uniqueUsers = Array.from(new Map(allUsers.map(item => [item.email, item])).values());
          return uniqueUsers;
        });
        setPagina(oldPagina => oldPagina + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Erro ao buscar usuários', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={24} color="#fff" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item, index) => item.email || String(index)}
        renderItem={renderItem}
        onEndReached={carregarUsers}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading && <ActivityIndicator size="small" color="#000" style={{ margin: 20 }} />}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  userCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 8, 
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  userInfo: {
    flex: 1
  },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }
});