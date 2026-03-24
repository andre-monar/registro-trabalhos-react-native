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

    const [alunosVinculados, setAlunosVinculados] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);

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

    const abrirModal = async () => {
        const alunosDoTrabalho = await TrabalhoAlunoDAO.getByTrabalho(idTrabalho);
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
                    `Remover "${item.nome}" desta atividade?`,
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
            <Text style={styles.inputLabel}>Trabalho *</Text>
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

            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome da atividade"
                placeholderTextColor="#94A3B8"
                value={nome}
                onChangeText={setNome}
            />

            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                placeholder="Descrição da atividade"
                placeholderTextColor="#94A3B8"
                value={descricao}
                onChangeText={setDescricao}
                multiline
            />

            <Text style={styles.inputLabel}>Horas Previstas</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 10"
                placeholderTextColor="#94A3B8"
                value={horasPrevistas}
                onChangeText={setHorasPrevistas}
                keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Horas Concluídas</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 5"
                placeholderTextColor="#94A3B8"
                value={horasConcluidas}
                onChangeText={setHorasConcluidas}
                keyboardType="numeric"
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

            <TouchableOpacity style={[styles.botao, { marginBottom: 40 }]} onPress={salvarAtividade}>
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
