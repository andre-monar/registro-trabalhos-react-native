import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, Switch, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import {
    insertTrabalho, updateTrabalho,
    getAlunosDoTrabalho, addAlunoAoTrabalho, removeAlunoDoTrabalho,
} from '../database/TrabalhoRepository';
import { getAlunos } from '../database/AlunoRepository';
import globalStyles from '../styles/globalStyles';
import { colors, spacing, fontSize } from '../styles/theme';

export default function TrabalhoFormScreen({ navigation, route }) {
    const editing = route.params?.trabalho;

    const [nome, setNome] = useState(editing?.nome || '');
    const [descricao, setDescricao] = useState(editing?.descricao || '');
    const [dataEntrega, setDataEntrega] = useState(
        editing?.data_entrega ? new Date(editing.data_entrega + 'T00:00:00') : new Date()
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [horasEstimadas, setHorasEstimadas] = useState(
        editing?.horas_estimadas ? String(editing.horas_estimadas) : ''
    );
    const [situacao, setSituacao] = useState(editing?.situacao || 'Pendente');

    const [todosAlunos, setTodosAlunos] = useState([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState({});

    useLayoutEffect(() => {
        navigation.setOptions({ title: editing ? 'Editar Trabalho' : 'Novo Trabalho' });
    }, [navigation, editing]);

    useEffect(() => {
        (async () => {
            const todos = await getAlunos();
            setTodosAlunos(todos);
            if (editing) {
                const vinculados = await getAlunosDoTrabalho(editing.id);
                const map = {};
                vinculados.forEach(a => { map[a.id] = true; });
                setAlunosSelecionados(map);
            }
        })();
    }, [editing]);

    const toggleAluno = (id) => {
        setAlunosSelecionados(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const formatDateBR = (d) => {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${d.getFullYear()}`;
    };

    const toISO = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const handleSave = async () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome do trabalho é obrigatório.');
            return;
        }
        const horas = parseFloat(horasEstimadas) || 0;

        try {
            let trabalhoId;
            if (editing) {
                await updateTrabalho(editing.id, nome.trim(), descricao.trim(), toISO(dataEntrega), horas, situacao);
                trabalhoId = editing.id;
            } else {
                trabalhoId = await insertTrabalho(nome.trim(), descricao.trim(), toISO(dataEntrega), horas, situacao);
            }

            if (editing) {
                const antigos = await getAlunosDoTrabalho(trabalhoId);
                for (const a of antigos) {
                    if (!alunosSelecionados[a.id]) {
                        await removeAlunoDoTrabalho(trabalhoId, a.id);
                    }
                }
            }
            for (const [idStr, sel] of Object.entries(alunosSelecionados)) {
                if (sel) await addAlunoAoTrabalho(trabalhoId, parseInt(idStr, 10));
            }

            navigation.goBack();
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar o trabalho.');
        }
    };

    return (
        <ScrollView style={globalStyles.screenContainer} keyboardShouldPersistTaps="handled">
            <Text style={globalStyles.inputLabel}>Nome *</Text>
            <TextInput
                style={globalStyles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Nome do trabalho"
                placeholderTextColor="#94A3B8"
            />

            <Text style={globalStyles.inputLabel}>Descrição</Text>
            <TextInput
                style={[globalStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descrição do trabalho"
                placeholderTextColor="#94A3B8"
                multiline
            />

            <Text style={globalStyles.inputLabel}>Data de Entrega</Text>
            <Pressable
                style={[globalStyles.input, globalStyles.row]}
                onPress={() => setShowDatePicker(true)}
            >
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <Text style={s.dateText}>{formatDateBR(dataEntrega)}</Text>
            </Pressable>
            {showDatePicker && (
                <DateTimePicker
                    value={dataEntrega}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, selected) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selected) setDataEntrega(selected);
                    }}
                />
            )}

            <Text style={globalStyles.inputLabel}>Horas Estimadas</Text>
            <TextInput
                style={globalStyles.input}
                value={horasEstimadas}
                onChangeText={setHorasEstimadas}
                placeholder="Ex: 20"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
            />

            <Text style={globalStyles.inputLabel}>Situação</Text>
            <View style={globalStyles.pickerContainer}>
                <Picker
                    selectedValue={situacao}
                    onValueChange={setSituacao}
                    style={{ color: colors.text }}
                >
                    <Picker.Item label="Pendente" value="Pendente" />
                    <Picker.Item label="Concluído" value="Concluído" />
                    <Picker.Item label="Cancelado" value="Cancelado" />
                </Picker>
            </View>

            <Text style={globalStyles.sectionTitle}>Alunos do Trabalho</Text>
            {todosAlunos.length === 0 ? (
                <Text style={s.emptyAlunos}>Nenhum aluno cadastrado. Cadastre alunos na aba Alunos.</Text>
            ) : (
                todosAlunos.map((aluno) => (
                    <View key={aluno.id} style={s.alunoRow}>
                        <Switch
                            value={!!alunosSelecionados[aluno.id]}
                            onValueChange={() => toggleAluno(aluno.id)}
                            trackColor={{ true: colors.primaryLight, false: colors.border }}
                            thumbColor={alunosSelecionados[aluno.id] ? colors.primary : '#f4f3f4'}
                        />
                        <View style={s.alunoInfo}>
                            <Text style={s.alunoNome}>{aluno.nome}</Text>
                            <Text style={s.alunoRa}>RA: {aluno.ra}</Text>
                        </View>
                    </View>
                ))
            )}

            <Pressable style={[globalStyles.button, { marginBottom: spacing.xl }]} onPress={handleSave}>
                <Text style={globalStyles.buttonText}>
                    {editing ? 'Atualizar' : 'Cadastrar'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    dateText: {
        marginLeft: spacing.sm,
        fontSize: fontSize.md,
        color: colors.text,
    },
    alunoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.sm,
        borderRadius: 8,
        marginBottom: spacing.xs,
    },
    alunoInfo: {
        marginLeft: spacing.sm,
        flex: 1,
    },
    alunoNome: {
        fontSize: fontSize.md,
        color: colors.text,
        fontWeight: '500',
    },
    alunoRa: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    emptyAlunos: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: spacing.md,
    },
});
