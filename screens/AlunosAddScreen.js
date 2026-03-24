import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles';
import { useState } from 'react';
import AlunoDAO from '../database/AlunoDAO';

export default function AlunosAddScreen({ navigation, route }) {
    const alunoEditar = route.params?.aluno;
    const editando = !!alunoEditar;

    const [nome, setNome] = useState(editando ? alunoEditar.nome : '');
    const [ra, setRa] = useState(editando ? alunoEditar.ra : '');

    const salvarAluno = async () => {
        if (!nome || !ra) {
            Alert.alert('Atenção', 'Preencha todos os campos!', [{ text: 'OK' }]);
            return;
        }

        if (ra.length !== 9) {
            Alert.alert('Atenção', 'O RA deve conter exatamente 9 dígitos.', [{ text: 'OK' }]);
            return;
        }

        try {
            if (editando) {
                await AlunoDAO.update(alunoEditar.id, { nome, ra });
                Alert.alert('Sucesso', 'Aluno atualizado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            } else {
                await AlunoDAO.insert({ nome, ra });
                Alert.alert('Sucesso', 'Aluno cadastrado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            }
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    return (
        <ScrollView style={styles.screenPadding} keyboardShouldPersistTaps="handled">
            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do aluno"
                placeholderTextColor="#94A3B8"
                value={nome}
                onChangeText={setNome}
            />

            <Text style={styles.inputLabel}>RA *</Text>
            <TextInput
                style={styles.input}
                placeholder="9 dígitos (ex: 081220040)"
                placeholderTextColor="#94A3B8"
                value={ra}
                onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setRa(numericText);
                }}
                keyboardType="numeric"
                maxLength={9}
            />

            <TouchableOpacity style={styles.botao} onPress={salvarAluno}>
                <Text style={styles.textoBotao}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
