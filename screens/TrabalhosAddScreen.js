import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles';
import { useState } from 'react';
import TrabalhoDAO from '../database/TrabalhoDAO';
import TrabalhoAlunoDAO from '../database/TrabalhoAlunoDAO';
import AlunoDAO from '../database/AlunoDAO';

export default function TrabalhosAddScreen({ navigation, route }) {
    const trabalhoEditar = route.params?.trabalho;
    const editando = !!trabalhoEditar;

    const [nome, setNome] = useState(editando ? trabalhoEditar.nome : '');
    const [descricao, setDescricao] = useState(editando ? trabalhoEditar.descricao : '');
    const [dataEntrega, setDataEntrega] = useState(editando ? trabalhoEditar.data_entrega : '');
    const [situacao, setSituacao] = useState(editando ? trabalhoEditar.situacao : 'Pendente');

    const formatarData = (text) => {
        const nums = text.replace(/[^0-9]/g, '').slice(0, 8);
        if (nums.length <= 4) return nums;
        if (nums.length <= 6) return nums.slice(0, 4) + '-' + nums.slice(4);
        return nums.slice(0, 4) + '-' + nums.slice(4, 6) + '-' + nums.slice(6);
    };

    const [alunosVinculados, setAlunosVinculados] = useState([]);
    const [todosAlunos, setTodosAlunos] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [idTrabalhoAtual, setIdTrabalhoAtual] = useState(trabalhoEditar?.id || null);

    const carregarAlunosVinculados = async (idTrabalho) => {
        const lista = await TrabalhoAlunoDAO.getByTrabalho(idTrabalho);
        setAlunosVinculados(lista);
    };

    useState(() => {
        if (editando) carregarAlunosVinculados(trabalhoEditar.id);
    }, []);

    const abrirModal = async () => {
        const lista = await AlunoDAO.getAll();
        const vinculadosIds = alunosVinculados.map(a => a.id);
        const disponiveis = lista.filter(a => !vinculadosIds.includes(a.id));
        setTodosAlunos(disponiveis);
        setAlunoSelecionado(disponiveis[0] ?? null);
        setModalVisivel(true);
    };

    const adicionarAluno = async () => {
        if (!alunoSelecionado) {
            Alert.alert('Atenção', 'Nenhum aluno disponível para adicionar.', [{ text: 'OK' }]);
            return;
        }
        try {
            await TrabalhoAlunoDAO.insert(idTrabalhoAtual, alunoSelecionado.id);
            setModalVisivel(false);
            carregarAlunosVinculados(idTrabalhoAtual);
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const removerAluno = async (idAluno) => {
        try {
            await TrabalhoAlunoDAO.delete(idTrabalhoAtual, idAluno);
            carregarAlunosVinculados(idTrabalhoAtual);
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const salvarTrabalho = async () => {
        if (!nome) {
            Alert.alert('Atenção', 'Preencha pelo menos o nome!', [{ text: 'OK' }]);
            return;
        }
        try {
            if (editando) {
                await TrabalhoDAO.update(trabalhoEditar.id, { nome, descricao, data_entrega: dataEntrega, situacao });
                Alert.alert('Sucesso', 'Trabalho atualizado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            } else {
                const result = await TrabalhoDAO.insert({ nome, descricao, data_entrega: dataEntrega, situacao });
                setIdTrabalhoAtual(result.lastInsertRowId);
                Alert.alert('Sucesso', 'Trabalho cadastrado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            }
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const renderAlunoVinculado = ({ item }) => (
        <View style={styles.alunoChip}>
            <View style={styles.alunoChipInfo}>
                <Text style={styles.alunoChipNome}>{item.nome}</Text>
                <Text style={styles.alunoChipRa}>RA: {item.ra}</Text>
            </View>
            <TouchableOpacity
                style={styles.alunoChipDelete}
                onPress={() => Alert.alert(
                    'Confirmar',
                    `Remover "${item.nome}" deste trabalho?`,
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Remover', style: 'destructive', onPress: () => removerAluno(item.id) }
                    ]
                )}
            >
                <Text style={{ fontSize: 14 }}>{'\uD83D\uDDD1\uFE0F'}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.screenPadding} keyboardShouldPersistTaps="handled">
            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do trabalho"
                placeholderTextColor="#94A3B8"
                value={nome}
                onChangeText={setNome}
            />

            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                placeholder="Descrição do trabalho"
                placeholderTextColor="#94A3B8"
                value={descricao}
                onChangeText={setDescricao}
                multiline
            />

            <Text style={styles.inputLabel}>Data de Entrega</Text>
            <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#94A3B8"
                value={dataEntrega}
                onChangeText={(t) => setDataEntrega(formatarData(t))}
                keyboardType="numeric"
                maxLength={10}
            />

            <Text style={styles.inputLabel}>Situação</Text>
            <View style={styles.picker}>
                <Picker selectedValue={situacao} onValueChange={(value) => setSituacao(value)}>
                    <Picker.Item label="Pendente" value="Pendente" />
                    <Picker.Item label="Concluído" value="Concluído" />
                    <Picker.Item label="Cancelado" value="Cancelado" />
                </Picker>
            </View>

            {editando && (
                <View style={styles.secaoAlunos}>
                    <Text style={styles.secaoTitulo}>Alunos Vinculados</Text>
                    <FlatList
                        data={alunosVinculados}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderAlunoVinculado}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <Text style={styles.listaVazia}>Nenhum aluno vinculado</Text>
                        }
                    />
                    <TouchableOpacity style={styles.botao} onPress={abrirModal}>
                        <Text style={styles.textoBotao}>Adicionar Aluno</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={[styles.botao, { marginBottom: 40 }]} onPress={salvarTrabalho}>
                <Text style={styles.textoBotao}>{editando ? 'Atualizar' : 'Cadastrar'}</Text>
            </TouchableOpacity>

            <Modal visible={modalVisivel} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitulo}>Selecionar Aluno</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={alunoSelecionado?.id}
                                onValueChange={(id) => {
                                    const aluno = todosAlunos.find(a => a.id === id);
                                    setAlunoSelecionado(aluno);
                                }}
                            >
                                {todosAlunos.map(a => (
                                    <Picker.Item key={a.id} label={`${a.nome} (${a.ra})`} value={a.id} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={styles.botaoSecundario} onPress={() => setModalVisivel(false)}>
                                <Text style={styles.textoBotaoSecundario}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoPrincipal} onPress={adicionarAluno}>
                                <Text style={styles.textoBotao}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
