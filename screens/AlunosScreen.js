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
        <View style={styles.tbLinha}>
            <Text style={styles.celulaId}>{item.id}</Text>
            <Text style={styles.celulaNome}>{item.nome}</Text>
            <Text style={styles.celulaRa}>{item.ra}</Text>
            <View style={styles.celulaAcoes}>
                <TouchableOpacity 
                    style={styles.botaoEditar}
                    onPress={() => navigation.navigate('AlunosAdd', { aluno: item })}
                >
                    <Text style={styles.textoBotaoEditar}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.botaoDeletar}
                    onPress={() => Alert.alert(
                        'Confirmar',
                        `Deletar "${item.nome}"?`,
                        [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Deletar', style: 'destructive', onPress: () => deletarAluno(item.id) }
                        ]
                    )}
                >
                    <Text style={styles.textoBotaoDeletar}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style = {styles.container}>
            <View style={styles.tbCabecalho}>
                <Text style={styles.celulaId}>ID</Text>
                <Text style={styles.celulaNome}>NOME</Text>
                <Text style={styles.celulaRa}>RA</Text>
                <Text style={styles.celulaAcoes}>AÇÕES</Text>
            </View>

            <FlatList
                data={alunos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                style={styles.lista}
            />
            
            <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('AlunosAdd')}
            >
                <Text style={styles.textoBotao}>Adicionar</Text>
            </TouchableOpacity>
        </View>
    );
}