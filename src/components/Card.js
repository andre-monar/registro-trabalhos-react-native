import { Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../styles/theme';

export default function Card({ children, onPress, onLongPress, style }) {
    return (
        <Pressable
            style={({ pressed }) => [
                cardStyles.card,
                pressed && cardStyles.pressed,
                style,
            ]}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            {children}
        </Pressable>
    );
}

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
});
