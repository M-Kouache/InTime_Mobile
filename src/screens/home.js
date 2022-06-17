import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {LinearGradient} from 'expo-linear-gradient'
import { EvilIcons, Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Calendar} from 'react-native-big-calendar'
import { Agenda, AgendaList } from 'react-native-calendars'
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Alert } from 'react-native'
import { Button, IconButton, Modal, Badge, HStack, TextArea, Heading, useDisclose, Actionsheet, FormControl, Divider, Input, Icon, Spinner,Center, Fab, Box, Text } from 'native-base'
import AddEvent from './addEvent'
import { UserContext, } from '../utils/contextProvider'
import { getUser, } from '../utils/localStorage'
import StaggerComponent from '../components/stagger'




const Home = ()=> {

    const navigation = useNavigation()

    const {user,userData,eventData,authorized} = useContext(UserContext)

    const [eventItems, setEventItems] = useState([])

    const isLoggedIn = ()=>{ if(user === null ) navigation.replace('Login') }

    useEffect(()=> {
        isLoggedIn()
        eventFormatter()
    },[eventData])


    useEffect(() => {
        if (!authorized) {
            navigation.replace('Login')
            AsyncStorage.clear().then(() =>{})
        }
    },[authorized])

    const eventFormatter = ()=> {
        if ( eventData != null ){
            let data = []
            eventData.map((event) => {
                data.push({
                    id:event.body.id,
                    body:event.body,
                    user:event.user_info,
                    department:event.pub_info,
                    title: event.body.title,
                    start:new Date(event.body.date_start),
                    end:new Date(event.body.date_end),
                })
            })
            setEventItems(data)
        }
    }

    const [calendarMode, setCalendarMode] = useState('month');

    const [calendarDate, setCalendarDate ] = useState(new Date())

    const [show, setShow] = useState({})

    const renderCalendarMode = (mode)=> {
        setCalendarMode(mode);
    }

    return (
        <SafeAreaView style={{height: '100%'}} onLayout={e => setShow({ layout: e.nativeEvent.layout })} >
            <StatusBar style="light" />
            <LinearGradient colors={['rgba(46, 36, 31, 1)','rgba(46, 36, 31,0.7)','rgba(46, 36, 31,0.5)','rgba(46, 36, 31,0)']} style={{paddingBottom:22,paddingTop:40}} >
                <HStack style={{marginLeft:11,marginRight:11,display:'flex',alignItems: 'center', justifyContent:'space-between'}}> 
                    <IconButton onPress={()=> navigation.openDrawer()} p="1.5"  variant="solid" bg="rgba(46, 36, 31,0.3)" colorScheme="light" borderRadius="full" icon={<Icon as={EvilIcons} _dark={{
                    color: "gray.400"
                    }} size="7" name="navicon" color="warmGray.50" />} />
                    <IconButton onPress={()=> setCalendarDate(new Date()) } p="2" variant="solid" bg="indigo.500" colorScheme="indigo" borderRadius="full" icon={<Icon as={Ionicons} size="6" name="today-outline" _dark={{
                    color: "warmGray.50"
                    }} color="warmGray.50" />} />
                </HStack>
            </LinearGradient>
            {show.layout ?  
                <Calendar mode={calendarMode} ampm={true} 
                    events={eventItems} height={600} 
                    onPressEvent={e =>  navigation.navigate('EventDetails',{data:e})} 
                    onPressCell = { e => {
                        setCalendarDate(e)
                        renderCalendarMode('day')
                    } }
                    date={calendarDate}
                    headerContainerStyle={{
                        paddingTop:0,
                        height:"8%",
                        backgroundColor:'rgba(0, 0, 0,0)'
                    }}
                />
            : <Center h="100%"> <Spinner size="lg" /> </Center>}
        
        <StaggerComponent calendar_mode={renderCalendarMode} />
    </SafeAreaView>
    )
}


const style = StyleSheet.create({
    mr_top_battom:{
        marginBottom:12,
        marginTop:14
    }
})


export default Home;

