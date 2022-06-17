import React from 'react'
import { MaterialCommunityIcons, MaterialIcons, AntDesign  } from '@expo/vector-icons'
import { useDisclose, Box, Stagger, Center, IconButton, HStack, Icon } from 'native-base'
import { Alert } from 'react-native'

export default function StaggerComponent({calendar_mode}) {
 
    const {
     isOpen,
     onToggle
    } = useDisclose();
 

    return (
    <Box position="absolute" right={4} bottom={4}>
      <Box alignItems="center" minH="220">
        <Stagger visible={isOpen} initial={{
                opacity: 0,
                scale: 0,
                translateY:34,
            }} animate={{
                translateY: 0,
                scale: 1,
                opacity: 1,
                transition: {
                type: "spring",
                mass: 0.8,
                stagger: {
                    offset: 30,
                    reverse: true
                }
                }
            }} exit={{
                translateY: 34,
                scale: 0.5,
                opacity: 0,
                transition: {
                duration: 100,
                stagger: {
                    offset: 30,
                    reverse: true
                }
            }
      }}>
          <IconButton onPress={()=> calendar_mode("month")} mb="4" variant="solid" bg="indigo.500" colorScheme="indigo" borderRadius="full" icon={<Icon as={AntDesign} size="6" name="calendar" _dark={{
          color: "warmGray.50"
        }} color="warmGray.50" />} />
          <IconButton  onPress={()=> calendar_mode("week")} mb="4" variant="solid" bg="yellow.400" colorScheme="yellow" borderRadius="full" icon={<Icon as={MaterialCommunityIcons} _dark={{
          color: "warmGray.50"
        }} size="6" name="calendar-week-begin" color="warmGray.50" />} />
          <IconButton onPress={()=> calendar_mode("3days")} mb="4" variant="solid" bg="teal.400" colorScheme="teal" borderRadius="full" icon={<Icon as={MaterialIcons} _dark={{
          color: "warmGray.50"
        }} size="6" name="view-week" color="warmGray.50" />} />
          <IconButton onPress={()=> calendar_mode("day")} mb="4" variant="solid" bg="red.500" colorScheme="red" borderRadius="full" icon={<Icon as={MaterialCommunityIcons} size="6" name="view-day-outline" _dark={{
          color: "warmGray.50"
        }} color="warmGray.50" />} />
        </Stagger>
      </Box>
      <HStack alignItems="center">
        <IconButton variant="solid" borderRadius="full" size="lg" onPress={onToggle} bg="cyan.400" icon={<Icon as={MaterialCommunityIcons} size="6" name="dots-horizontal" color="warmGray.50" _dark={{
        color: "warmGray.50"
      }} />} />
      </HStack>
    </Box>
    )
}
