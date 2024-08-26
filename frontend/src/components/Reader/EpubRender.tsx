import { useParams } from "react-router-dom"
import { getBookfile } from "../../lib/api/books"
import { useEffect, useMemo, useState } from "react"
import Reader from "./Reader"
import { Center, Spinner } from "@chakra-ui/react"
import { useUserBookLoader } from "../../hooks/UserBookUtils"

const EpupRender = () => {
    
    const {id: rawId} = useParams()
    const id = useMemo(()=>rawId, [rawId])
    const {userBookObj, isLoading, isError} = useUserBookLoader(id || "");
    const [epubUrl, setEpubUrl] = useState<string | ArrayBuffer | null>(null);

    useEffect(()=>{
        if(!userBookObj?.path) return;
        getBookfile(userBookObj.path).then((data)=>{
            setEpubUrl(data);
        }).catch((e)=>{
            console.log(e);
        })
    }, [userBookObj])

    return (
        <>
        {isLoading && <Center><Spinner /></Center>}
        {isError && <p>Error</p>}
        {epubUrl && <Reader epubUrl={epubUrl} bookID={id||""} location={userBookObj?.location}/>}
        </>
    )
}

export default EpupRender