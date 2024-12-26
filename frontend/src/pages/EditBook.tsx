import { Box, Button, FormControl, FormLabel, Heading, Input, Spinner } from "@chakra-ui/react"
import { Navbar } from "../components/Nav/Navbar"
import { useBookLoader, useBookUpdater } from "../hooks/BookUtils"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"




const EditBook = () => {
    const {id} = useParams();
    const {book} = useBookLoader(id||"");
    const {update, error: updateError, loading: updateLoading} = useBookUpdater();

    const [title, setTitle] = useState(book?.title);
    const [author, setAuthor] = useState(book?.author);
    const [cover, setCover] = useState(book?.cover);
    const [pupDate, setPubDate] = useState(book?.pubdate);
    const [isbn, setIsbn] = useState(book?.isbn);
    //const [tags, setTags] = useState(book.);
    //const [category, setCategory] = useState(book.);

    const updateBook = () => {
        
        if(!book) return;
        const newBook = {
            _id: book._id,
            title: title || book.title,
            cover: cover || book.cover,
            isbn: isbn || book.isbn,
            path: book.path,
            pubdate: pupDate || book.pubdate,
            author: author || book.author,
        }

        update(newBook);
    }


    useEffect(() => {
        if(!book) return;
        console.log(book)
        setTitle(book?.title);
        setAuthor(book?.author);
        setCover(book?.cover);
        setPubDate(book?.pubdate);
        setIsbn(book?.isbn);
    }, [id, book])
    
    return (
        <>
            <Navbar/>
            <Box padding={8} maxWidth={"960px"} margin={"auto"}>

                <Heading>Edit Book</Heading>
                <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input value={title} onChange={(e)=>setTitle(e.target.value)} mb={"4"}/>

                    <FormLabel>Author</FormLabel>
                    <Input value={author} onChange={(e)=>{setAuthor(e.target.value)}} mb={"4"}/>

                    <FormLabel>ISBN</FormLabel>
                    <Input value={isbn} onChange={(e)=>{setIsbn(e.target.value)}} mb={"4"}/>

                </FormControl>

                <Button colorScheme={updateError ? "red" :"green"} onClick={updateBook}>{updateLoading ? <Spinner/> : "Update"}</Button>
            </Box>
        </>
    )
}

export default EditBook