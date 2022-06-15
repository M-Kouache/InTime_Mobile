import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeUser = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('token_id', jsonValue)
  } catch (e) {
    return false
  }
  return true 
}


export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('token_id')
    if(jsonValue !== null) {
      return jsonValue != null ? JSON.parse(jsonValue) : null
    }
    return null
    } catch(e) {
      return null
    }
}


