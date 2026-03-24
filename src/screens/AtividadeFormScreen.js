import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { insertAtividade, updateAtividade } from '../database/AtividadeRepository';
import { getAlunosDoTrabalho } from '../database/TrabalhoRepository';
import globalStyles from '../styles/globalStyles';
import { colors, spacing } from '../styles/theme';

export default function AtividadeFormScreen({ navigation, route }) {
    const { trabalho, atividade: editing } = route.params;

    const [nome, setNome] = useState(editing?.nome || '');
    const [descricao, setDescricao] = useState(editing?.descricao || '');
    const [horasPrevistas, setHorasPrevistas] = useState(
        editing?.horas_previstas ? String(editing.horas_previstas) : ''
    );
    const [situacao, setSituacao] = useState(editing?.situacao || 'Pendente');
    const [idAluno, setIdAluno] = useState(editing?.idAluno || null);
    const [alunosTrabalho, setAlunosTrabalho] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({ title: editing ? 'Editar Atividade' : 'Nova Atividade' });
    }, [navigation, editing]);

    useEffect(() => {
        (async () => {
            const alunos = await getAlunosDoTrabalho(trabalho.id);
            setAlunosTrabalho(alunos);
        })();
    }, [trabalho.id]);

    const handleSave = async () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome da atividade é obrigatório.');
            return;
        }
        const horas = parseFloat(horasPrevistas) || 0;

        try {
            if (editing) {
                await updateAtividade(editing.id, idAluno, nome.trim(), descricao.trim(), horas, situacao);
            } else {
                await insertAtividade(trabalho.id, idAluno, nome.trim(), descricao.trim(), horas, situacao);
            }
            navigation.goBack();
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar a atividade.');
        }
    };

    return (
        <ScrollView style={globalStyles.screenContainer} keyboardShouldPersistTaps="handled">
            <Text style={globalStyles.inputLabel}>Nome *</Text>
            <TextInput
                style={globalStyles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Nome da atividade"
                placeholderTextColor="#94A3B8"
            />

            <Text style={globalStyles.inputLabel}>Descrição</Text>
            <TextInput
                style={[globalStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descrição da atividade"
                placeholderTextColor="#94A3B8"
                multiline
            />

            <Text style={globalStyles.inputLabel}>Horas Previstas</Text>
            <TextInput
                style={globalStyles.input}
                value={horasPrevistas}
                onChangeText={setHorasPrevistas}
                placeholder="Ex: 10"
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
                    <Picker.Item label="Concluída" value="Concluída" />
                    <Picker.Item label="Cancelada" value="Cancelada" />
                </Picker>
            </View>

            <Text style={globalStyles.inputLabel}>Aluno Responsável</Text>
            <View style={globalStyles.pickerContainer}>
                <Picker
                    selectedValue={idAluno}
                    onValueChange={(val) => setIdAluno(val)}
                    style={{ color: colors.text }}
                >
                    <Picker.Item label="Selecione um aluno..." value={null} />
                    {alunosTrabalho.map((a) => (
                        <Picker.Item key={a.id} label={`${a.nome} (${a.ra})`} value={a.id} />
                    ))}
                </Picker>
            </View>

            {alunosTrabalho.length === 0 && (
                <Text style={{ color: colors.warning, fontSize: 13, marginBottom: spacing.md, fontStyle: 'italic' }}>
                    Nenhum aluno vinculado a este trabalho. Edite o trabalho para adicionar alunos.
                </Text>
            )}

            <Pressable style={[globalStyles.button, { marginBottom: spacing.xl }]} onPress={handleSave}>
                <Text style={globalStyles.buttonText}>
                    {editing ? 'Atualizar' : 'Cadastrar'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}
