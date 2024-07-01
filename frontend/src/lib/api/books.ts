import axios from "axios"
import { baseUrl } from "./url"

const token = localStorage.getItem("token");

export const updateBook = async (book:any) => {
    return axios.post(`${baseUrl}/books`, book, {headers: {
        Authorization: `Bearer ${token}`
    }}).then((res)=>{
        return res.data
    });
}

export const getBook = async (id:string) => {
    return axios.get(`${baseUrl}/books/${id}`, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        return res.data
    });
}

export const searchBooks = async (limit:number, offset:number, search:string) => {
    const limitStr = limit ? "?limit=" + limit : "";
    const offsetStr = offset ? "&offset="+offset : "";
    return axios.get(`${baseUrl}/books/search/${search}` + limitStr + offsetStr, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        return res.data
    });
}

export const getBooks = async (limit?:number, offset?:number, ) => {
    const limitStr = limit ? "?limit=" + limit : "";
    const offsetStr = offset ? "&offset="+offset : "";
    
    return axios.get(`${baseUrl}/books` + limitStr + offsetStr, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        return res.data
    });
}

export const getBookPath = async (id:string) => {
    return axios.get(`${baseUrl}/books/path/${id}`).then((res)=>{
        return res.data
    });
}

export const getBookfile = async (filePath:string) => {
    return axios.get(`${baseUrl}/book/${filePath}`,  {responseType: "blob", headers: {Authorization: `Bearer ${token}`}})
        .then((res)=>{
            return res.data
        });
}