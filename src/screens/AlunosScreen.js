import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAlunos, deleteAluno } from '../database/AlunoRepository';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import globalStyles from '../styles/globalStyles';
import { colors, spacing, fontSize } from '../styles/theme';

export default function AlunosScreen({ navigation }) {
    const [alunos, setAlunos] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadAlunos = useCallback(async () => {
        const data = await getAlunos();
        setAlunos(data);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAlunos();
        }, [loadAlunos])
    );

    const handleDelete = async () => {
        if (deleteTarget) {
            await deleteAluno(deleteTarget.id);
            setDeleteTarget(null);
            loadAlunos();
        }
    };

    const renderItem = ({ item }) => (
        <Card onPress={() => navigation.navigate('AlunoForm', { aluno: item })}>
            <View style={globalStyles.spaceBetween}>
                <View style={{ flex: 1 }}>
                    <Text style={s.name}>{item.nome}</Text>
                    <Text style={s.ra}>RA: {item.ra}</Text>
                </View>
                <Pressable
                    onPress={() => setDeleteTarget(item)}
                    hitSlop={12}
                    style={s.deleteBtn}
                >
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </Pressable>
            </View>
        </Card>
    );

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={alunos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyState icon="people-outline" message="Nenhum aluno cadastrado" />}
                showsVerticalScrollIndicator={false}
            />
            <Pressable
                style={globalStyles.fab}
                onPress={() => navigation.navigate('AlunoForm', { aluno: null })}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </Pressable>
            <ConfirmModal
                visible={!!deleteTarget}
                message={`Deseja excluir o aluno "${deleteTarget?.nome}"?`}
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
    ra: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    deleteBtn: {
        padding: spacing.sm,
    },
});
