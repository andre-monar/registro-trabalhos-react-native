import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, } from 'react-native';
import { useEffect, useState } from 'react';
import { createTables } from '../database/Database.js';
import styles from '../styles';

export default function HomeScreen({ navigation }) {
  const [status, setStatus] = useState('Aguardando...');

  // Inicializar banco ao abrir o app
  const setup = async () => {
        setStatus('Criando banco...');
        await createTables();
        setStatus('Banco criado! ✅');
    };

    useEffect(() => {
        setup();
    }, []);

  return (
    <View style={styles.container}>
        <Text>{status}</Text> 
        <StatusBar style="auto" />

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Alunos')}
        >
          <Text style={styles.textoBotao}>Alunos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Trabalhos')}
        >
          <Text style={styles.textoBotao}>Trabalhos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Atividades')}
        >
          <Text style={styles.textoBotao}>Atividades</Text>
        </TouchableOpacity>
    </View>
  );
}