import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { createTables } from '../database/Database.js';
import styles from '../styles';

export default function HomeScreen({ navigation }) {
  const [bancoPronto, setBancoPronto] = useState(false);

  const setup = async () => {
    await createTables();
    setBancoPronto(true);
  };

  useEffect(() => {
    setup();
  }, []);

  if (!bancoPronto) {
    return (
      <View style={styles.containerCentered}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const menuItems = [
    { screen: 'Alunos', icon: '\uD83D\uDC65', title: 'Alunos', desc: 'Gerenciar alunos cadastrados' },
    { screen: 'Trabalhos', icon: '\uD83D\uDCCB', title: 'Trabalhos', desc: 'Gerenciar trabalhos e entregas' },
    { screen: 'Atividades', icon: '\u2705', title: 'Atividades', desc: 'Controlar atividades dos trabalhos' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.homeHeader}>
          <Text style={styles.homeTitle}>Bem-vindo!</Text>
          <Text style={styles.homeSubtitle}>O que deseja fazer hoje?</Text>
        </View>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.homeCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.homeCardIcon}>{item.icon}</Text>
            <View style={styles.homeCardContent}>
              <Text style={styles.homeCardTitle}>{item.title}</Text>
              <Text style={styles.homeCardDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.homeCardArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.creditosBotao}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Creditos')}
        >
          <Text style={styles.creditosBotaoTexto}>Créditos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
