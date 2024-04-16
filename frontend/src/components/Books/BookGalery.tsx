import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useBookLoader } from "../../hooks/BookUtils";
import BookCard from "./BookCard";

export const BookGalery = () => {
    const {books, error, loading, setLimit, setOffset, limit} = useBookLoader();

    return (
        <>
            {loading && <Spinner/>}
            {error && <Box color={"red.400"}></Box>}
            <Flex flexWrap={"wrap"} justifyContent={"center"}>
                {books.map((book, i) => 
                    <BookCard key={i} book={book} />
                )}
            </Flex>
        </>
    )
}

export default BookGalery