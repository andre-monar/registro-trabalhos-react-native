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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  celulaId: {
    width: '10%',
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
      justifyContent: 'flex-end',
      gap: 6,
  },
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
  textoBotaoEditar: {
      fontSize: 14,
  },
  textoBotaoDeletar: {
      fontSize: 14,
  },
});

export default styles;