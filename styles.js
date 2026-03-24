import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botao: {
    width: 250,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  textoBotao: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoBotaoAdd: {
    color: '#007AFF',
    fontSize: 16,
    height: 25,
    fontWeight: 'bold',
    minWidth: 120,
  },
  input: {
    width: 250,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  // tabela alunos
  tbCabecalho: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    width: '100%',
  },
  tbLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  celulaId: {
    width: '7%',
    fontSize: 14,
    fontWeight: 'bold',
  },
  celulaNome: {
    width: '40%',
    fontSize: 14,
  },
  celulaRa: {
    width: '25%',
    fontSize: 14,
  },
  celulaAcoes: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  // tabela trabalhos (scroll horizontal)
  tbCabecalhoTrabalho: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    minWidth: 850,
  },
  tbLinhaTrabalho: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minWidth: 720,
  },
  celulaTrabalhoNome: {
    width: 140,
    fontSize: 13,
  },
  celulaTrabalhoDesc: {
    width: 160,
    fontSize: 13,
    color: '#555',
  },
  celulaTrabalhoData: {
    width: 100,
    fontSize: 12,
  },
  celulaTrabalhoSituacao: {
    width: 110,
    fontSize: 12,
  },
  celulaTrabalhoAcoes: {
    width: 110,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  // seleção estado
  picker: {
    width: 250,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
  },

  // lista alunos dentro do trabalhoadd
  secaoAlunos: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  listaVazia: {
      textAlign: 'center',
      color: '#aaa',
      padding: 12,
      fontSize: 13,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalBox: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      width: '85%',
  },
  modalTitulo: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
  },
  modalBotoes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 10,
  },
  botaoPrincipal: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSecundario: {
      flex: 1,
      borderWidth: 2,
      borderColor: '#aaa',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
  },
  textoBotaoSecundario: {
      color: '#aaa',
      fontSize: 16,
      fontWeight: 'bold',
  },
  celulaTrabalhoHoras: {
    width: 65,
    fontSize: 12,
  },

  // atividade
  tbCabecalhoAtividade: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    minWidth: 780,
  },
  tbLinhaAtividade: {
      flexDirection: 'row',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      minWidth: 780,
      alignItems: 'center',
  },
  celulaAtividadeIdTrabalho: {
      width: 30,
      fontSize: 13,
  },
  celulaAtividadeNomeTrabalho: {
      width: 70,
      fontSize: 13,
  },
  celulaAtividadeTrabalho: {
      width: 100,
      fontSize: 13,
  },
  celulaAtividadeNome: {
      width: 130,
      fontSize: 13,
  },
  celulaAtividadeDesc: {
      width: 140,
      fontSize: 13,
      color: '#555',
  },
  celulaAtividadeHoras: {
      width: 65,
      fontSize: 12,
  },
  celulaAtividadeSituacao: {
      width: 90,
      fontSize: 12,
  },

  containerScroll: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  // view trabalho
  viewHeader: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    marginBottom: 8,
  },
  viewTitulo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007AFF',
  },
  viewSubtitulo: {
      fontSize: 13,
      color: '#555',
      marginTop: 4,
  },
  viewSecaoTitulo: {
      fontSize: 15,
      fontWeight: 'bold',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#fafafa',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
  },

  // botões
  botaoEditar: {
    backgroundColor: '#e8f0fe',
    borderRadius: 6,
    padding: 4,
  },
  botaoDeletar: {
    backgroundColor: '#fde8e8',
    borderRadius: 6,
    padding: 4,
  },
  botaoVisualizar: {
    backgroundColor: '#e8feea',
    borderRadius: 6,
    padding: 4,
  },
  textoBotaoVisualizar: {
      fontSize: 14,
  },
  textoBotaoEditar: {
    fontSize: 14,
  },
  textoBotaoDeletar: {
    fontSize: 14,
  },
});

export default styles;