import { StyleSheet, Platform } from 'react-native';

export const colors = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primaryLight: '#EEF2FF',
  background: '#F1F5F9',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerCentered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  screenPadding: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Home
  homeHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  homeSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  homeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  homeCardIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  homeCardContent: {
    flex: 1,
  },
  homeCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  homeCardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  homeCardArrow: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  creditosBotao: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  creditosBotaoTexto: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  // Buttons
  botao: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },

  // Inputs
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 14,
  },
  inputRow: {
    width: '100%',
  },

  // Picker
  picker: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
  },

  // Cards (list items)
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },
  cardDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: colors.primaryLight,
  },
  deleteBtn: {
    backgroundColor: colors.dangerLight,
  },
  actionBtnText: {
    fontSize: 16,
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgePendente: {
    backgroundColor: colors.warningLight,
  },
  badgeConcluido: {
    backgroundColor: colors.successLight,
  },
  badgeCancelado: {
    backgroundColor: colors.dangerLight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextPendente: {
    color: colors.warning,
  },
  badgeTextConcluido: {
    color: colors.success,
  },
  badgeTextCancelado: {
    color: colors.danger,
  },

  // Empty state
  listaVazia: {
    textAlign: 'center',
    color: colors.textSecondary,
    padding: 32,
    fontSize: 14,
  },

  // Section (alunos inside trabalho/atividade forms)
  secaoAlunos: {
    width: '100%',
    marginBottom: 14,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  alunoChip: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  alunoChipInfo: {
    flex: 1,
  },
  alunoChipNome: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  alunoChipRa: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  alunoChipDelete: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // Table (kept for backward compat in vinculados sub-lists)
  tbCabecalho: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  tbLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  celulaId: {
    width: '10%',
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  celulaNome: {
    width: '40%',
    fontSize: 14,
    color: colors.text,
  },
  celulaRa: {
    width: '25%',
    fontSize: 13,
    color: colors.textSecondary,
  },
  celulaAcoes: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: colors.text,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoSecundario: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },

  // Legacy table styles (trabalhos/atividades horizontal scroll)
  tbCabecalhoTrabalho: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    minWidth: 720,
  },
  tbLinhaTrabalho: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minWidth: 720,
  },
  celulaTrabalhoNome: {
    width: 140,
    fontSize: 13,
    color: colors.text,
  },
  celulaTrabalhoDesc: {
    width: 160,
    fontSize: 13,
    color: colors.textSecondary,
  },
  celulaTrabalhoData: {
    width: 100,
    fontSize: 12,
    color: colors.text,
  },
  celulaTrabalhoSituacao: {
    width: 110,
    fontSize: 12,
  },
  celulaTrabalhoAcoes: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  // Atividade table
  tbCabecalhoAtividade: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    minWidth: 780,
  },
  tbLinhaAtividade: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minWidth: 780,
    alignItems: 'center',
  },
  celulaAtividadeTrabalho: {
    width: 55,
    fontSize: 13,
    color: colors.text,
  },
  celulaAtividadeNome: {
    width: 130,
    fontSize: 13,
    color: colors.text,
  },
  celulaAtividadeDesc: {
    width: 140,
    fontSize: 13,
    color: colors.textSecondary,
  },
  celulaAtividadeHoras: {
    width: 65,
    fontSize: 12,
    color: colors.text,
  },
  celulaAtividadeSituacao: {
    width: 90,
    fontSize: 12,
  },

  // Action buttons (edit/delete)
  botaoEditar: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 6,
  },
  botaoDeletar: {
    backgroundColor: colors.dangerLight,
    borderRadius: 8,
    padding: 6,
  },
  textoBotaoEditar: {
    fontSize: 14,
  },
  textoBotaoDeletar: {
    fontSize: 14,
  },

  // Credits screen
  creditosContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditosCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  creditosTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  creditosPessoa: {
    width: '100%',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  creditosPessoaLast: {
    borderBottomWidth: 0,
  },
  creditosNome: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  creditosRa: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default styles;
