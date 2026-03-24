import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from '../styles/theme';

const statusMap = {
    'Pendente': { bg: colors.warningLight, text: colors.warning },
    'Concluído': { bg: colors.successLight, text: colors.success },
    'Concluída': { bg: colors.successLight, text: colors.success },
    'Cancelado': { bg: colors.dangerLight, text: colors.danger },
    'Cancelada': { bg: colors.dangerLight, text: colors.danger },
};

export default function StatusBadge({ situacao }) {
    const config = statusMap[situacao] || statusMap['Pendente'];

    return (
        <View style={[badgeStyles.badge, { backgroundColor: config.bg }]}>
            <Text style={[badgeStyles.text, { color: config.text }]}>
                {situacao}
            </Text>
        </View>
    );
}

const badgeStyles = StyleSheet.create({
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: fontSize.sm,
        fontWeight: '600',
    },
});
