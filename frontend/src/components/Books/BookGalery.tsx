import { Box, Flex, Spinner } from "@chakra-ui/react";
import BookCard from "./BookCard";
import { Book } from "../../lib/types/Book";

interface BookGaleryProps {
    books: Array<Book>
    loading: boolean
    error: boolean
}

export const BookGalery = ({books, loading, error}:BookGaleryProps) => {


    return (
        <>
            {loading && <Spinner/>}
            {error && <Box color={"red.400"}></Box>}
            <Flex p={6} gap={6} flexWrap={"wrap"} justifyContent={"center"}>
                {books.map((book, i) => 
                    <BookCard key={i} book={book} />
                )}
            </Flex>
        </>
    )
}

export default BookGalery