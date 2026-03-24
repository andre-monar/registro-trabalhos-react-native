import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles';
import { useState } from 'react';
import AtividadeDAO from '../database/AtividadeDAO';
import TrabalhoDAO from '../database/TrabalhoDAO';
import TrabalhoAlunoDAO from '../database/TrabalhoAlunoDAO';
import AtividadeAlunoDAO from '../database/AtividadeAlunoDAO';

export default function AtividadesAddScreen({ navigation, route }) {
    const atividadeEditar = route.params?.atividade;
    const editando = !!atividadeEditar;

    const [nome, setNome] = useState(editando ? atividadeEditar.nome : '');
    const [descricao, setDescricao] = useState(editando ? atividadeEditar.descricao : '');
    const [horasPrevistas, setHorasPrevistas] = useState(editando ? String(atividadeEditar.horas_previstas) : '');
    const [horasConcluidas, setHorasConcluidas] = useState(editando ? String(atividadeEditar.horas_concluidas) : '');
    const [situacao, setSituacao] = useState(editando ? atividadeEditar.situacao : 'Pendente');
    const [trabalhos, setTrabalhos] = useState([]);
    const [idTrabalho, setIdTrabalho] = useState(editando ? atividadeEditar.idTrabalho : null);

    // estados da seção de alunos
    const [alunosVinculados, setAlunosVinculados] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);

    // carrega trabalhos pro picker e alunos vinculados se editando
    useState(() => {
        const carregar = async () => {
            const lista = await TrabalhoDAO.getAll();
            setTrabalhos(lista);
            if (!editando && lista.length > 0) setIdTrabalho(lista[0].id);
            if (editando) carregarAlunosVinculados(atividadeEditar.id);
        };
        carregar();
    }, []);

    const carregarAlunosVinculados = async (idAtividade) => {
        const lista = await AtividadeAlunoDAO.getByAtividade(idAtividade);
        setAlunosVinculados(lista);
    };

    // Atuação inteligente entre horas concluídas:pendentes
    const handleHorasConcluidas = (text) => {
        const valor = text.replace(/[^0-9.]/g, '');
        const previstas = parseFloat(horasPrevistas) || 0;
        const concluidas = parseFloat(valor) || 0;

        if (previstas > 0 && concluidas > previstas) {
            Alert.alert('Atenção', `Horas concluídas não podem ser maiores que as previstas (${previstas}h).`, [{ text: 'OK' }]);
            return;
        }

        setHorasConcluidas(valor);

        // muda situação automaticamente se igual
        if (previstas > 0 && concluidas === previstas) {
            setSituacao('Concluído');
        }
    };

    const abrirModal = async () => {
        // busca alunos do trabalho relacionado
        const alunosDoTrabalho = await TrabalhoAlunoDAO.getByTrabalho(idTrabalho);
        // filtra os que já estão vinculados à atividade
        const vinculadosIds = alunosVinculados.map(a => a.id);
        const disponiveis = alunosDoTrabalho.filter(a => !vinculadosIds.includes(a.id));

        if (disponiveis.length === 0) {
            Alert.alert('Atenção', 'Todos os alunos do trabalho já estão vinculados a esta atividade.', [{ text: 'OK' }]);
            return;
        }

        setAlunosDisponiveis(disponiveis);
        setAlunoSelecionado(disponiveis[0]);
        setModalVisivel(true);
    };

    const adicionarAluno = async () => {
        if (!alunoSelecionado) return;
        try {
            await AtividadeAlunoDAO.insert(atividadeEditar.id, alunoSelecionado.id);
            setModalVisivel(false);
            carregarAlunosVinculados(atividadeEditar.id);
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const removerAluno = async (idAluno) => {
        try {
            await AtividadeAlunoDAO.delete(atividadeEditar.id, idAluno);
            carregarAlunosVinculados(atividadeEditar.id);
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const salvarAtividade = async () => {
        if (!nome) {
            Alert.alert('Atenção', 'Preencha pelo menos o nome!', [{ text: 'OK' }]);
            return;
        }
        if (!idTrabalho) {
            Alert.alert('Atenção', 'Selecione um trabalho!', [{ text: 'OK' }]);
            return;
        }

        try {
            const dados = {
                idTrabalho,
                nome,
                descricao,
                horas_previstas: parseFloat(horasPrevistas) || 0,
                horas_concluidas: parseFloat(horasConcluidas) || 0,
                situacao
            };

            if (editando) {
                await AtividadeDAO.update(atividadeEditar.id, dados);
                Alert.alert('Sucesso', 'Atividade atualizada!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            } else {
                await AtividadeDAO.insert(dados);
                Alert.alert('Sucesso', 'Atividade cadastrada!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            }
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    const renderAluno = ({ item }) => (
        <View style={[styles.tbLinha, { alignItems: 'center' }]}>
            <Text style={styles.celulaId}>{item.id}</Text>
            <Text style={styles.celulaNome}>{item.nome}</Text>
            <Text style={styles.celulaRa}>{item.ra}</Text>
            <View style={styles.celulaAcoes}>
                <TouchableOpacity
                    style={styles.botaoDeletar}
                    onPress={() => Alert.alert(
                        'Confirmar',
                        `Remover "${item.nome}" desta atividade?`,
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
        <ScrollView contentContainerStyle={styles.containerScroll}>
            {/* picker de trabalho */}
            <Text style={styles.texto}>Trabalho:</Text>
            <View style={styles.picker}>
                <Picker
                    selectedValue={idTrabalho}
                    onValueChange={(value) => setIdTrabalho(value)}
                >
                    {trabalhos.map(t => (
                        <Picker.Item key={t.id} label={`${t.id} - ${t.nome}`} value={t.id} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.texto}>Nome:</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome da atividade"
                value={nome}
                onChangeText={setNome}
            />

            <Text style={styles.texto}>Descrição:</Text>
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
            />

            <Text style={styles.texto}>Horas previstas:</Text>
            <TextInput
                style={styles.input}
                placeholder="Horas previstas"
                value={horasPrevistas}
                onChangeText={(text) => {
                    const valor = text.replace(/[^0-9.]/g, '');
                    setHorasPrevistas(valor);
                    // revalida horas concluidas se já preenchido
                    const previstas = parseFloat(valor) || 0;
                    const concluidas = parseFloat(horasConcluidas) || 0;
                    if (previstas > 0 && concluidas > previstas) {
                        setHorasConcluidas(String(previstas));
                    }
                }}
                keyboardType='numeric'
            />

            <Text style={styles.texto}>Horas concluídas:</Text>
            <TextInput
                style={styles.input}
                placeholder="Horas concluídas"
                value={horasConcluidas}
                onChangeText={handleHorasConcluidas}
                keyboardType='numeric'
            />

            <Text style={styles.texto}>Situação:</Text>
            {/* picker de situação */}
            <View style={styles.picker}>
                <Picker selectedValue={situacao} onValueChange={(value) => setSituacao(value)}>
                    <Picker.Item label="Pendente" value="Pendente" />
                    <Picker.Item label="Concluído" value="Concluído" />
                    <Picker.Item label="Cancelado" value="Cancelado" />
                </Picker>
            </View>


            {/* seção de alunos — só no modo edição */}
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

            <TouchableOpacity style={styles.botao} onPress={salvarAtividade}>
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
                                    const aluno = alunosDisponiveis.find(a => a.id === id);
                                    setAlunoSelecionado(aluno);
                                }}
                            >
                                {alunosDisponiveis.map(a => (
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