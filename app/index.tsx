import AudioListScreen from "@/screens/AudioListScreen";
import PlayerScreen from "@/screens/PlayerScreen";
import { createStackNavigator } from "@react-navigation/stack";

export type RootStackParamList = {
    AudioList: undefined; 
    PlayerScreen: { audio: any }; 
};

  const Stack = createStackNavigator<RootStackParamList>();
  
function App(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }}
            name="AudioList" component={AudioListScreen}>
            </Stack.Screen>
            <Stack.Screen name="PlayerScreen" component={PlayerScreen}>
                
            </Stack.Screen>
        </Stack.Navigator>
    );
}

export default App;