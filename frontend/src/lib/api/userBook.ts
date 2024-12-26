import axios from "axios";
import { baseUrl } from "./url"

const token = localStorage.getItem("token");

export const openBook = async (bookId: string) => {
    return axios.post(`${baseUrl}/user-books`, {bookId}, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        console.log(res);
        return res.data
    });
}

export const updateLocation = async (bookId:string, chapter:number, lastReadBlock:number) => {
    return axios.post(`${baseUrl}/user-books/location`, {chapter, lastReadBlock, bookId}, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        console.log(res);
        return res.data
    });
}

export const lastReadBooks = async (limit:number, offset:number) => {
    return axios.get(`${baseUrl}/user-books/last-read?limit=${limit}&offset=${offset}`, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        console.log(res);
        return res.data
    });
}

export const updateRating = async (rating:number, bookId:string) => {
    return axios.post(`${baseUrl}/user-books/rating`, {rating, bookId}, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        console.log(res);
        return res.data
    });
}

export const getRating = async (bookId:string) => {
    return axios.get(`${baseUrl}/user-books/rating?bookId=${bookId}`, {headers: {Authorization: `Bearer ${token}`}}).then((res)=>{
        console.log(res);
        return res.data
    });
}

