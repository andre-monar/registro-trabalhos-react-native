import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import { useCallback, useState } from 'react';
import AtividadeDAO from '../database/AtividadeDAO';
import { useFocusEffect } from '@react-navigation/native';

export default function AtividadesScreen({ navigation }) {
    const [atividades, setAtividades] = useState([]);

    useFocusEffect(
        useCallback(() => {
            carregarAtividades();
        }, [])
    );

    const carregarAtividades = async () => {
        const lista = await AtividadeDAO.getAll();
        setAtividades(lista);
    };

    const deletarAtividade = async (id) => {
        try {
            await AtividadeDAO.delete(id);
            carregarAtividades();
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.tbLinhaAtividade}>
            <Text style={styles.celulaAtividadeIdTrabalho}>{item.idTrabalho}</Text>
            <Text style={styles.celulaAtividadeNomeTrabalho}>{item.nomeTrabalho}</Text>
            <Text style={styles.celulaId}>{item.id}</Text>
            <Text style={styles.celulaAtividadeNome}>{item.nome}</Text>
            <Text style={styles.celulaAtividadeDesc}>{item.descricao}</Text>
            <Text style={styles.celulaAtividadeHoras}>{item.horas_previstas}h</Text>
            <Text style={styles.celulaAtividadeHoras}>{item.horas_concluidas}h</Text>
            <Text style={styles.celulaAtividadeSituacao}>{item.situacao}</Text>
            <View style={styles.celulaTrabalhoAcoes}>
                <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => navigation.navigate('AtividadesAdd', { atividade: item })}
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
                            { text: 'Deletar', style: 'destructive', onPress: () => deletarAtividade(item.id) }
                        ]
                    )}
                >
                    <Text style={styles.textoBotaoDeletar}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                <View>
                    <View style={styles.tbCabecalhoAtividade}>
                        <Text style={styles.celulaAtividadeTrabalho}>TRABALHO</Text>
                        <Text style={styles.celulaId}>ID</Text>
                        <Text style={styles.celulaAtividadeNome}>NOME</Text>
                        <Text style={styles.celulaAtividadeDesc}>DESCRIÇÃO</Text>
                        <Text style={styles.celulaAtividadeHoras}>H.PREV</Text>
                        <Text style={styles.celulaAtividadeHoras}>H.CONC</Text>
                        <Text style={styles.celulaAtividadeSituacao}>SITUAÇÃO</Text>
                        <Text style={styles.celulaTrabalhoAcoes}>AÇÕES</Text>
                    </View>

                    <FlatList
                        data={atividades}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('AtividadesAdd')}
            >
                <Text style={styles.textoBotao}>Adicionar</Text>
            </TouchableOpacity>
        </View>
    );
}