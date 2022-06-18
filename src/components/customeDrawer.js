import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { Box, Text, Icon, IconButton, Pressable, VStack, ScrollView, Center, Button, HStack, useColorModeValue,} from 'native-base'
import { StyleSheet, Alert } from 'react-native'
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
                    <VStack w="100%">
                    <Text fontSize="lg" mb="2"><Text color={useColorModeValue("coolGray.800","warmGray.50")} fontWeight="bold" fontSize="2xl">InTime </Text><Text color={useColorModeValue("coolGray.700","warmGray.50")} fontSize="xl"> Calendar</Text></Text>
                    <Text color="gray.500" fontSize="md">{Data != null ? Data.info.first_name+' '+Data.info.last_name : "name"}</Text>
                    </VStack>
                   {
                        Data != null ? Data.is_staff ? 
                        <Button color="green.300" style={style.btn_admin} onPress={() => navigation.replace('AdminPanel')} >Admin</Button>
                        : <Text></Text> : <Text></Text>
                    }
                </HStack>
            </Box>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <Box w="100%" h="55%" paddingBottom="5" px={4}>
            </Box>
            <HStack style={{paddingLeft:30, paddingBottom:30}}>
                <Pressable onPress={clearLocalStorage}  w="55%" style={{display:'flex',alignItems:'center',flexDirection: 'row',}} >
                    <Icon color={useColorModeValue("coolGray.800","warmGray.50")} as={Ionicons} size="6" name="md-log-out-outline" _dark={{
                    color: "warmGray.50"
                    }} /> 
                    <Text  ml="3" fontSize="lg" fontWeight="bold" color={useColorModeValue("coolGray.800","warmGray.50")} >Sign Out</Text>
                </Pressable>
            </HStack>
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
