import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from '../styles/theme';

export default function ConfirmModal({ visible, message, onConfirm, onCancel }) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={modalStyles.overlay}>
                <View style={modalStyles.card}>
                    <Text style={modalStyles.message}>{message}</Text>
                    <View style={modalStyles.buttons}>
                        <Pressable
                            style={[modalStyles.btn, modalStyles.btnCancel]}
                            onPress={onCancel}
                        >
                            <Text style={modalStyles.btnCancelText}>Cancelar</Text>
                        </Pressable>
                        <Pressable
                            style={[modalStyles.btn, modalStyles.btnConfirm]}
                            onPress={onConfirm}
                        >
                            <Text style={modalStyles.btnConfirmText}>Confirmar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        width: '100%',
        maxWidth: 340,
    },
    message: {
        fontSize: fontSize.md,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 22,
    },
    buttons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    btn: {
        flex: 1,
        padding: spacing.md,
        borderRadius: radius.sm,
        alignItems: 'center',
    },
    btnCancel: {
        backgroundColor: colors.background,
    },
    btnCancelText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: fontSize.md,
    },
    btnConfirm: {
        backgroundColor: colors.danger,
    },
    btnConfirmText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: fontSize.md,
    },
});
