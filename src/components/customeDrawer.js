import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Box, Text, Divider, ScrollView, Center, Button, HStack,} from 'native-base'
import { StyleSheet } from 'react-native'
import { UserContext } from '../utils/contextProvider'
import { useContext } from 'react'
import { getUser, } from '../utils/localStorage'



const CustomeDrawer = (props)=> {

    const {setUser,userData} = useContext(UserContext)

    const [Data,setData] = useState(null)

    const [isAdmin, setisAdmin] = useState(false)

    useEffect(() => {
        if (userData != null){
            setData(userData)
        }
    },[userData])

    const clearLocalStorage = async () => {
        try {
            await AsyncStorage.clear()
            getUser().then(user => {
                setUser(user)
                if (user === null) props.navigation.replace('Login')
            })
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <Box w="100%" flex={1} style={{marginTop:50,paddingBottom:1}}>
            <Box w="100%" h="10%"  px={4}>
                <HStack justifyContent="space-between" alignItems="center" >
                    <Text color="gray.500" fontSize="lg">{Data != null ? Data.info.first_name+' '+Data.info.last_name : "name"}</Text>
                    {
                        Data != null ? Data.is_staff ? 
                        <Button color="green.300" style={style.btn_admin} onPress={() => navigation.replace('AdminPanel')} >Admin</Button>
                        : <Text></Text> : <Text></Text>
                    }
                </HStack>
            </Box>
            <Divider my={2} />
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <Divider my={2} />
            <Box w="100%" h="55%" paddingBottom="5" px={4}>
            </Box>
            <Button onPress={clearLocalStorage}>logout</Button>
        </Box>
    )
}

const style = StyleSheet.create({
    btn_admin:{
        borderRadius:50,
    },
    mr_top_battom:{
        marginTop:5,
        marginBottom:5,
        borderRadius:25
    }
})

export default CustomeDrawer;
