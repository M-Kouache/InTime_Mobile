import axios from "axios"
import jwt_decode from 'jwt-decode'
const base_url = 'https://in-time-v1.herokuapp.com'


export const getUsers = async (token)=>{

    const response = await axios({
        method: 'get',
        url:base_url+'/auth/users/',
        headers: {'Authorization':'JWT '+token},
    })

    return response
}


export const addHandler = async (data,token)=> {

    let token_decoded = jwt_decode(token)
    
    const response = await axios({
        method: 'post',
        url:base_url+'/auth/add_handler/',
        headers: {'Authorization':'JWT '+token},
        data:{
            owner:token_decoded.user_id,
            user_handler:data.handler
        }
    })

    return response

}


export const removeHandler = async (data,token)=> {

    const response = await axios({
        method: 'post',
        url:base_url+'/auth/remove_handler/',
        headers: {'Authorization':'JWT '+token},
        data:{
            user_handler:data
        }
    })

    return response

}
