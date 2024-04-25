import { useCallback, useEffect, useState } from "react";
import { openBook, updateLocation } from "../lib/api/userBook";
import { IUserBookDTO } from "../lib/types/UserBook";

export const useUserBookLoader = (bookId:string) => {
    const [userBookObj, setUserBookObj] = useState<IUserBookDTO>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const openBookHandler = useCallback(async () => {
        if(!bookId) return;
        if(isLoading) return;
        setIsLoading(true);
        openBook(bookId).then((data)=>{
            console.log(data);
            setUserBookObj(data);
        }).catch((e)=>{
            setIsError(true);
            console.log(e);
        }).finally(()=>{
            setIsLoading(false);
        });
    }, [bookId, isLoading]);

    useEffect(()=> {
        openBookHandler();
    }, [bookId])

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
        console.log(location, bookID);
        updateLocation(location, bookID).then((data)=>{
            setIsLoading(false);
            console.log(data);
        
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