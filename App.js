import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AlunosScreen from './screens/AlunosScreen.js';
import HomeScreen from './screens/HomeScreen';
import TrabalhosScreen from './screens/TrabalhosScreen.js';
import AtividadesScreen from './screens/AtividadesScreen.js';
import AlunosAddScreen from './screens/AlunosAddScreen.js';
import TrabalhosAddScreen from './screens/TrabalhosAddScreen.js';
import AtividadesAddScreen from './screens/AtividadesAddScreen.js';
import CreditosScreen from './screens/CreditosScreen.js';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#4F46E5', elevation: 0, shadowOpacity: 0 },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '600', fontSize: 18 },
  headerBackTitleVisible: false,
  cardStyle: { backgroundColor: '#F1F5F9' },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Registro de Trabalhos' }} />
        <Stack.Screen name="Alunos" component={AlunosScreen} />
        <Stack.Screen name="Trabalhos" component={TrabalhosScreen} />
        <Stack.Screen name="Atividades" component={AtividadesScreen} />
        <Stack.Screen name="AlunosAdd" component={AlunosAddScreen} options={({ route }) => ({ title: route.params?.aluno ? 'Editar Aluno' : 'Novo Aluno' })} />
        <Stack.Screen name="TrabalhosAdd" component={TrabalhosAddScreen} options={({ route }) => ({ title: route.params?.trabalho ? 'Editar Trabalho' : 'Novo Trabalho' })} />
        <Stack.Screen name="AtividadesAdd" component={AtividadesAddScreen} options={({ route }) => ({ title: route.params?.atividade ? 'Editar Atividade' : 'Nova Atividade' })} />
        <Stack.Screen name="Creditos" component={CreditosScreen} options={{ title: 'Créditos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
