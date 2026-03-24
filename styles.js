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
  }

});

export default styles;