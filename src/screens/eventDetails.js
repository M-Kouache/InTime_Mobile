import { Box, Divider, Heading, Text, HStack, Spinner, Button, Badge} from 'native-base'
import { Alert } from 'react-native'
import { removeEvent } from '../utils/eventManager'
import { useContext, useState } from 'react'
import { UserContext } from '../utils/contextProvider'


const EventDetails = ({route,navigation})=> {
   
    const {data} = route.params
    const {user,forceToRun,userData, setForceToRun} = useContext(UserContext)
    const [processRequest,setProcessRequest] = useState(false)


    const removeEventManager = async ()=> {
        setProcessRequest(true)
        const response = await removeEvent(data.id,user.access)
        if (response.status === 200){
            setProcessRequest(false)
            Alert.alert('Event Manager','seccessfuly removed event.')
            if(forceToRun){
                setForceToRun(false)
            }else{
                setForceToRun(true)
            }
            navigation.goBack()
        }
        if (response.status === 500) {
            setProcessRequest(false)
            Alert.alert('Event Manager','Error while removing event, Please try later')
            navigation.goBack()
        }
    }


    return(

        <Box flex={1} bg="white"  px={4} py={10} borderRadius={8} 
            onPress={() => console.log("Pressed")}     
        >
            {
                processRequest ?
                <Box position="absolute" borderRadius="25" alignItems="center" bg="indigo.200" zIndex={10000}  justifyContent="center" top="40%" left="14%"  w="280" height="230">
                    <Spinner color="green.500" size="lg"  />
                    <Text marginTop={4} fontSize={16}>Proccessing request...</Text>
                </Box> :
                null
            }
            <HStack w="100%" justifyContent="space-between" >
                <Button onPress={() => navigation.goBack()}borderRadius={25} marginBottom={2} w={90}>Go back</Button>
                { userData.info.id === data.user.id ?
                    <Button onPress={removeEventManager} borderRadius={25} marginBottom={2} w={90} bg="red.400" >Delete</Button>
                    : null
                }
            </HStack>
            <Heading py={2} marginTop={2} fontSize="2xl">
                {data.title} 
            </Heading>
            <HStack w="100%" justifyContent="space-between">
                <Text ml={4} fontSize="md" color="gray.500" >Mr {data.user.first_name+' '+data.user.last_name}</Text>
                <Badge borderRadius={25} colorScheme="seccess" >{data.department.libelle}</Badge>
            </HStack>
            <Text fontSize="md" marginTop={3} pt="3" mb={2}>
                {data.body.description}
            </Text>
            <Text pt="3" mb={2}>
                <Text fontSize="xl" fontWeight="bold" mb="4" >Location : </Text>
                <Text fontSize="lg"  mb="4" >{data.body.location}</Text>
            </Text>
            <Text fontSize="xl" fontWeight="bold" mb="4" >Date :</Text>
            <HStack style={{display: 'flex', alignItems:'center', justifyContent: 'center'}}>
                <Text color="warmGray.50" p="2.5" borderRadius="full" bg="coolGray.800" fontSize="md"  mb={2}>
                    {data.start.toDateString()}
                </Text>
                <Divider w="20"  />
                <Text color="warmGray.50" p="2.5" borderRadius="full" bg="coolGray.800" fontSize="md"  mb={2}>
                    {data.end.toDateString()}
                </Text>
            </HStack>
       </Box> 
    )
}




export default EventDetails;