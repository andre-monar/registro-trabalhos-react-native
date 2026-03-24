import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import styles, { colors } from '../styles';
import { useCallback, useState } from 'react';
import TrabalhoDAO from '../database/TrabalhoDAO';
import { useFocusEffect } from '@react-navigation/native';

const getBadgeStyle = (situacao) => {
    switch (situacao) {
        case 'Concluído': return { badge: styles.badgeConcluido, text: styles.badgeTextConcluido };
        case 'Cancelado': return { badge: styles.badgeCancelado, text: styles.badgeTextCancelado };
        default: return { badge: styles.badgePendente, text: styles.badgeTextPendente };
    }
};

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

    const renderItem = ({ item }) => {
        const badgeStyle = getBadgeStyle(item.situacao);
        return (
            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle}>{item.nome}</Text>
                        {!!item.descricao && <Text style={styles.cardSubtitle} numberOfLines={2}>{item.descricao}</Text>}
                        {!!item.data_entrega && <Text style={styles.cardDetail}>{'\uD83D\uDCC5'} Entrega: {item.data_entrega}</Text>}
                        <View style={[styles.badge, badgeStyle.badge]}>
                            <Text style={[styles.badgeText, badgeStyle.text]}>{item.situacao}</Text>
                        </View>
                    </View>
                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.editBtn]}
                            onPress={() => navigation.navigate('TrabalhosAdd', { trabalho: item })}
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
                                    { text: 'Deletar', style: 'destructive', onPress: () => deletarTrabalho(item.id) }
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
                data={trabalhos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.scrollContent}
                ListEmptyComponent={<Text style={styles.listaVazia}>Nenhum trabalho cadastrado</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('TrabalhosAdd')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}
