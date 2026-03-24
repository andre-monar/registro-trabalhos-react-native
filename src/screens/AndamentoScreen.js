import { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { getTrabalhos } from '../database/TrabalhoRepository';
import { getAtividadesByTrabalho, updateAndamentoAtividade } from '../database/AtividadeRepository';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import globalStyles from '../styles/globalStyles';
import { colors, spacing, fontSize, radius } from '../styles/theme';

export default function AndamentoScreen() {
    const [trabalhos, setTrabalhos] = useState([]);
    const [selectedTrabalho, setSelectedTrabalho] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [editState, setEditState] = useState({});

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const data = await getTrabalhos();
                setTrabalhos(data);
            })();
        }, [])
    );

    const loadAtividades = async (idTrabalho) => {
        if (!idTrabalho) {
            setAtividades([]);
            setEditState({});
            return;
        }
        const data = await getAtividadesByTrabalho(idTrabalho);
        setAtividades(data);
        const state = {};
        data.forEach(a => {
            state[a.id] = {
                horas: String(a.horas_concluidas || 0),
                situacao: a.situacao || 'Pendente',
            };
        });
        setEditState(state);
    };

    const handleSelectTrabalho = (id) => {
        setSelectedTrabalho(id);
        loadAtividades(id);
    };

    const updateField = (atId, field, value) => {
        setEditState(prev => ({
            ...prev,
            [atId]: { ...prev[atId], [field]: value },
        }));
    };

    const handleSave = async (atId) => {
        const state = editState[atId];
        if (!state) return;
        const horas = parseFloat(state.horas) || 0;
        try {
            await updateAndamentoAtividade(atId, horas, state.situacao);
            Alert.alert('Salvo', 'Andamento atualizado.');
            loadAtividades(selectedTrabalho);
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar.');
        }
    };

    const totais = atividades.reduce(
        (acc, a) => ({
            previstas: acc.previstas + (a.horas_previstas || 0),
            concluidas: acc.concluidas + (a.horas_concluidas || 0),
        }),
        { previstas: 0, concluidas: 0 }
    );
    const percentGeral = totais.previstas > 0
        ? Math.round((totais.concluidas / totais.previstas) * 100)
        : 0;

    const renderHeader = () => (
        <>
            <Text style={globalStyles.inputLabel}>Selecione o Trabalho</Text>
            <View style={globalStyles.pickerContainer}>
                <Picker
                    selectedValue={selectedTrabalho}
                    onValueChange={handleSelectTrabalho}
                    style={{ color: colors.text }}
                >
                    <Picker.Item label="Selecione..." value={null} />
                    {trabalhos.map(t => (
                        <Picker.Item key={t.id} label={t.nome} value={t.id} />
                    ))}
                </Picker>
            </View>
            {selectedTrabalho && atividades.length > 0 && (
                <View style={s.resumo}>
                    <Text style={s.resumoTitle}>Resumo do Trabalho</Text>
                    <View style={s.resumoRow}>
                        <View style={s.resumoItem}>
                            <Text style={s.resumoValue}>{totais.concluidas}h</Text>
                            <Text style={s.resumoLabel}>Concluídas</Text>
                        </View>
                        <View style={s.resumoItem}>
                            <Text style={s.resumoValue}>{totais.previstas}h</Text>
                            <Text style={s.resumoLabel}>Previstas</Text>
                        </View>
                        <View style={s.resumoItem}>
                            <Text style={[s.resumoValue, { color: colors.primary }]}>{percentGeral}%</Text>
                            <Text style={s.resumoLabel}>Concluído</Text>
                        </View>
                    </View>
                    <View style={s.progressBarBg}>
                        <View style={[s.progressBarFill, { width: `${Math.min(percentGeral, 100)}%` }]} />
                    </View>
                </View>
            )}
        </>
    );

    const renderItem = ({ item }) => {
        const state = editState[item.id] || { horas: '0', situacao: 'Pendente' };
        const pct = item.horas_previstas > 0
            ? Math.round(((parseFloat(state.horas) || 0) / item.horas_previstas) * 100)
            : 0;

        return (
            <View style={s.card}>
                <View style={globalStyles.spaceBetween}>
                    <Text style={s.atName}>{item.nome}</Text>
                    <StatusBadge situacao={state.situacao} />
                </View>
                <Text style={s.atAluno}>{item.nomeAluno || 'Sem aluno'}</Text>

                <View style={s.progressBarBg}>
                    <View style={[s.progressBarFill, { width: `${Math.min(pct, 100)}%` }]} />
                </View>
                <Text style={s.pctText}>{pct}% ({parseFloat(state.horas) || 0}h / {item.horas_previstas || 0}h)</Text>

                <View style={s.editRow}>
                    <View style={{ flex: 1, marginRight: spacing.sm }}>
                        <Text style={s.editLabel}>Horas Concluídas</Text>
                        <TextInput
                            style={s.editInput}
                            value={state.horas}
                            onChangeText={(v) => updateField(item.id, 'horas', v)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.editLabel}>Situação</Text>
                        <View style={s.editPickerWrap}>
                            <Picker
                                selectedValue={state.situacao}
                                onValueChange={(v) => updateField(item.id, 'situacao', v)}
                                style={{ color: colors.text, marginVertical: -8 }}
                            >
                                <Picker.Item label="Pendente" value="Pendente" />
                                <Picker.Item label="Concluída" value="Concluída" />
                                <Picker.Item label="Cancelada" value="Cancelada" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <Pressable
                    style={[globalStyles.button, { marginTop: spacing.sm }]}
                    onPress={() => handleSave(item.id)}
                >
                    <Text style={globalStyles.buttonText}>Salvar</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <View style={globalStyles.screenContainer}>
            <FlatList
                data={selectedTrabalho ? atividades : []}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    selectedTrabalho
                        ? <EmptyState icon="list-outline" message="Nenhuma atividade neste trabalho" />
                        : null
                }
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
}

const s = StyleSheet.create({
    resumo: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    resumoTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    resumoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.sm,
    },
    resumoItem: {
        alignItems: 'center',
    },
    resumoValue: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        color: colors.text,
    },
    resumoLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: spacing.xs,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    atName: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.text,
        flex: 1,
        marginRight: spacing.sm,
    },
    atAluno: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
        marginBottom: spacing.xs,
    },
    pctText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    editRow: {
        flexDirection: 'row',
        marginTop: spacing.sm,
    },
    editLabel: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    editInput: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm,
        padding: spacing.sm,
        fontSize: fontSize.md,
        color: colors.text,
    },
    editPickerWrap: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm,
        overflow: 'hidden',
    },
});
