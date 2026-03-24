
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AlunosScreen from './screens/AlunosScreen.js';
import HomeScreen from './screens/HomeScreen';
import TrabalhosScreen from './screens/TrabalhosScreen.js';
import AtividadesScreen from './screens/AtividadesScreen.js';
import AlunosAddScreen from './screens/AlunosAddScreen.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Alunos" component={AlunosScreen} />
        <Stack.Screen name="Trabalhos" component={TrabalhosScreen} />
        <Stack.Screen name="Atividades" component={AtividadesScreen} />
        <Stack.Screen name="AlunosAdd" component={AlunosAddScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}