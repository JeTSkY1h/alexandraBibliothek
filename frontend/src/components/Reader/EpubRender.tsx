import { useParams } from "react-router-dom"
import { getBookPath, getBookfile } from "../../lib/api/books"
import { useEffect, useState } from "react"
import Reader from "./Reader"
import { Spinner } from "@chakra-ui/react"

const EpupRender = () => {
    
    const {id} = useParams()
    const [path, setPath] = useState<ArrayBuffer>()

    useEffect(() => {
        
        if(!id) return
        
        getBookPath(id).then((data)=>{
            getBookfile(data).then((res)=>{
                console.log(res)
                setPath(res)
            });
        })
        
    }, [id])

    
    return (
        <>
            {path ?
                <Reader epubUrl={path}/> 
            : <Spinner/>}
        </>
    )
}

export default EpupRender