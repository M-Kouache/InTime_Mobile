import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from '../screens/home'
import AddEvent from '../screens/addEvent'
import EventDetails from "../screens/eventDetails";
import AddHandler from '../screens/addHandler'
import CustomeDrawer from '../components/customeDrawer'
import { useWindowDimensions } from 'react-native'


const Drawer = createDrawerNavigator()


const DrawerNav = ()=> {

    const dimensions = useWindowDimensions()

    return (
        <Drawer.Navigator drawerContent={props => <CustomeDrawer {...props} />}  initialRouteName="Home"       screenOptions={{
            drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        }} >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Add an Event" component={AddEvent} options={{headerShown: false}}/>
            <Drawer.Screen name="Handlers Manager" component={AddHandler} options={{headerShown: false}}/>
            <Drawer.Screen name="EventDetails" component={EventDetails} options={{headerShown: false}} />
        </Drawer.Navigator>
    )
}

export default DrawerNav