import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAtividadesByTrabalho, deleteAtividade } from '../database/AtividadeRepository';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import globalStyles from '../styles/globalStyles';
import { colors, spacing, fontSize } from '../styles/theme';

export default function AtividadesScreen({ navigation, route }) {
    const { trabalho } = route.params;
    const [atividades, setAtividades] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = useCallback(async () => {
        const data = await getAtividadesByTrabalho(trabalho.id);
        setAtividades(data);
    }, [trabalho.id]);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const handleDelete = async () => {
        if (deleteTarget) {
            await deleteAtividade(deleteTarget.id);
            setDeleteTarget(null);
            load();
        }
    };

    const renderHeader = () => (
        <View style={s.header}>
            <Text style={s.headerTitle}>{trabalho.nome}</Text>
            <StatusBadge situacao={trabalho.situacao || 'Pendente'} />
            <Text style={s.headerSub}>
                {trabalho.horas_estimadas || 0}h estimadas
            </Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <Card onPress={() => navigation.navigate('AtividadeForm', { trabalho, atividade: item })}>
            <View style={globalStyles.spaceBetween}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={s.atName}>{item.nome}</Text>
                    <Text style={s.atAluno}>
                        {item.nomeAluno || 'Sem aluno atribuído'}
                    </Text>
                    <Text style={s.atHoras}>
                        {item.horas_concluidas || 0}h / {item.horas_previstas || 0}h
                    </Text>
                </View>
                <View style={s.actions}>
                    <StatusBadge situacao={item.situacao || 'Pendente'} />
                    <Pressable
                        onPress={() => setDeleteTarget(item)}
                        hitSlop={12}
                        style={s.iconBtn}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                    </Pressable>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={atividades}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={<EmptyState icon="list-outline" message="Nenhuma atividade cadastrada" />}
                showsVerticalScrollIndicator={false}
            />
            <Pressable
                style={globalStyles.fab}
                onPress={() => navigation.navigate('AtividadeForm', { trabalho, atividade: null })}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </Pressable>
            <ConfirmModal
                visible={!!deleteTarget}
                message={`Deseja excluir a atividade "${deleteTarget?.nome}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </View>
    );
}

const s = StyleSheet.create({
    header: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        gap: spacing.xs,
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        color: colors.text,
    },
    headerSub: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    atName: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.text,
    },
    atAluno: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    atHoras: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: '500',
        marginTop: 2,
    },
    actions: {
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    iconBtn: {
        padding: spacing.xs,
    },
});
