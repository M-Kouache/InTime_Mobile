import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { React, useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, Center} from 'native-base'
import { UserContext } from './src/utils/contextProvider'
import { getCurrentUser } from './src/utils/userLogin'
import { getUser } from './src/utils/localStorage'
import SplashScreen from './src/screens/splashScreen';
import StackNav from './src/navigation/stack';
import { getEvents } from './src/utils/eventManager'


import Home from './src/screens/home'

export default function App() {

  const [user, setUser] = useState(null)

  const [userData, setUserData] = useState(null)

  const [eventData, setEventData] = useState(null)

  const [forceToRun, setForceToRun] = useState(false)

  const [authorized, setAuthorized] = useState(true)

  //state to redirect from splash screen to home screen after a timeout seted by setTimout 
  const [Loaded, setLoaded] = useState(false)
  
  useEffect(()=>{
    if(user === null){
      getUser().then(user => {

        if( user === null){ 
          setLoaded(true)
          setAuthorized(false)
        }
        
        if (user != null ) setUser(user)
        
      })
    }
  },[user])

  useEffect(() => {
    if(user != null ){
      currentUser() 
    }
  },[forceToRun,user])

  useEffect(() => {
    getUserEvents()
  },[userData])


  const getUserEvents = async ()=> {

    try {
      if (userData != null){
        const response = await getEvents(user.access,userData.department.id) 
        if (response.status === 200) {
          setEventData(response.data.events)
        }
        
        if (response.status === 401){
        setLoaded(true)
        setAuthorized(false)
        }
      
      }
      
    } catch (error) {
      
      if ( error.response.status === 401 || error.request.status === 401 ){
        setLoaded(true)
        setAuthorized(false)
      }

    }

  }


  const currentUser = async () => {

    try{

      const response = await getCurrentUser(user.access)
      if(response.status === 200){
        setLoaded(true)
        setUserData(response.data.user)
      }
      
      if (response.status === 401){
        setLoaded(true)
        setAuthorized(false)
      }
      
    }catch (error) {

      if ( error.response.status === 401 || error.request.status === 401 ){
        setLoaded(true)
        setAuthorized(false)
      }
      
   }

  }


  return (
    
    <NativeBaseProvider>
      <UserContext.Provider value={{user,setUser,userData, setUserData,eventData,forceToRun,setForceToRun,authorized,setAuthorized}}>
        {
          Loaded ? 
          <NavigationContainer>
            <StackNav/>
          </NavigationContainer> :
          <SplashScreen /> 
        }
      </UserContext.Provider>
    </NativeBaseProvider>

  );
}

