import { useCallback, useEffect, useRef, useState } from "react";
import { getRating, lastReadBooks, openBook, updateLocation, updateRating } from "../lib/api/userBook";
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

export const useUserBookUtils = (bookID:string, initialChapter:number ) => {
    const [chapter, setChapter] = useState<number>(initialChapter);
    const [lastReadBlock, setLastReadBlock] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const handleLocationUpdate = useCallback(() => {
        if(chapter === undefined || lastReadBlock === undefined) return;
        if(isLoading) return;
        setIsLoading(true);
        updateLocation(bookID, chapter, lastReadBlock).then(()=>{
            setIsLoading(false);
        }).catch((e)=>{
            setIsError(true);
            setIsLoading(false);
            console.log(e);
        })
    }, [lastReadBlock, chapter]);

    useEffect(()=>{
        handleLocationUpdate();
    }, [chapter, lastReadBlock])

    return {isLoading, isError, handleLocationUpdate, setChapter, setLastReadBlock}
}

export const useRatingUtils = (bookID:string) => {
    const [rating, setRating] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(()=>{
        console.log("Getting rating for book: ", bookID);
        getRating(bookID).then((data)=>{
            console.log("Rating data: ", data);
            setRating(data.avgRating);
        }).catch((e)=>{
            setIsError(true);
            console.log(e);
        })
    },[])

    const handleRatingUpdate = useCallback(() => {
        if(!rating) return;
        if(isLoading) return;
        setIsLoading(true);
        updateRating(rating, bookID).then(()=>{
            setIsLoading(false);
        }).catch((e)=>{
            setIsError(true);
            setIsLoading(false);
            console.log(e);
        })
    }, [rating]);



    useEffect(()=>{
        handleRatingUpdate();
    }, [rating])

    return {rating, setRating, isLoading, isError}
}