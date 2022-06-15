import axios from 'axios'


const base_url = 'https://in-time-v1.herokuapp.com'


export const LogUser = async (data)=> {
    
    const response = await axios.post(base_url+'/auth/jwt/create/',
    {
        username:data.name,
        password:data.password
    })

    return response 
}


export const getCurrentUser = async (token)=>{
    const response = await axios({
        method: 'get',
        url:base_url+'/auth/me/',
        headers: {'Authorization':'JWT '+token},
    })
    return response
}


