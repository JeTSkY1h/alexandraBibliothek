import { useCallback, useEffect, useState } from "react";
import { openBook } from "../lib/api/userBook";
import { IUserBookDTO } from "../lib/types/UserBook";

export const useUserBookUtils = (bookId:string) => {
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