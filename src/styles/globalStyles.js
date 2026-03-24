import { StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from './theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    screenContainer: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
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
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm,
        padding: spacing.md,
        fontSize: fontSize.md,
        color: colors.text,
        marginBottom: spacing.md,
    },
    inputLabel: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius.sm,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: fontSize.md,
        fontWeight: '600',
    },
    buttonDanger: {
        backgroundColor: colors.danger,
    },
    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.text,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    pickerContainer: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm,
        marginBottom: spacing.md,
        overflow: 'hidden',
    },
});

export default styles;
