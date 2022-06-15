
export const catchError = (error) => {

    if (error.response) {
        const res_status = error.response.status
        if(res_status === 401){
            return 'Your acount may be blocked by the administrator, contact them.'
        }
        if(res_status === 400){
            return 'there may be a problem with information you provided. check and try again.'
        }

        return 'Something went wrong'
    } 
 
    if (error.request) {
  
        const req_status = error.request.status
        if(req_status === 401){
            return 'Your acount may be blocked by the administrator, contact them.'
        }
        if(req_status === 400){
            return 'there may be a problem with information you provided. check yours password and try again.'
        }
        
        return 'Something went wrong'

    } 

    // Something happened in setting up the request that triggered an Error
    return 'Error :'+error.message
    
}
