import { Box, FormControl, FormLabel, Heading, Input } from "@chakra-ui/react"
import { Navbar } from "../components/Nav/Navbar"
import { useBookLoader } from "../hooks/BookUtils"
import { Form, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const EditBook = () => {
    const {id} = useParams();
    const {book, loading, error} = useBookLoader(id||"");

    const [title, setTitle] = useState(book?.title);
    const [author, setAuthor] = useState(book?.author);
    const [cover, setCover] = useState(book?.cover);
    const [pupDate, setPubDate] = useState(book?.pubdate);
    const [isbn, setIsbn] = useState(book?.isbn);
    //const [tags, setTags] = useState(book.);
    //const [category, setCategory] = useState(book.);

    useEffect(() => {
        console.log(book);
    }, [id, book])
    
    return (
        <>
            <Navbar/>
            <Box>
                <Heading>Edit Book</Heading>
                <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input value={title} onChange={(e)=>setTitle(e.target.value)} mb={"4"}/>

                    <FormLabel>Author</FormLabel>
                    <Input value={author} onChange={(e)=>{setAuthor(e.target.value)}} mb={"4"}/>

                    <FormLabel>ISBN</FormLabel>
                    <Input value={author} onChange={(e)=>{setAuthor(e.target.value)}} mb={"4"}/>

                </FormControl>
            </Box>
        </>
    )
}

export default EditBook