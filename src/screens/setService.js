import { useState, useEffect, useContext} from 'react'
import { Center, Spinner, Heading, Input, Box, Text, VStack, Select, CheckIcon, FormControl, Button, Link, HStack} from 'native-base'
import { UserContext } from '../utils/contextProvider'
import { useNavigation } from '@react-navigation/native'
import { RegisterUserProfile, PutUserProfile, getUserService } from '../utils/userRegister';
import { setUser, getUser} from '../utils/localStorage'


const SetService = ({navigation}) => {

    const {user, setUser} = useContext(UserContext)

    const [Loading,setLoading] = useState(true)

    const [form, setForm] = useState({})

    const [errors, setErrors] = useState({});

    const [selecteValue, setSelecteValue] = useState({})

    useEffect(() => {
        if (user === null){getUser().then(usr => {
            setUser(usr)
        })}
        if(user != null) getServices()
    },[user])

    const validate = () => {
      if (form.service === undefined) {
        setErrors({ ...errors,
          name: 'this field is required'
        });
        return false;
      }
      return true;
    };

    const getServices = () => {
        try {
            if (user != null) {
                getUserService(user.access).then((response) => {
                    setSelecteValue(response.data)
                    PutUserProfile(form,user.access).then(() => {
                        setLoading(false)
                    })
                })
            }
        } catch (error) {
            console.log(error)
        }
        return
    }

    const registerUserProfile = async () => {
      if (validate()){
          setLoading(true)
        try {
            if (user != null){
                const response = await PutUserProfile(form,user.access)
                setLoading(false)
                if (response.status === 200) navigation.replace('DrawerNav')
            }
        } catch (error) {
            console.log(error)
        }
        return
      }
    }

    return (
        <>
            {Loading ? <Center flex={1}><Spinner color="indigo.500" size="lg" /></Center> :  
            
            <Center flex={1} w="100%">
                <Box safeArea p="2" w="90%" maxW="290" py="8">
                    <Heading size="lg" color="coolGray.800" _dark={{
                    color: "warmGray.50"
                }} fontWeight="semibold">
                    Service
                    </Heading>
                    <Heading mt="1" color="coolGray.600" _dark={{
                    color: "warmGray.200"
                }} fontWeight="medium" size="xs">
                    One more step and you'r set
                    </Heading>
                    <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Service your are doing</FormControl.Label>
                            <Select selectedValue={form.id} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setForm({service:itemValue})}>
                                { selecteValue.map(item => <Select.Item label={item.libelle} key={item.id} value={item.id} />) }
                            </Select> 
                        <Text color="red.400">{errors.name}</Text>
                    </FormControl>
                    <Button onPress={registerUserProfile}>Finish</Button>
                </VStack>
                </Box>
            </Center>
            }
        </>
    )

};



export default SetService;