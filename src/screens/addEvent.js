import { Center, ScrollView, CheckIcon, Select, useDisclose, VStack, FormControl, Spinner, Box, Divider, TextArea, HStack, Input, Text, Button, Actionsheet, } from 'native-base'
import { useState, useReducer, useEffect, useContext } from 'react'
import { Alert } from 'react-native'
import { StyleSheet, } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { UserContext } from '../utils/contextProvider'
import { addEvent } from '../utils/eventManager'

const MonthThree = {
    Jan:'01', 
    Feb:'02', 
    Mar:'03', 
    Apr:'04', 
    May:'05',
    Jun:'06', 
    Jul:'07', 
    Aug:'08', 
    Sept:'09', 
    Oct:'10', 
    Nov:'11', 
    Dec:'12', 
}


const ACTIONS = {
    DateStartAction: 'DateStartAction',
    TimeStartAction: 'TimeStartAction',
    DateEndAction : 'DateEndAction',
    TimeEndAction : 'TimeEndAction'
}


const AddEvent = ()=>{

    const {user, userData, forceToRun, setForceToRun} = useContext(UserContext)

    const navigation = useNavigation()


    const [processRequest,setProcessRequest] = useState(false)

    //return Time from full date object
    const getTime = (date) => {
        try {
            if(date != null){
                const time = date.toTimeString().split(' ')[0]
                return time.split(':')[0]+ ':' + time.split(':')[1]
            }

        } catch (error) {
            console.log(error)      
        }
    }
   
    // return date from full date object
    const getDate = (date) => {
        try {
            if(date != null){
                return date.toDateString()
            }

            return 'Default to today'

        } catch (error) {
            console.log(error)      
        }
    }

    // startDate to be shown as minimum date for dateEnd
    const [MinimumDateEnd,setMinimumDateEnd] = useState(new Date())
    
    // date show state handlers
    const [pickTimeStart,setPickTimeStart] = useState(false)
    const [pickDateStart,setPickDateStart] = useState(false)
    const [pickTimeEnd,setPickTimeEnd] = useState(false)
    const [pickDateEnd,setPickDateEnd] = useState(false)

    const [eventData,setEventData] = useState({})

    const initialState = {

        DateStart: getDate(new Date()),
        TimeStart: getTime(new Date()),
        DateEnd: getDate(new Date()),
        TimeEnd: getTime(new Date()),

    }


    const reducer = (state, action)=> {

       switch (action.type) {
            case ACTIONS.DateStartAction:
                return {...state,
                    DateStart:action.payload,
                    DateEnd:action.payload
                }
            case ACTIONS.TimeStartAction:
                return {...state,
                    TimeStart:action.payload,
                }
            case ACTIONS.DateEndAction :
                return {...state,
                    DateEnd:action.payload,
                }
            case ACTIONS.TimeEndAction :
                return {...state,
                    TimeEnd:action.payload,
                }
            default :
                return state
       }

    }

    const [ state, dispatch ] = useReducer(reducer, initialState)


    const dateFormatManager = ()=>{

        const renderDateStartMonthNbr = state.DateStart.split(' ')[1]
        const renderDateEndMonthNbr = state.DateEnd.split(' ')[1]
        
        setEventData({...eventData,
            date_start:state.DateStart.split(' ')[3] + '-' + MonthThree[renderDateStartMonthNbr] + '-' + state.DateStart.split(' ')[2]+'T'+state.TimeStart+':00Z',
            date_end:state.DateEnd.split(' ')[3] + '-' + MonthThree[renderDateEndMonthNbr] + '-' + state.DateEnd.split(' ')[2]+'T'+state.TimeEnd+':00Z'
        })

    }


    useEffect(() => {
        dateFormatManager()
    },[state.DateStart,state.TimeStart,state.DateEnd,state.TimeEnd])

    useEffect(() => {
        renderActors()
    },[userData])


    const renderActors = ()=> {
        return(
            userData.handling != null ? 
                userData.handling.map(handling =>{
                    return(
                        <Select.Item label={handling.first_name+' '+handling.last_name} key={handling.username} value={handling.id} />
                    )
                }) : null
        )
    }


    const validate = () => {
      if (eventData.visibilty === undefined || eventData.title === undefined || eventData.description === undefined || eventData.actor === undefined || eventData.date_start === null || eventData.date_end === null) {
        Alert.alert('Event Manager','Please Complete the remaining fields')
        return false;
      }
      return true;
    };

    const addEventManager = async ()=> {

        dateFormatManager()
        
        try {

            if(validate()) {
                setProcessRequest(true)
                const response = await addEvent(eventData,user.access) 
                if(response.status === 200){
                    setProcessRequest(false)
                    if(forceToRun){
                        setForceToRun(false)
                    }else{
                        setForceToRun(true)
                    }
                    Alert.alert('Event Manager','Event Added Successfully.')
                    navigation.goBack()
                }
                if(response.status === 400 ){
                    Alert.alert('Event Manager','Somethind Went wrong. Please try later.')
                    navigation.goBack()
                }
            }

        } catch (error) {
            
        }
    }

  return (
      <Box position="relative" >
        {
            processRequest ?
            <Box position="absolute" borderRadius="25" alignItems="center" bg="indigo.200" zIndex={10000}  justifyContent="center" top="35%" left="14%" w="280" height="230">
                <Spinner color="green.500" size="lg"  />
                <Text marginTop={4} fontSize={16}>Proccessing request...</Text>
            </Box> :
            null
        }
        <ScrollView marginBottom="60"  paddingTop="10" >
                <HStack px={4} w="100%" justifyContent="space-between" >
                    <Button onPress={() => navigation.goBack()} borderRadius={25}  w={90}>Go back</Button>
                </HStack>
                <Box  w="100%" paddingBottom="10" flex={1} px={4} marginTop="2">
                        { pickDateStart ? <DateTimePicker  minimumDate={new Date()} mode={'date'} value={new Date()} onChange={(event, value) =>{
                            if( event.type === 'set' && event.nativeEvent != null){
                                setPickDateStart(false)
                                setMinimumDateEnd(value)
                                dispatch({type:ACTIONS.DateStartAction, payload:getDate(value)})
                            }
                            if( event.type === 'dismissed'){
                                setPickDateStart(false)
                            }
                        }}/> : null}
                        { pickTimeStart ? <DateTimePicker mode={'time'} value={new Date()} onChange={(event, value) =>{
                            if( event.type === 'set' && event.nativeEvent != null){
                                setPickTimeStart(false)
                                dispatch({type:ACTIONS.TimeStartAction, payload:getTime(value)})
                            }
                            if (event.type === 'dismissed'){
                                setPickTimeStart(false)
                            }
                        }}/> : null}
                        { pickDateEnd ? <DateTimePicker minimumDate={MinimumDateEnd} mode={'date'} value={new Date()} onChange={(event, value) =>{
                            if( event.type === 'set' && event.nativeEvent != null){
                                setPickDateEnd(false)
                                dispatch({type:ACTIONS.DateEndAction, payload:getDate(value)})
                            }
                            if (event.type === 'dismissed'){
                                setPickDateEnd(false)
                            }
                        }}/> : null}
                        { pickTimeEnd ? <DateTimePicker mode={'time'} value={new Date()} onChange={(event, value) =>{
                            if( event.type === 'set' && event.nativeEvent != null){
                                setPickTimeEnd(false)
                                dispatch({type:ACTIONS.TimeEndAction, payload:getTime(value)})
                            }
                            if ( event.type === 'dismissed'){
                                setPickTimeEnd(false)
                            }
                        }}/> : null}
                            <Box w="100%" h={60} px={4} style={style.mr_top_battom} justifyContent="center">
                                <FormControl>
                                    <FormControl.Label>Title</FormControl.Label>
                                    <Input name="Title" type="text" required={true} placeholder="Event Title" onChangeText={value => setEventData({...eventData,
                                    title: value
                                    }) }/>
                                    <Text color="red.400"></Text>
                                </FormControl>
                            </Box>
                            <Divider my={2} />
                            <Box w="100%" h={60} px={4} style={style.mr_top_battom} justifyContent="center">
                                <Text marginBottom="3" color="gray.500">Event Date</Text>

                                <HStack justifyContent="space-between">
                                    <VStack >
                                    <Button onPress={
                                        ()=> {
                                            setPickDateStart(true)
                                        }
                                    } bg="indigo.400">Pick Start Date</Button>
                                    <Text  color="gray.500">{state.DateStart}</Text>
                                    </VStack>
                                    <VStack alignItems="center">
                                    <Button onPress={
                                        ()=> {
                                        setPickTimeStart(true)
                                        }
                                    } bg="indigo.400">Pick Start Time</Button>
                                    <Text color="gray.500" >{state.TimeStart}</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                            <Box w="100%" h={60} px={4} style={style.mr_top_battom} justifyContent="center">
                                <HStack justifyContent="space-between">
                                    <VStack>
                                    <Button onPress={
                                        ()=> {
                                            setPickDateEnd(true)
                                        }
                                    } bg="indigo.400">Pick End Date</Button>
                                    <Text color="gray.500">{state.DateEnd}</Text>
                                    </VStack>
                                    <VStack alignItems="center">
                                    <Button onPress={
                                        ()=> {
                                            setPickTimeEnd(true)
                                        }
                                    } bg="indigo.400">Pick End Time</Button>
                                    <Text color="gray.500"> {state.TimeEnd}</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                            <Divider my={2} />
                            <Box w="100%" h={60} px={4}  style={style.mr_top_battom} justifyContent="center">
                                <FormControl>
                                    <FormControl.Label>Event visibilty</FormControl.Label>
                                        <Select selectedValue={eventData.visibilty} minWidth="200" accessibilityLabel="Event visibilty" placeholder="Event visibilty" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                            }} mt={1} onValueChange={(itemValue) => {
                                                setEventData({...eventData,visibilty:itemValue})
                                            }}>
                                            <Select.Item label="Public event" key="public"  value={true} />
                                            <Select.Item label="Private event" key="private" value={false} />
                                            <Select.Item label="My department" key="myDepartment" value={userData.department.id} />
                                        </Select> 
                                </FormControl>
                            </Box>
                            <Box w="100%" h={60} px={4}  style={style.mr_top_battom}justifyContent="center">
                                <FormControl>
                                    <FormControl.Label>Actor </FormControl.Label>
                                        <Select selectedValue={eventData.actor} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                            }} mt={1} onValueChange={itemValue =>{
                                                setEventData({...eventData,actor:itemValue})
                                            }}>
                                            <Select.Item label="Me"  value={userData.info.id} />
                                            {
                                                renderActors()   
                                            }
                                        </Select> 
                                </FormControl>
                            </Box>
                            <Box w="100%" h={60} px={4}  style={style.mr_top_battom}justifyContent="center">
                                <FormControl>
                                    <FormControl.Label>Location</FormControl.Label>
                                    <Input name="location" type="text" required={true} placeholder="Event location go's here" onChangeText={value => setEventData({...eventData,
                                    location: value
                                    }) }/>
                                    <Text color="red.400"></Text>
                                </FormControl>
                            </Box>
                            <Box w="100%" px={4}  justifyContent="center">
                                <FormControl >
                                    <FormControl.Label>Decription</FormControl.Label>
                                    <TextArea h={40} name="description" type="text" required={true} placeholder="Description" onChangeText={value => setEventData({...eventData,
                                    description: value
                                    }) }/>
                                    <Text color="red.400"></Text>
                                </FormControl>
                            </Box>
                    </Box>
                    
            </ScrollView>
            <Box position="absolute" bottom={0} bg="gray.100" right={0}  w="100%" h={70} px={8} marginTop="3" justifyContent="center">
                <Button onPress={addEventManager}>Save</Button>
            </Box>
        </Box>
      
    )
}


const style = StyleSheet.create({
    mr_top_battom:{
        marginBottom:12,
        marginTop:18
    }
})

export default AddEvent;
