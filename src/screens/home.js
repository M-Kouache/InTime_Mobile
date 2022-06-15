import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Calendar} from 'react-native-big-calendar'
import { Agenda, AgendaList } from 'react-native-calendars'
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Alert } from 'react-native'
import { Button, Modal, Badge, HStack, TextArea, Heading, useDisclose, Actionsheet, FormControl, Divider, Input, Icon, Spinner,Center, Fab, Box, Text } from 'native-base'
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
                    allDay:true, 
                    title: event.body.title,
                    start:new Date(event.body.date_start),
                    end:new Date(event.body.date_end),
                })
            })
            console.log(data)
            setEventItems(data)
        }
    }

    const [calendarMode, setCalendarMode] = useState('day');

    const [show, setShow] = useState({})

    const eventNotes = useMemo(
        () => (
            <View style={{ marginTop: 3 }}>
            <Text style={{ fontSize: 10, color: 'white' }}> Phone number: 555-123-4567 </Text>
            <Text style={{ fontSize: 10, color: 'white' }}> Arrive 15 minutes early </Text>
            </View>
        ),
        [],
    )


    const events = [
        {
            id:0,
            title: 'Meeting',
            start: '2022-06-07T01:00:00.000Z',
            end: '2022-06-07T02:01:00.000Z',
        },
        {
            id:1,
            title: 'Coffee break',
            start: '2022-06-07T07:07:00.000Z',
            end: '2022-06-07T09:09:00.000Z',
            children:eventNotes,
        },
    ]

    const renderCalendarMode = (mode)=> {
        setCalendarMode(mode);
    }

    return (
        <SafeAreaView style={{height: '100%'}} onLayout={e => setShow({ layout: e.nativeEvent.layout })} >
            {/* <HStack> 
                <Button borderRadius={25} onPress={()=>{renderCalendarMode("day")}}>day</Button>
                <Button borderRadius={25} onPress={()=>{renderCalendarMode("3days")}}>3days</Button>
                <Button borderRadius={25} onPress={()=>{renderCalendarMode("week")}}>week</Button>
                <Button borderRadius={25} onPress={()=>{renderCalendarMode("month")}}>month</Button>
            </HStack>
            */}
            {show.layout ?  
                <Calendar mode={calendarMode} ampm={true} 
                    events={eventItems} height={600} 
                    onPressEvent={e => Alert.alert("massege","event clicked")} 
                    headerComponentStyle={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                />

            /*<Agenda   
                items={
                    eventItems
                }
                minDate={'2022-05-01'}
                maxDate={'2024-05-30'}
                pagingEnabled={false}
                showClosingKnob={true}
                pastScrollRange={1}
                futureScrollRange={7}

                rowHasChanged={(r1, r2) => {
                    return r1.text !== r2.text;
                }}

                renderEmptyData={()=>{
                    return (
                        <Box w="100%" h="100%" justifyContent="center" alignItems="center">
                            <Heading color="red.300">No Events For Today</Heading>
                        </Box>
                    )
                }}

                renderItem={(item, firstItemInDay) => {return (
                   <Box bg="white" my={4} px={4} py={4} borderRadius={8} 
                        onPress={() => console.log("Pressed")}     
                   >
                        <Heading fontSize="lg">
                            {item.body.title}{" "} 
                            <HStack w={295} px={2} justifyContent="space-between">
                                <Text ml={2} fontSize="sm" color="gray.500" >Mr {item.user_info.first_name+' '+item.user_info.last_name} </Text>
                                <Badge borderRadius={25} colorScheme="seccess" >{item.pub_info.libelle}</Badge>
                            </HStack>
                        </Heading>
                        <Text pt="3" mb={2}>
                            {item.body.description}
                        </Text>
                        <Button onPress={()=> navigation.navigate('EventDetails',{data:item})} size={"sm"} variant="outline" colorScheme="primary" w={100}>Read More</Button>
                    </Box> 
                );}}
                style={{alignContent: "space-between"}}
            />*/ : <Center h="100%"> <Spinner size="lg" /> </Center>}
        
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

