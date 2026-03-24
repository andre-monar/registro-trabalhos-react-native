import { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { insertAluno, updateAluno } from '../database/AlunoRepository';
import globalStyles from '../styles/globalStyles';

export default function AlunoFormScreen({ navigation, route }) {
    const editing = route.params?.aluno;
    const [ra, setRa] = useState(editing?.ra || '');
    const [nome, setNome] = useState(editing?.nome || '');

    useLayoutEffect(() => {
        navigation.setOptions({ title: editing ? 'Editar Aluno' : 'Novo Aluno' });
    }, [navigation, editing]);

    const handleSave = async () => {
        const trimRa = ra.trim();
        const trimNome = nome.trim();
        if (!trimRa || !trimNome) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }
        try {
            if (editing) {
                await updateAluno(editing.id, trimRa, trimNome);
            } else {
                await insertAluno(trimRa, trimNome);
            }
            navigation.goBack();
        } catch (e) {
            if (String(e).includes('UNIQUE')) {
                Alert.alert('Erro', 'Já existe um aluno com este RA.');
            } else {
                Alert.alert('Erro', 'Não foi possível salvar o aluno.');
            }
        }
    };

    return (
        <ScrollView style={globalStyles.screenContainer} keyboardShouldPersistTaps="handled">
            <Text style={globalStyles.inputLabel}>RA *</Text>
            <TextInput
                style={globalStyles.input}
                value={ra}
                onChangeText={setRa}
                placeholder="Ex: 123456"
                placeholderTextColor="#94A3B8"
            />

            <Text style={globalStyles.inputLabel}>Nome *</Text>
            <TextInput
                style={globalStyles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Nome do aluno"
                placeholderTextColor="#94A3B8"
            />

            <Pressable style={globalStyles.button} onPress={handleSave}>
                <Text style={globalStyles.buttonText}>
                    {editing ? 'Atualizar' : 'Cadastrar'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}
