import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Telas
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Home from '../screens/Home';
import ListaUsuarios from '../screens/ListaUsuarios';
import CriarPostagem from '../screens/CriarPostagem';
import ExcluirPostagem from '../screens/ExcluirPostagem';

const Stack = createStackNavigator();

export default function Routes() {
  const { logado, loading, deslogar } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {logado ? (
          <>
            <Stack.Screen 
                name="Home" 
                component={Home} 
                options={({ navigation }) => ({ 
                    title: 'Feed',
                    headerTitleAlign: 'center',
                    
                    headerRight: () => (
                    <TouchableOpacity onPress={deslogar} style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'red', marginRight: 5, fontSize: 14 }}>Sair</Text>
                        <Ionicons name="log-out-outline" size={24} color="red" />
                    </TouchableOpacity>
                    ),

                    headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ListaUsuarios')} 
                        style={{ 
                        marginLeft: 15, 
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f0f0f0',
                        padding: 5,
                        borderRadius: 20
                        }}
                    >
                        <Ionicons name="people" size={20} color="#007bff" />
                        <Text style={{ marginLeft: 5, color: '#007bff', fontWeight: '600' }}>
                        Usuários
                        </Text>
                    </TouchableOpacity>
                    ),
                    
                    headerStyle: {
                    elevation: 0, 
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee'
                    }
                })} 
                />
            <Stack.Screen name="ListaUsuarios" component={ListaUsuarios} options={{ title: 'Usuários' }} />
            <Stack.Screen name="CriarPostagem" component={CriarPostagem} options={{ title: 'Nova Postagem' }} />
            <Stack.Screen name="ExcluirPostagem" component={ExcluirPostagem} options={{ title: 'Excluir Postagem', headerTintColor: 'red' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Cadastro' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}