import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import { useCallback, useState } from 'react';
import TrabalhoDAO from '../database/TrabalhoDAO';
import { useFocusEffect } from '@react-navigation/native';

export default function TrabalhosScreen({ navigation }) {
    const [trabalhos, setTrabalhos] = useState([]);

    useFocusEffect(
        useCallback(() => {
            carregarTrabalhos();
        }, [])
    );

    const carregarTrabalhos = async () => {
        const lista = await TrabalhoDAO.getAll();
        setTrabalhos(lista);
    };

    const deletarTrabalho = async (id) => {
        try {
            await TrabalhoDAO.delete(id);
            carregarTrabalhos();
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.tbLinhaTrabalho}>
            <Text style={styles.celulaId}>{item.id}</Text>
            <Text style={styles.celulaTrabalhoNome}>{item.nome}</Text>
            <Text style={styles.celulaTrabalhoDesc}>{item.descricao}</Text>
            <Text style={styles.celulaTrabalhoData}>{item.data_entrega}</Text>
            <Text style={styles.celulaTrabalhoSituacao}>{item.situacao}</Text>
            <View style={styles.celulaTrabalhoAcoes}>
                <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => navigation.navigate('TrabalhosAdd', { trabalho: item })}
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
                            { text: 'Deletar', style: 'destructive', onPress: () => deletarTrabalho(item.id) }
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
                    <View style={styles.tbCabecalhoTrabalho}>
                        <Text style={styles.celulaId}>ID</Text>
                        <Text style={styles.celulaTrabalhoNome}>NOME</Text>
                        <Text style={styles.celulaTrabalhoDesc}>DESCRIÇÃO</Text>
                        <Text style={styles.celulaTrabalhoData}>ENTREGA</Text>
                        <Text style={styles.celulaTrabalhoSituacao}>SITUAÇÃO</Text>
                        <Text style={styles.celulaAcoes}>AÇÕES</Text>
                    </View>

                    <FlatList
                        data={trabalhos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('TrabalhosAdd')}
            >
                <Text style={styles.textoBotao}>Adicionar</Text>
            </TouchableOpacity>
        </View>
    );
}