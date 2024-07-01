import { Box, Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import BookCard from "./BookCard";
import { Book } from "../../lib/types/Book";
import { useParams, useSearchParams } from "react-router-dom";

interface BookGaleryProps {
    title: string
    books: Array<Book>
    loading: boolean
    error: boolean
}

export const BookGalery = ({title, books, loading, error}:BookGaleryProps) => {
        
    return (
        <>
                {error && <Box color={"red.400"}><Center>Es Gab einen fehler beim Laden  der Bücher </Center></Box>}
                {loading && <Center><Spinner/></Center>}
                <Heading textAlign={"center"} size={"lg"}>{title}</Heading>
                <Flex mb={6} gap={6} flexWrap={"wrap"} justifyContent={"center"}>
                    {books.map((book, i) => 
                        <BookCard key={i} book={book} />
                    )}
                </Flex>
        
        </>
    )
}

export default BookGalery