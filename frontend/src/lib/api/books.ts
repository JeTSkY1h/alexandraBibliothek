import axios from "axios"
import { baseUrl } from "./url"


export const getBooks = async (limit?:number, offset?:number) => {
    const limitStr = limit ? "?limit=" + limit : "";
    const offsetStr = offset ? "&offset="+offset : "";

    
    return axios.get(`${baseUrl}/books` + limitStr + offsetStr).then((res)=>{
        return res.data
    });
}

export const getBookPath = async (id:string) => {
    return axios.get(`${baseUrl}/books/path/${id}`).then((res)=>{
        return res.data
    });
}

export const getBookfile = async (filePath:string) => {
    return axios.get(`${baseUrl}/book/${filePath}`,  {responseType: "blob", headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}})
        .then((res)=>{
            return res.data
        });
}