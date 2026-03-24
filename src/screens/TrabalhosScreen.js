import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTrabalhos, deleteTrabalho } from '../database/TrabalhoRepository';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import globalStyles from '../styles/globalStyles';
import { colors, spacing, fontSize } from '../styles/theme';

function formatDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

export default function TrabalhosScreen({ navigation }) {
    const [trabalhos, setTrabalhos] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = useCallback(async () => {
        const data = await getTrabalhos();
        setTrabalhos(data);
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const handleDelete = async () => {
        if (deleteTarget) {
            await deleteTrabalho(deleteTarget.id);
            setDeleteTarget(null);
            load();
        }
    };

    const renderItem = ({ item }) => (
        <Card onPress={() => navigation.navigate('Atividades', { trabalho: item })}>
            <View style={globalStyles.spaceBetween}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={s.name}>{item.nome}</Text>
                    <Text style={s.date}>Entrega: {formatDate(item.data_entrega)}</Text>
                    <Text style={s.hours}>{item.horas_estimadas || 0}h estimadas</Text>
                </View>
                <View style={s.actions}>
                    <StatusBadge situacao={item.situacao || 'Pendente'} />
                    <View style={s.iconRow}>
                        <Pressable
                            onPress={() => navigation.navigate('TrabalhoForm', { trabalho: item })}
                            hitSlop={12}
                            style={s.iconBtn}
                        >
                            <Ionicons name="create-outline" size={20} color={colors.primary} />
                        </Pressable>
                        <Pressable
                            onPress={() => setDeleteTarget(item)}
                            hitSlop={12}
                            style={s.iconBtn}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.danger} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={trabalhos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyState icon="briefcase-outline" message="Nenhum trabalho cadastrado" />}
                showsVerticalScrollIndicator={false}
            />
            <Pressable
                style={globalStyles.fab}
                onPress={() => navigation.navigate('TrabalhoForm', { trabalho: null })}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </Pressable>
            <ConfirmModal
                visible={!!deleteTarget}
                message={`Deseja excluir o trabalho "${deleteTarget?.nome}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </View>
    );
}

const s = StyleSheet.create({
    name: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.text,
    },
    date: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    hours: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 1,
    },
    actions: {
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    iconRow: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    iconBtn: {
        padding: spacing.xs,
    },
});
