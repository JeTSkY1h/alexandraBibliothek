import { useCallback, useEffect, useState } from "react";
import { openBook, updateLocation } from "../lib/api/userBook";
import { IUserBookDTO } from "../lib/types/UserBook";

export const useUserBookLoader = (bookId:string) => {
    console.log("useBookLoader called with id : ", bookId);
    const [userBookObj, setUserBookObj] = useState<IUserBookDTO>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isOpened, setIsOpened] = useState<boolean>(false);

    useEffect(()=> {
        if(!bookId || isLoading || isOpened) {
            console.log("Returning early");
            console.log("BookId: ", bookId);
            console.log("isOpened: ", isOpened);
            console.log("isLoading: ", isLoading);
            return
        }
        setIsLoading(true);
        openBook(bookId).then((data:any)=>{
            console.log("Opening book: ", data);
            setUserBookObj(data);
        }).catch((e)=>{
            setIsError(true);
            console.log(e);
        }).finally(()=>{
            setIsOpened(true)
            setIsLoading(false);
        });
    }, [])

    return {userBookObj, isLoading, isError}

}

export const useUserBookUtils = (bookID:string) => {
    const [location, setLocation] = useState<string>("0");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);


    const handleLocationUpdate = useCallback(() => {
        if(!location) return;
        if(isLoading) return;
        setIsLoading(true);
        updateLocation(location, bookID).then(()=>{
            setIsLoading(false);
        }).catch((e)=>{
            setIsError(true);
            setIsLoading(false);
            console.log(e);
        })
    }, [location]);

    useEffect(()=>{
        handleLocationUpdate();
    }, [location])

    return {setLocation, isLoading, isError}
}