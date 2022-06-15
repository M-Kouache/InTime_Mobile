import jwt_decode from "jwt-decode";


export const JwtDecode = (token)=>{

    return decoded = jwt_decode(token);

}



