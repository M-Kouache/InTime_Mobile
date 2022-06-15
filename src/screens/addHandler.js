import BouncyCheckbox,{ ICheckboxButton} from 'react-native-bouncy-checkbox'
import { useState, useEffect, useContext} from 'react'
import { SafeAreaView, Alert } from 'react-native'
import { Center, Spinner, FlatList, ScrollView, Spacer, Avatar, Heading, Input, Box, Checkbox, Text, VStack, Select, CheckIcon, FormControl, Button, Link, HStack} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../utils/contextProvider'
import { RegisterUserProfile, getUserService } from '../utils/userRegister';
import { setUser, getUser} from '../utils/localStorage'
import { getUsers, addHandler, removeHandler } from '../utils/handlersManager'



// list to hold all users to be removed from handling events
const handlerToBeRemovedList = []



const AddHandler = () => {

    const {userData, user, forceToRun, setForceToRun} = useContext(UserContext)

    const navigation = useNavigation()

    const [AddHandlerList,setAddHandlerList] = useState(
        <Select.Item label="No user Choose" value={null} />
    )
    
    const [Loading,setLoading] = useState(false)

    const [processRequest,setProcessRequest] = useState(false)

    const [selectUsers, setSelectUsers] = useState(null)

    const [handlingFor, sethandlingFor] = useState(null);

    const [myHandlers, setMyHandlers] = useState(null)

    const [addSelectedHandler, setAddSelectedHandler] = useState({handler:null})

    const [componentDisable, setComponentDisable] = useState(false)
  


    useEffect(() => {
        if(userData !== null){
            renderHandling()
        }
    },[userData])

    useEffect(() => {
        LoadUsers()
    },[myHandlers])

    useEffect(() => {
        if (selectUsers != null){
            renderAddHandlerList()
        }
    },[selectUsers])


    const LoadUsers = async () =>{

        try {
            const response = await getUsers(user.access) 
            if(response.status === 200) {
                const response_data = response.data
                const _users = []
                response_data.forEach(user => {
                    let exist = 0
                    if ( myHandlers != null ){
                        myHandlers.forEach(item =>{
                            if (user.id === item.id){
                                exist += 1
                            }
                        })
                    }
                    if(user.id === userData.info.id) exist += 1
                    if (exist === 0 ) _users.push(user)
                })
                setSelectUsers(_users)
                setComponentDisable(false)
            }
        } catch (error) {
            console.error(error)
        }
    }



    const renderHandling = () => {


        const handlingForUserData = userData.handling
        const handlers = userData.handlers

        const handlingForDataList = []
        const handlerDataList = []
        
        handlingForUserData.map(user =>{
            handlingForDataList.push({
                id:user.id,
                fullName:user.first_name+' '+user.last_name,
                email:user.email,
                avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            })
        })

        handlers.map(user => {
            handlerDataList.push({
                id:user.id,
                fullName:user.first_name+' '+user.last_name,
                email:user.email,
            })
        })

        if (handlingForDataList.length == 0) sethandlingFor(null) 
        if ( handlingForDataList.length > 0) sethandlingFor(handlingForDataList)
        if (handlerDataList.length == 0) setMyHandlers(null)
        if ( handlerDataList.length > 0) setMyHandlers(handlerDataList)

    }


    const renderAddHandlerList = () =>{

        setAddHandlerList(
            selectUsers.length > 0 ?
                selectUsers.map(user =>{
                    return(<Select.Item label={user.first_name+' '+user.last_name} key={user.id} value={user.id} />)
                }) : 
            <Select.Item label="No user left to handle your events" value={null} />
        )           

    }

    const addNewHandler = async () => {

        try {

            setComponentDisable(true)
            if ( addSelectedHandler.handler != null ) {
                setProcessRequest(true) 
                const response = await addHandler(addSelectedHandler,user.access)
                if(response.status === 200){
                    setProcessRequest(false)
                    Alert.alert('Manager','Handler added with success')
                    setComponentDisable(true)
                    setSelectUsers(null)
                    setMyHandlers(null)
                    if (forceToRun){
                        setForceToRun(false)
                    }else{
                        setForceToRun(true)
                    }
                }
            }

            if ( addSelectedHandler.handler == null) Alert.alert('Manager','There is no handler add')
            
        } catch (error) {
            Alert.alert('Manager','There was an error,Please try again later')
        }
   }

    const manageRemoveHandler = (RemoveHandler) => {

        if ( handlerToBeRemovedList.length > 0 ){
            for ( let i = 0; i <= handlerToBeRemovedList.length; i++ ){
                if (handlerToBeRemovedList[i] === RemoveHandler ) {
                    handlerToBeRemovedList.splice(i,1)
                }
            }
        }
    }

    const removeHandlerManager = async () => {

        try {
 
            if ( handlerToBeRemovedList.length > 0 ) {
                setProcessRequest(true)
                const response = await removeHandler(handlerToBeRemovedList,user.access)
                if(response.status === 200) {
                    setProcessRequest(false)
                    Alert.alert('Handler manager',handlerToBeRemovedList.length+' Handler were deleted. ')
                    setSelectUsers(null)                
                    if (forceToRun){
                        setForceToRun(false)
                    }else{
                        setForceToRun(true)
                    }

                }
                
            }
                    
            if( handlerToBeRemovedList.length == 0 ) {
                if (processRequest) setProcessRequest(false)
                Alert.alert('Handler manager','Please Select a handler to replace')
                navigation.jumpTo('Home')
            }
           
        } catch (error) {
            if (error.response.status == 500){
                setProcessRequest(false)
                Alert.alert('Handler manager','Something went wrong')
            }  
        }
    }

    return (
        <Box py={10} flex={1}>
            <HStack w="100%" justifyContent="space-between"  px={4}>
                <Button onPress={() => navigation.goBack()}borderRadius={25} marginBottom={2} w={90}>Go back</Button>
            </HStack>
            {Loading ? <Center flex={1}   alignItems="center"><Spinner color="primary.500" size="lg" /></Center> :  
            <Box w="100%" px={4} position="relative"  alignItems="center" >
                {
                    processRequest ?
                    <Box position="absolute" borderRadius="25" alignItems="center" bg="indigo.200" zIndex={10000}  justifyContent="center" top="25%"  w="280" height="230">
                        <Spinner color="green.500" size="lg"  />
                        <Text marginTop={4} fontSize={16}>Proccessing request...</Text>
                    </Box> :
                    null
                }
                <Box  px={4} w="100%" paddingTop="5" >
                    <Heading fontSize="xl" marginBottom="5">
                        Customize your event handlers
                    </Heading>
                    <FormControl marginBottom="10">
                        <FormControl.Label>Add a new handler</FormControl.Label>
                        <HStack w="100%">
                            <Select isDisabled={componentDisable}  selectedValue={addSelectedHandler.handler} minWidth="280" accessibilityLabel="Choose handler" placeholder="Choose handler" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                                }}  onValueChange={itemValue => {
                                    setAddSelectedHandler({handler:itemValue})} }>
                                {
                                    AddHandlerList                         
                                }
                            </Select>
                            <Button marginLeft={2} onPress={addNewHandler} >Add</Button>
                        </HStack>
                    </FormControl>
                    <Box h={250}>
                        <HStack>
                            <Heading fontSize="lg" marginBottom="5">
                                Your working handlers 
                            </Heading>
                        </HStack>
                        <ScrollView >
                            <VStack space={3} px={4} py="4">
                                {  myHandlers != null  ? 
                                    myHandlers.map(handler =>{
                                        return(    
                                        <BouncyCheckbox
                                            size={30}
                                            key={handler.id}
                                            fillColor="#ffc484"
                                            unfillColor="#FFFFF"
                                            textComponent={
                                                <Box borderBottomWidth="1" _dark={{
                                                    borderColor: "gray.600"
                                                    }} borderColor="coolGray.200" pl="4" pr="5" py="2">
                                                    <VStack>
                                                        <Text _dark={{
                                                    color: "warmGray.50"
                                                }} color="coolGray.800" bold>
                                                        {handler.fullName}
                                                        </Text>
                                                        <Text color="coolGray.600" _dark={{
                                                    color: "warmGray.200"
                                                }}>
                                                        {handler.email}
                                                        </Text>
                                                    </VStack>
                                                </Box>
                                            }
                                            onPress={(selectedItem) => {
                                                const id = handler.id
                                                if (selectedItem){
                                                    handlerToBeRemovedList.push(id)
                                                }

                                                if(!selectedItem){
                                                    manageRemoveHandler(id)
                                                }

                                            }}
                                        />)
                                    }) :
                                <Box alignItems="center" bg="amber.100" padding="5">
                                    <Text color="red.400" fontSize="18">No Handlers</Text>
                                </Box>
                            }
                            </VStack>
                        </ScrollView>
                    </Box>
                    <Box >
                        <Button onPress={removeHandlerManager}  marginTop="5" >Delete Handler</Button>
                    </Box>
                </Box>
                <Box paddingTop="10" h={390}>
                    <Heading fontSize="xl" p="4" pb="3">
                        Your Currently handling for
                    </Heading>
                    <FlatList paddingTop="4" data={handlingFor} renderItem={({
                    item
                    }) => <Box borderBottomWidth="1" _dark={{
                    borderColor: "gray.600"
                    }} borderColor="coolGray.200" pl="4" pr="5" py="2">
                            <HStack space={3} justifyContent="space-between">
                            <Avatar size="48px" source={{
                        uri: item.avatarUrl
                        }} />
                            <VStack>
                                <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                                {item.fullName}
                                </Text>
                                <Text color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                                {item.email}
                                </Text>
                            </VStack>
                            <Spacer />
                            <Text fontSize="xs" _dark={{
                        color: "warmGray.50"
                        }} color="coolGray.800" alignSelf="flex-start">
                                {}
                            </Text>
                            </HStack>
                        </Box>} keyExtractor={item => item.id} />
                </Box>
                
            </Box>
            }
        </Box>
    )

};



export default AddHandler;