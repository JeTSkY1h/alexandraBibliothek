import { useParams } from "react-router-dom"
import { getBookPath, getBookfile } from "../../lib/api/books"
import { useEffect, useState } from "react"
import Reader from "./Reader"
import { Spinner } from "@chakra-ui/react"
import { useUserBookUtils } from "../../hooks/UserBookUtils"

const EpupRender = () => {
    
    const {id} = useParams()
    const {userBookObj, isLoading, isError} = useUserBookUtils(id || "");
    const [epubUrl, setEpubUrl] = useState<string | ArrayBuffer | null>(null);

    useEffect(()=>{
        if(!userBookObj?.path) return;
        getBookfile(userBookObj.path).then((data)=>{
            console.log(data);
            setEpubUrl(data);
        }).catch((e)=>{
            console.log(e);
        })
    })

    return (
        <>
        {isLoading && <Spinner />}
        {isError && <p>Error</p>}
        {epubUrl && <Reader epubUrl={epubUrl} />}
        </>
    )
}

export default EpupRender