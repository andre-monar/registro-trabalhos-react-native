import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles';
import { useState } from 'react';
import AlunoDAO from '../database/AlunoDAO';

export default function AlunosAddScreen( { navigation, route } ) {
    const alunoEditar = route.params?.aluno;
    const editando = !!alunoEditar;

    const [nome, setNome] = useState(editando ? alunoEditar.nome : '');
    const [ra, setRa] = useState(editando ? alunoEditar.ra : '');

    const salvarAluno = async () => {
        if(!nome || !ra) {
            Alert.alert('Atenção', 'Preencha todos os campos!', [{ text: 'OK' }]);
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
    }
    return (
        <View style = {styles.container}>
            <Text style={styles.texto}>Nome:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o nome"
                value={nome}
                onChangeText={setNome}
                textAlign="center"
                onFocus={() => setNome('')}
            />

            <Text style={styles.texto}>RA:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o RA"
                value={ra}
                onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setRa(numericText);
                }}
                keyboardType='numeric'
                maxLength={9}
                textAlign="center"
                onFocus={() => setRa('')}
            />
            
            <TouchableOpacity 
                style={styles.botao} 
                onPress={salvarAluno}
            >
                <Text style={styles.textoBotao}>{editando ? 'Atualizar' : 'Salvar'}</Text>
            </TouchableOpacity>
        </View>
    );
}