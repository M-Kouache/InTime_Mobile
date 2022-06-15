import { useNavigation } from '@react-navigation/native'
import { Box, Text, Button } from "native-base"
import { SafeAreaView } from "react-native"
import WebView from "react-native-webview"

const AdminPanel = ()=>{

    const navigation = useNavigation()

    return (
      <Box style={{ flex: 1,padding: 2 }}>
        <WebView 
          source={{ uri: 'https://in-time-v1.herokuapp.com/admin/login/?next=/admin/' }} 
        />
        <Button onPress={()=> navigation.replace('DrawerNav')}>Back to Home</Button>
      </Box> 
    )
}

export default AdminPanel;