import { View, Text } from 'react-native';
import styles from '../styles';

const membros = [
    { nome: 'André Mendes Garcia', ra: '081230012' },
    { nome: 'Samar Victor Vieira Souza', ra: '081230035' },
    { nome: 'Vinicius Yamaguti Augusto', ra: '081220040' },
];

export default function CreditosScreen() {
    return (
        <View style={styles.creditosContainer}>
            <View style={styles.creditosCard}>
                <Text style={styles.creditosTitle}>Este trabalho foi desenvolvido por:</Text>
                {membros.map((m, i) => (
                    <View
                        key={m.ra}
                        style={[
                            styles.creditosPessoa,
                            i === membros.length - 1 && styles.creditosPessoaLast,
                        ]}
                    >
                        <Text style={styles.creditosNome}>{m.nome}</Text>
                        <Text style={styles.creditosRa}>RA: {m.ra}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
