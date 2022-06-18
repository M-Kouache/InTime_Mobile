import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../utils/contextProvider'
import { Center, Box, Heading,  VStack, FormControl, Spinner, Input, Button, Link, HStack, Text, } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { catchError } from '../utils/errorHandling'
import { LogUser } from '../utils/userLogin'
import { storeUser, getUser } from '../utils/localStorage'

const Login = () => {
    
    const {setUser, setAuthorized} = useContext(UserContext)

    const navigation = useNavigation()

    const [isLoading, setLoading] = useState(false)

    const [form, setForm] = useState({})

    const [errors, setErrors] = useState({});

    const [httpStatus, setStatus] = useState('')

    const validate = () => {
      if (form.name === undefined) {
        setErrors({ ...errors,
          name: 'this field is required'
        });
        return false;
      }
      return true;
    };
   
    const Login = async () =>{
      if (validate()){
        try{
          setLoading(true)
          const response = await LogUser(form)
          await storeUser(response.data)   
          getUser().then(user =>{
            setUser(user)
            if(user != null){ 
              setAuthorized(true)
              setLoading(false)
              navigation.replace('DrawerNav')
            }
          })
        }catch(error){
          setLoading(false)
          setStatus(catchError(error))
        }
      }
    }

    return <Center h="100%" w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Welcome
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input name="username" type="text" onChangeText={ value => setForm({ ...form,
                 name:value
            })}/>
            <Text color="red.400">{errors.name}</Text>
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input name="password" type="password" onChangeText={ value => setForm({ ...form,
                 password:value
            })}/>
            <Text color="red.400">{errors.name}</Text>
          </FormControl>
          <Button onPress={Login}  mt="2" colorScheme="indigo">
            <HStack>
              <Text color="white">Sign in  </Text>
              {isLoading ? <Spinner color="emerald.500" />: <Text></Text>}
            </HStack>
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
              I'm a new user.{" "}
            </Text>
            <Text onPress={()=> navigation.navigate('Signup')} underline 
             style={{ color: "green" }}
             fontSize="md"
            >
              Sign Up
            </Text>
          </HStack>
          <Text color="red.400" style={{ textAlign: "center" }}>{httpStatus}</Text>
        </VStack>
      </Box>
    </Center>;

};

export default Login;

