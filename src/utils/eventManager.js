import axios from "axios"
const base_url = 'https://in-time-v1.herokuapp.com'



export const getEvents = async (token,department)=>{

    const response = await axios({
        method: 'get',
        url:base_url+'/auth/events/'+department,
        headers: {'Authorization':'JWT '+token},
    })
    return response
}

const checkEventVisbility = (visibilty)=>{

    if(visibilty){
        return {department: null, evt_public:true}
    }

    if(!visibilty){
        return {department: null, evt_public:false}
    }

    if(Number.isInteger(visibilty)){
        return {department:visibilty, evt_public:false}
    }

}

export const addEvent = async (data,token)=> {
   
    const visibiltyObjects = checkEventVisbility(data.visibilty)

    if( visibiltyObjects.evt_public != null ){
        
        const response = await axios({
            method: 'post',
            url:base_url+'/auth/add_event/',
            headers: {'Authorization':'JWT '+token},
            data:{
                date_start:data.date_start,
                date_end:data.date_end,
                public_events:visibiltyObjects.evt_public,
                departement:visibiltyObjects.department,
                title:data.title,
                description:data.description,
                location:data.location,
                actor:data.actor
            }
        })

        return response
       
    }
}


export const removeEvent = async (id,token)=> {

    const response = await axios({
        method: 'post',
        url:base_url+'/auth/remove_event/',
        headers: {'Authorization':'JWT '+token},
        data:{
            event:id
        }
    })

    return response

}
