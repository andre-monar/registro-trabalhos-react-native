import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView, Modal } from 'react-native';
import styles from '../styles';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import TrabalhoAlunoDAO from '../database/TrabalhoAlunoDAO';
import AtividadeDAO from '../database/AtividadeDAO';
import AtividadeAlunoDAO from '../database/AtividadeAlunoDAO';
import { VictoryPie, VictoryLegend } from 'victory-native';

export default function TrabalhoViewScreen({ navigation, route }) {
    const { trabalho } = route.params;

    const [alunos, setAlunos] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [alunosDaAtividade, setAlunosDaAtividade] = useState([]);
    const [nomeAtividadeModal, setNomeAtividadeModal] = useState('');

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [])
    );

    // listar alunos e atividades
    const carregarDados = async () => {
        const listaAlunos = await TrabalhoAlunoDAO.getByTrabalho(trabalho.id);
        setAlunos(listaAlunos);

        const listaAtividades = await AtividadeDAO.getByTrabalho(trabalho.id);
        setAtividades(listaAtividades);
    };

    // modal com alunos vinculados à atividade clicada
    const abrirModalAlunos = async (atividade) => {
        const lista = await AtividadeAlunoDAO.getByAtividade(atividade.id);
        setAlunosDaAtividade(lista);
        setNomeAtividadeModal(atividade.nome);
        setModalVisivel(true);
    };

    const deletarAtividade = async (id) => {
        try {
            await AtividadeDAO.delete(id);
            carregarDados();
        } catch (erro) {
            Alert.alert('Erro', erro.message, [{ text: 'OK' }]);
        }
    };

    // GRÁFICOS
    // Progresso: horas concluídas : pendentes 
    const totalPrevistas = atividades.reduce((acc, a) => acc + (a.horas_previstas || 0), 0);
    const totalConcluidas = atividades.reduce((acc, a) => acc + (a.horas_concluidas || 0), 0);
    const totalRestantes = totalPrevistas - totalConcluidas;

    const dadosProgresso = totalPrevistas > 0 ? [
        { x: 'Concluídas', y: totalConcluidas },
        { x: 'Restantes', y: totalRestantes },
    ] : [];
    // cores: verde = concluído, cinza = restante
    const coresProgresso = ['#34C759', '#e0e0e0'];

    // Horas previstas: proporção de horas por atividade
    const dadosHorasPrevistas = atividades
        .filter(a => a.horas_previstas > 0) // remover fatias com horas 0 pra não aparecer
        .map(a => ({
            x: a.nome,
            y: a.horas_previstas,
        }));

    // cores
    const cores = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FFCC00'];

    const renderAluno = ({ item }) => (
        <View style={styles.tbLinha}>
            <Text style={styles.celulaId}>{item.id}</Text>
            <Text style={styles.celulaNome}>{item.nome}</Text>
            <Text style={styles.celulaRa}>{item.ra}</Text>
        </View>
    );

    const renderAtividade = ({ item }) => (
        <View style={styles.tbLinhaAtividade}>
            <Text style={styles.celulaId}>{item.id}</Text>
            <Text style={styles.celulaAtividadeNome}>{item.nome}</Text>
            <Text style={styles.celulaAtividadeDesc}>{item.descricao}</Text>
            <Text style={styles.celulaAtividadeHoras}>{item.horas_previstas}h</Text>
            <Text style={styles.celulaAtividadeHoras}>{item.horas_concluidas}h</Text>
            <Text style={styles.celulaAtividadeSituacao}>{item.situacao}</Text>
            <View style={styles.celulaTrabalhoAcoes}>
                <TouchableOpacity
                    style={styles.botaoVisualizar}
                    onPress={() => abrirModalAlunos(item)}
                >
                    <Text style={styles.textoBotaoVisualizar}>👥</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => navigation.navigate('AtividadesAdd', { atividade: item })}
                >
                    <Text style={styles.textoBotaoEditar}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botaoDeletar}
                    onPress={() => Alert.alert(
                        'Confirmar',
                        `Deletar "${item.nome}"?`,
                        [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Deletar', style: 'destructive', onPress: () => deletarAtividade(item.id) }
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
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* cabeçalho do trabalho */}
                <View style={styles.viewHeader}>
                    <Text style={styles.viewTitulo}>{trabalho.nome}</Text>
                    <Text style={styles.viewSubtitulo}>{trabalho.situacao} • Entrega: {trabalho.data_entrega || 'N/A'}</Text>
                </View>

                {/* tabela de alunos */}
                <Text style={styles.viewSecaoTitulo}>Alunos</Text>
                <View style={styles.tbCabecalho}>
                    <Text style={styles.celulaId}>ID</Text>
                    <Text style={styles.celulaNome}>NOME</Text>
                    <Text style={styles.celulaRa}>RA</Text>
                </View>
                <FlatList
                    data={alunos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAluno}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <Text style={styles.listaVazia}>Nenhum aluno vinculado</Text>
                    }
                />

                {/* tabela de atividades */}
                <Text style={styles.viewSecaoTitulo}>Atividades</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                        <View style={styles.tbCabecalhoAtividade}>
                            <Text style={styles.celulaId}>ID</Text>
                            <Text style={styles.celulaAtividadeNome}>NOME</Text>
                            <Text style={styles.celulaAtividadeDesc}>DESCRIÇÃO</Text>
                            <Text style={styles.celulaAtividadeHoras}>H.PREV</Text>
                            <Text style={styles.celulaAtividadeHoras}>H.CONC</Text>
                            <Text style={styles.celulaAtividadeSituacao}>SITUAÇÃO</Text>
                            <Text style={styles.celulaTrabalhoAcoes}>AÇÕES</Text>
                        </View>
                        <FlatList
                            data={atividades}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderAtividade}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <Text style={styles.listaVazia}>Nenhuma atividade vinculada</Text>
                            }
                        />
                    </View>
                </ScrollView>

                {/* gráfico de progresso */}
                {dadosProgresso.length > 0 && (
                    <View style={styles.graficoContainer}>
                        <Text style={styles.viewSecaoTitulo}>Progresso Geral de Horas</Text>
                        <VictoryPie
                            data={dadosProgresso}
                            width={320}
                            height={280}
                            colorScale={coresProgresso}
                            innerRadius={50}
                            padAngle={2}
                            labels={({ datum }) => `${((datum.y / totalPrevistas) * 100).toFixed(1)}%`}
                            style={{
                                labels: { fontSize: 13, fill: '#333', fontWeight: 'bold' }
                            }}
                        />
                        <VictoryLegend
                            x={20}
                            width={320}
                            height={60}
                            colorScale={coresProgresso}
                            data={[
                                { name: `Concluídas (${totalConcluidas}h)` },
                                { name: `Restantes (${totalRestantes}h)` },
                            ]}
                            style={{
                                labels: { fontSize: 12, fill: '#333' }
                            }}
                        />
                    </View>
                )}
                {/* gráfico de horas previstas */}
                {dadosHorasPrevistas.length > 0 && (
                    <View style={styles.graficoContainer}>
                        <Text style={styles.viewSecaoTitulo}>Horas Previstas por Atividade</Text>
                        <VictoryPie
                            data={dadosHorasPrevistas}
                            width={320}
                            height={280}
                            colorScale={cores}
                            innerRadius={50}
                            padAngle={2}
                            labels={({ datum }) => `${datum.y}h`}
                            style={{
                                labels: { fontSize: 12, fill: '#333', fontWeight: 'bold' }
                            }}
                        />
                        <VictoryLegend
                            x={20}
                            width={320}
                            height={dadosHorasPrevistas.length * 28}
                            colorScale={cores}
                            data={dadosHorasPrevistas.map(d => ({ name: `${d.x} (${d.y}h)` }))}
                            style={{
                                labels: { fontSize: 12, fill: '#333' }
                            }}
                        />
                    </View>
                )}

            </ScrollView>

            {/* modal alunos da atividade */}
            <Modal visible={modalVisivel} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitulo}>Alunos — {nomeAtividadeModal}</Text>
                        <View style={styles.tbCabecalho}>
                            <Text style={styles.celulaId}>ID</Text>
                            <Text style={styles.celulaNome}>NOME</Text>
                            <Text style={styles.celulaRa}>RA</Text>
                        </View>
                        <FlatList
                            data={alunosDaAtividade}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderAluno}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <Text style={styles.listaVazia}>Nenhum aluno vinculado</Text>
                            }
                        />
                        <View style={{ marginTop: 12 }}>
                            <TouchableOpacity style={styles.botao} onPress={() => setModalVisivel(false)}>
                                <Text style={styles.textoBotao}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}