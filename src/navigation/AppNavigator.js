import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

import AlunosScreen from '../screens/AlunosScreen';
import AlunoFormScreen from '../screens/AlunoFormScreen';
import TrabalhosScreen from '../screens/TrabalhosScreen';
import TrabalhoFormScreen from '../screens/TrabalhoFormScreen';
import AtividadesScreen from '../screens/AtividadesScreen';
import AtividadeFormScreen from '../screens/AtividadeFormScreen';
import AndamentoScreen from '../screens/AndamentoScreen';
import GraficoScreen from '../screens/GraficoScreen';

const Tab = createBottomTabNavigator();
const AlunoStack = createNativeStackNavigator();
const TrabalhoStack = createNativeStackNavigator();
const AndamentoStack = createNativeStackNavigator();
const GraficoStack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: { fontWeight: '600' },
};

function AlunosStackScreen() {
    return (
        <AlunoStack.Navigator screenOptions={screenOptions}>
            <AlunoStack.Screen name="AlunosList" component={AlunosScreen} options={{ title: 'Alunos' }} />
            <AlunoStack.Screen name="AlunoForm" component={AlunoFormScreen} options={{ title: 'Aluno' }} />
        </AlunoStack.Navigator>
    );
}

function TrabalhosStackScreen() {
    return (
        <TrabalhoStack.Navigator screenOptions={screenOptions}>
            <TrabalhoStack.Screen name="TrabalhosList" component={TrabalhosScreen} options={{ title: 'Trabalhos' }} />
            <TrabalhoStack.Screen name="TrabalhoForm" component={TrabalhoFormScreen} options={{ title: 'Trabalho' }} />
            <TrabalhoStack.Screen name="Atividades" component={AtividadesScreen} options={{ title: 'Atividades' }} />
            <TrabalhoStack.Screen name="AtividadeForm" component={AtividadeFormScreen} options={{ title: 'Atividade' }} />
        </TrabalhoStack.Navigator>
    );
}

function AndamentoStackScreen() {
    return (
        <AndamentoStack.Navigator screenOptions={screenOptions}>
            <AndamentoStack.Screen name="AndamentoMain" component={AndamentoScreen} options={{ title: 'Andamento' }} />
        </AndamentoStack.Navigator>
    );
}

function GraficoStackScreen() {
    return (
        <GraficoStack.Navigator screenOptions={screenOptions}>
            <GraficoStack.Screen name="GraficoMain" component={GraficoScreen} options={{ title: 'Gráfico' }} />
        </GraficoStack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    paddingBottom: 4,
                    height: 56,
                },
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        Alunos: 'people',
                        Trabalhos: 'briefcase',
                        Andamento: 'timer',
                        Grafico: 'bar-chart',
                    };
                    return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Alunos" component={AlunosStackScreen} />
            <Tab.Screen name="Trabalhos" component={TrabalhosStackScreen} />
            <Tab.Screen name="Andamento" component={AndamentoStackScreen} />
            <Tab.Screen name="Grafico" component={GraficoStackScreen} options={{ title: 'Gráfico' }} />
        </Tab.Navigator>
    );
}
