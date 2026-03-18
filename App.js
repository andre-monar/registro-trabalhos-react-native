import { StatusBar } from 'expo-status-bar';
import { Text, View, } from 'react-native';
import { useEffect, useState } from 'react';
import { createTables } from './database/Database.js';
import styles from './styles';


export default function App() {
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
    </View>
  );
}