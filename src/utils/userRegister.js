import axios from 'axios';
import jwt_decode from 'jwt-decode';


const base_url = 'https://in-time-v1.herokuapp.com'

export const RegisterUser = async (data)=> {
    
    const response = await axios.post(base_url+'/auth/users/',
    
    {
        username:data.username,
        first_name:data.first_name,
        last_name:data.last_name,
        email:data.email,
        password:data.password 
    })

    return response 
}


export const RegisterUserProfile = async (data,token) => {
    let token_decoded = jwt_decode(token)
    const response = await axios({
        method: 'post',
        url:base_url+'/auth/user_profile/',
        headers: {'Authorization':'JWT '+token},
        data:{
            service:data.service,
            user:token_decoded.user_id
        }
    })
    return response
}

export const PutUserProfile = async (data,token) => {
    let token_decoded = jwt_decode(token)
    const response = await axios({
        method: 'put',
        url:base_url+'/auth/user_profile/',
        headers: {'Authorization':'JWT '+token},
        data:{
            service:data.service,
            user:token_decoded.user_id
        }
    })
    return response
}

export const getUserService = async (token)=>{
    const response = await axios({
        method: 'get',
        url:base_url+'/auth/get_services/',
        headers: {'Authorization':'JWT '+token},
    })
    return response
}



