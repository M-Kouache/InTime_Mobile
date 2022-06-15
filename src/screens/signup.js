import { useState, useEffect, useContext} from 'react'
import { Center, ScrollView, Spinner, Heading, Input, Box, Text, VStack, FormControl, Button, Link, HStack} from 'native-base'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { catchError } from '../utils/errorHandling'
import { RegisterUser } from '../utils/userRegister';
import { LogUser } from '../utils/userLogin'
import { storeUser, getUser} from '../utils/localStorage'

const Signup = () => {

    const navigation = useNavigation()

    const [form, setForm] = useState({})

    const [errors, setErrors] = useState({});

    const [httpStatus, setStatus] = useState('')

    const [Loading,setLoading] = useState(false)

    const validate = () => {
      if (form.username === undefined) {
        setErrors({ ...errors,
          name: 'this field is required'
        });
        return false;
      }
      return true;
    };

    const register = async () => {

      if (validate()){
        setLoading(true);
        try {
          const response = await RegisterUser(form)
          if (response.status === 201) {
            const logres = await LogUser({name:form.username,password:form.password})
            if (logres.status === 200) {
              storeUser(logres.data).then( value =>{
                if (value != null ) navigation.replace('SetService')
              } )   
            }
          }
        } catch (error) {
          setLoading(false)
          setStatus(catchError(error))
        }
      }
    }

  return (<>
  {Loading ? <Center flex={1}><Spinner color="indigo.500" size="lg" /></Center> :  
  <ScrollView>
    <Center flex={1} w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading size="lg" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }} fontWeight="semibold">
          Welcome
        </Heading>
        <Heading mt="1" color="coolGray.600" _dark={{
        color: "warmGray.200"
      }} fontWeight="medium" size="xs">
          Sign up to continue!
        </Heading>
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>UserName</FormControl.Label>
            <Input name="username" type="text" required={true} placeholder="your username" onChangeText={value => setForm({...form,
              username: value
            }) }/>
            <Text color="red.400">{errors.name}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>First Name</FormControl.Label>
            <Input name="first_name" type="text" required={true} placeholder="your firsname" onChangeText={value => setForm({...form,
              first_name: value
            })}/>
            <Text color="red.400">{errors.name}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input name="last_name" type="text" required={true} placeholder="your lastname" onChangeText={value => setForm({...form,
              last_name: value
            })}/>
            <Text color="red.400">{errors.name}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input name="email" type="text" required={true} placeholder="email@gmail.com" onChangeText={value => setForm({...form,
              email: value
            })}/>
            <Text color="red.400">{errors.name}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input name="password" type="password" required={true} placeholder="password" onChangeText={value => setForm({...form,
              password: value
            })}/>
            <Text color="red.400">{errors.name}</Text>
          </FormControl>
          <Button onPress={register} mt="2" colorScheme="indigo">
            Sign up
          </Button>
          <Text color="red.400">{httpStatus}</Text>
        </VStack>
      </Box>
    </Center>
    </ScrollView>}
    </>)

};

export default Signup;