import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import styles from '../styles';
import { useCallback, useState } from 'react';
import AlunoDAO from '../database/AlunoDAO';
import { useFocusEffect } from '@react-navigation/native';

export default function AlunosScreen({ navigation }) {
    const [alunos, setAlunos] = useState([]);

    useFocusEffect(
        useCallback(() => {
            carregarAlunos();
        }, [])
    );

    const carregarAlunos = async () => {
        const lista = await AlunoDAO.getAll();
        setAlunos(lista);
    };

    const deletarAluno = async (id) => {
        try {
            await AlunoDAO.delete(id);
            carregarAlunos();
        } catch (erro) {
            alert('Erro ao deletar: ' + erro.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text style={styles.cardSubtitle}>RA: {item.ra}</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.editBtn]}
                        onPress={() => navigation.navigate('AlunosAdd', { aluno: item })}
                    >
                        <Text style={styles.actionBtnText}>{'\u270F\uFE0F'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.deleteBtn]}
                        onPress={() => Alert.alert(
                            'Confirmar',
                            `Deletar "${item.nome}"?`,
                            [
                                { text: 'Cancelar', style: 'cancel' },
                                { text: 'Deletar', style: 'destructive', onPress: () => deletarAluno(item.id) }
                            ]
                        )}
                    >
                        <Text style={styles.actionBtnText}>{'\uD83D\uDDD1\uFE0F'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={alunos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.scrollContent}
                ListEmptyComponent={<Text style={styles.listaVazia}>Nenhum aluno cadastrado</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AlunosAdd')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}
