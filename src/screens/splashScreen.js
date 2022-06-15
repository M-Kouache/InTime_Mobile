import React from 'react';
import { Box, Center, ZStack, Container, Text, Image, PresenceTransition }from 'native-base'

const SplashScreen = ()=>{
    return(
        <Center height={900} >
            <PresenceTransition visible={true} initial={{
                opacity: 0
                }} animate={{
                opacity: 1,
                transition: {
                    duration: 2000
                }
                }}>
                <Image source={require('../assets/CCIS.png')} alt="Alternate Text" size={350} />
            </PresenceTransition>
        </Center>
        )
}


export default SplashScreen;