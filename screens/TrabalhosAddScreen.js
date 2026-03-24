import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
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

    const [alunosVinculados, setAlunosVinculados] = useState([]);
    const [todosAlunos, setTodosAlunos] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [idTrabalhoAtual, setIdTrabalhoAtual] = useState(trabalhoEditar?.id || null);

    // listar alunos vinculados ao trabalho
    const carregarAlunosVinculados = async (idTrabalho) => {
        const lista = await TrabalhoAlunoDAO.getByTrabalho(idTrabalho);
        setAlunosVinculados(lista);
    };

    useState(() => {
        if (editando) carregarAlunosVinculados(trabalhoEditar.id);
    }, []);

    // MODAL -> telinha pra vincular aluno ao trabalho
    const abrirModal = async () => {
        const lista = await AlunoDAO.getAll();
        // filtra alunos que já estão vinculados
        const vinculadosIds = alunosVinculados.map(a => a.id);
        const disponiveis = lista.filter(a => !vinculadosIds.includes(a.id));
        setTodosAlunos(disponiveis);
        setAlunoSelecionado(disponiveis[0] ?? null);
        setModalVisivel(true);
    };

    // operações de vinculação mexem na tabela trabalhoalunodao
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

    // operações do trabalho
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

    const renderAluno = ({ item }) => (
        <View style={styles.tbLinha}>
            <Text style={styles.celulaId}>{item.id}</Text>
            <Text style={styles.celulaNome}>{item.nome}</Text>
            <Text style={styles.celulaRa}>{item.ra}</Text>
            <View style={styles.celulaAcoes}>
                <TouchableOpacity
                    style={styles.botaoDeletar}
                    onPress={() => Alert.alert(
                        'Confirmar',
                        `Remover "${item.nome}" deste trabalho?`,
                        [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Remover', style: 'destructive', onPress: () => removerAluno(item.id) }
                        ]
                    )}
                >
                    <Text style={styles.textoBotaoDeletar}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome do trabalho"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
            />

            <TextInput
                style={styles.input}
                placeholder="Data de entrega (AAAA-MM-DD)"
                value={dataEntrega}
                onChangeText={setDataEntrega}
            />

            <View style={styles.picker}>
                <Picker selectedValue={situacao} onValueChange={(value) => setSituacao(value)}>
                    <Picker.Item label="Pendente" value="Pendente" />
                    <Picker.Item label="Concluído" value="Concluído" />
                    <Picker.Item label="Cancelado" value="Cancelado" />
                </Picker>
            </View>

            {/* seção de alunos — só aparece no modo edição porque precisa criar o trabalho antes pra existir no SQL */}
            {editando && (
                <View style={styles.secaoAlunos}>
                    <View style={styles.tbCabecalho}>
                        <Text style={styles.celulaId}>ID</Text>
                        <Text style={styles.celulaNome}>NOME</Text>
                        <Text style={styles.celulaRa}>RA</Text>
                        <Text style={styles.celulaAcoes}>AÇÕES</Text>
                    </View>

                    <FlatList
                        data={alunosVinculados}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderAluno}
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

            <TouchableOpacity style={styles.botao} onPress={salvarTrabalho}>
                <Text style={styles.textoBotao}>{editando ? 'Atualizar' : 'Salvar'}</Text>
            </TouchableOpacity>

            {/* modal picker de alunos */}
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
        </View>
    );
}