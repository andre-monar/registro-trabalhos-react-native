import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../styles/theme';

export default function EmptyState({ icon = 'file-tray-outline', message = 'Nenhum item encontrado' }) {
    return (
        <View style={emptyStyles.container}>
            <Ionicons name={icon} size={64} color={colors.border} />
            <Text style={emptyStyles.message}>{message}</Text>
        </View>
    );
}

const emptyStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl * 2,
    },
    message: {
        marginTop: spacing.md,
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
