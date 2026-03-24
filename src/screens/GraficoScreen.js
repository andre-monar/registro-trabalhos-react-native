import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { StackedBarChart } from 'react-native-chart-kit';
import { getTrabalhos } from '../database/TrabalhoRepository';
import { getAtividadesByTrabalho } from '../database/AtividadeRepository';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import globalStyles from '../styles/globalStyles';
import { colors, spacing, fontSize, radius } from '../styles/theme';

const screenWidth = Dimensions.get('window').width;

export default function GraficoScreen() {
    const [trabalhos, setTrabalhos] = useState([]);
    const [selectedTrabalho, setSelectedTrabalho] = useState(null);
    const [atividades, setAtividades] = useState([]);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const data = await getTrabalhos();
                setTrabalhos(data);
            })();
        }, [])
    );

    const handleSelect = async (id) => {
        setSelectedTrabalho(id);
        if (id) {
            const data = await getAtividadesByTrabalho(id);
            setAtividades(data);
        } else {
            setAtividades([]);
        }
    };

    const totais = atividades.reduce(
        (acc, a) => ({
            previstas: acc.previstas + (a.horas_previstas || 0),
            concluidas: acc.concluidas + (a.horas_concluidas || 0),
        }),
        { previstas: 0, concluidas: 0 }
    );
    const percentGeral = totais.previstas > 0
        ? Math.round((totais.concluidas / totais.previstas) * 100)
        : 0;

    const truncLabel = (str, max = 8) =>
        str.length > max ? str.substring(0, max) + '…' : str;

    const chartData = atividades.length > 0 ? {
        labels: atividades.map(a => truncLabel(a.nome)),
        legend: ['Concluídas', 'Restantes'],
        data: atividades.map(a => [
            a.horas_concluidas || 0,
            Math.max((a.horas_previstas || 0) - (a.horas_concluidas || 0), 0),
        ]),
        barColors: ['#4F46E5', '#E2E8F0'],
    } : null;

    const chartConfig = {
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        labelColor: () => colors.textSecondary,
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
        },
    };

    return (
        <ScrollView style={globalStyles.screenContainer}>
            <Text style={globalStyles.inputLabel}>Selecione o Trabalho</Text>
            <View style={globalStyles.pickerContainer}>
                <Picker
                    selectedValue={selectedTrabalho}
                    onValueChange={handleSelect}
                    style={{ color: colors.text }}
                >
                    <Picker.Item label="Selecione..." value={null} />
                    {trabalhos.map(t => (
                        <Picker.Item key={t.id} label={t.nome} value={t.id} />
                    ))}
                </Picker>
            </View>

            {selectedTrabalho && atividades.length === 0 && (
                <EmptyState icon="bar-chart-outline" message="Nenhuma atividade para exibir" />
            )}

            {selectedTrabalho && atividades.length > 0 && (
                <>
                    <View style={s.resumo}>
                        <Text style={s.resumoTitle}>Resumo Geral</Text>
                        <View style={s.resumoRow}>
                            <View style={s.resumoItem}>
                                <Text style={s.resumoValue}>{totais.concluidas}h</Text>
                                <Text style={s.resumoLabel}>Concluídas</Text>
                            </View>
                            <View style={s.resumoItem}>
                                <Text style={s.resumoValue}>{totais.previstas}h</Text>
                                <Text style={s.resumoLabel}>Previstas</Text>
                            </View>
                            <View style={s.resumoItem}>
                                <Text style={[s.resumoValue, { color: colors.primary }]}>{percentGeral}%</Text>
                                <Text style={s.resumoLabel}>Concluído</Text>
                            </View>
                        </View>
                        <View style={s.progressBarBg}>
                            <View style={[s.progressBarFill, { width: `${Math.min(percentGeral, 100)}%` }]} />
                        </View>
                    </View>

                    {chartData && (
                        <View style={s.chartWrap}>
                            <Text style={s.chartTitle}>Horas por Atividade</Text>
                            <StackedBarChart
                                data={chartData}
                                width={screenWidth - spacing.md * 2}
                                height={260}
                                chartConfig={chartConfig}
                                style={s.chart}
                                decimalPlaces={1}
                                hideLegend={false}
                            />
                        </View>
                    )}

                    <Text style={globalStyles.sectionTitle}>Detalhes por Atividade</Text>
                    {atividades.map(a => {
                        const pct = a.horas_previstas > 0
                            ? Math.round(((a.horas_concluidas || 0) / a.horas_previstas) * 100)
                            : 0;
                        return (
                            <View key={a.id} style={s.detailCard}>
                                <View style={globalStyles.spaceBetween}>
                                    <Text style={s.detailName}>{a.nome}</Text>
                                    <StatusBadge situacao={a.situacao || 'Pendente'} />
                                </View>
                                <Text style={s.detailAluno}>{a.nomeAluno || 'Sem aluno'}</Text>
                                <View style={s.progressBarBg}>
                                    <View style={[s.progressBarFill, { width: `${Math.min(pct, 100)}%` }]} />
                                </View>
                                <Text style={s.detailPct}>
                                    {pct}% — {a.horas_concluidas || 0}h / {a.horas_previstas || 0}h
                                </Text>
                            </View>
                        );
                    })}
                    <View style={{ height: spacing.xl }} />
                </>
            )}
        </ScrollView>
    );
}

const s = StyleSheet.create({
    resumo: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    resumoTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    resumoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.sm,
    },
    resumoItem: {
        alignItems: 'center',
    },
    resumoValue: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        color: colors.text,
    },
    resumoLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: spacing.xs,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    chartWrap: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    chartTitle: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    chart: {
        borderRadius: radius.md,
    },
    detailCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    detailName: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.text,
        flex: 1,
        marginRight: spacing.sm,
    },
    detailAluno: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
        marginBottom: spacing.xs,
    },
    detailPct: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
});
