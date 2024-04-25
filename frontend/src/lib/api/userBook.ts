import axios from "axios";
import { baseUrl } from "./url"

const token = localStorage.getItem("token");

export const openBook = async (bookId: string) => {
    return axios.post(`${baseUrl}/user-books`, {bookId}, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        console.log(res);
        return res.data
    });
}

export const updateLocation = async (location:string, bookId:string) => {
    return axios.post(`${baseUrl}/user-books/location`, {location, bookId}, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        console.log(res);
        return res.data
    });
}