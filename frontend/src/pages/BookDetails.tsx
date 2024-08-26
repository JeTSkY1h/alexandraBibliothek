import { useParams } from "react-router-dom";
import { getCoverPath, useBookLoader } from "../hooks/BookUtils";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom"
import { Navbar } from "../components/Nav/Navbar";


const BookDetails = () => {
    const { id } = useParams<{ id: string }>();
    const {book, isLoading, error} = useBookLoader(id||""); 

    
    return (
        <>
        <Navbar />
        <Flex justifyContent={"center"} alignItems={"center"}>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error</p>}
            {book && (
                <Flex flexDir={"row"} max-width="960px" >
                    <Box>
                    <img src={getCoverPath(book)} alt={book.title} />
                    </Box>
                    <Box>
                        <Box h="calc(100% - 40px)">
                        <h1>{book.title}</h1>
                        <h2>{book.author}</h2>
                        <p>{book.isbn}</p>
                        </Box >
                        <Flex gap={8}>
                            <Link to={`/edit/${book._id}`}>
                                <Button>Edit</Button>
                            </Link>

                            <Link to={`/read/${book._id}`}>
                            <Button>Read</Button>
                            </Link>
                        </Flex>
                    </Box>

                </Flex>
            )}
        </Flex> 
        </>
    );
};
export default BookDetails;

