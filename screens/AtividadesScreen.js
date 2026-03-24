import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import styles from '../styles';
import { useCallback, useState } from 'react';
import AtividadeDAO from '../database/AtividadeDAO';
import { useFocusEffect } from '@react-navigation/native';

const getBadgeStyle = (situacao) => {
    switch (situacao) {
        case 'Concluído': return { badge: styles.badgeConcluido, text: styles.badgeTextConcluido };
        case 'Cancelado': return { badge: styles.badgeCancelado, text: styles.badgeTextCancelado };
        default: return { badge: styles.badgePendente, text: styles.badgeTextPendente };
    }
};

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

    const renderItem = ({ item }) => {
        const badgeStyle = getBadgeStyle(item.situacao);
        return (
            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle}>{item.nome}</Text>
                        {!!item.descricao && <Text style={styles.cardSubtitle} numberOfLines={2}>{item.descricao}</Text>}
                        <Text style={styles.cardDetail}>Trabalho #{item.idTrabalho}  {'\u2022'}  {item.horas_previstas}h prev. / {item.horas_concluidas}h concl.</Text>
                        <View style={[styles.badge, badgeStyle.badge]}>
                            <Text style={[styles.badgeText, badgeStyle.text]}>{item.situacao}</Text>
                        </View>
                    </View>
                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.editBtn]}
                            onPress={() => navigation.navigate('AtividadesAdd', { atividade: item })}
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
                                    { text: 'Deletar', style: 'destructive', onPress: () => deletarAtividade(item.id) }
                                ]
                            )}
                        >
                            <Text style={styles.actionBtnText}>{'\uD83D\uDDD1\uFE0F'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={atividades}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.scrollContent}
                ListEmptyComponent={<Text style={styles.listaVazia}>Nenhuma atividade cadastrada</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AtividadesAdd')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}
