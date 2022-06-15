import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/login'
import Signup from '../screens/signup'
import DrawerNav from './drawer'
import AdminPanel from '../screens/adminPanel'
import SetService from '../screens/setService'


const Stack = createNativeStackNavigator()


const StackNav = ()=> {
    return(
        <Stack.Navigator  initialRouteName='DrawerNav'>
            <Stack.Screen name="DrawerNav" component={DrawerNav} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={Login}  options={{headerShown: false}} />
            <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />
            <Stack.Screen name="SetService" component={SetService} options={{headerShown: false}} />
            <Stack.Screen name="AdminPanel" component={AdminPanel} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}


export default StackNav;

