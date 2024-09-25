import axios from "axios";
import { User, jwtDTO } from "../types/User";
import { baseUrl } from "./url";



export const register = (user: User) => {
    return axios.post(`${baseUrl}/user`, user).then((res)=>{
        return res.data
    })

}

export const login = (email: string, password: string):Promise<jwtDTO> => {
        return axios.post(`${baseUrl}/login/`, {email:email, password:password}).then((res)=>{
        return res.data
    })
}
