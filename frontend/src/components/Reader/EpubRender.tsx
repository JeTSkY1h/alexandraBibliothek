import { useParams } from "react-router-dom"
import { getBookfile } from "../../lib/api/books"
import { useEffect, useState } from "react"
import Reader from "./Reader"
import { Spinner } from "@chakra-ui/react"
import { useUserBookLoader } from "../../hooks/UserBookUtils"

const EpupRender = () => {
    
    const {id} = useParams()
    const {userBookObj, isLoading, isError} = useUserBookLoader(id || "");
    const [epubUrl, setEpubUrl] = useState<string | ArrayBuffer | null>(null);

    useEffect(()=>{
        if(!userBookObj?.path) return;
        console.log(userBookObj)
        getBookfile(userBookObj.path).then((data)=>{
            setEpubUrl(data);
        }).catch((e)=>{
            console.log(e);
        })
    }, [userBookObj])

    return (
        <>
        {isLoading && <Spinner />}
        {isError && <p>Error</p>}
        {epubUrl && <Reader epubUrl={epubUrl} bookID={id||""} location={userBookObj?.location}/>}
        </>
    )
}

export default EpupRender