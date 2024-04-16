import { Badge, Box, Image, Text, Tooltip } from "@chakra-ui/react"
import { getCoverPath } from "../../hooks/BookUtils"
import { Book } from "../../lib/types/Book"
import { Link } from "react-router-dom"

const BookCard = ({ book }: { book: Book }) => {

    

    return (
        <Box borderWidth="1px" borderRadius="lg" width="200px" m="4">
            <Link to={`/book/${book._id}`}>
                <Box overflow={"hidden"} borderRadius="lg" width="200px" h={"300px"}>
                    <Image src={getCoverPath(book)} w={"100%"} h={"100%"} alt={book.title} objectFit={"fill"} />
                </Box>
            </Link>
            <Box p="1rem">
                <Box>
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        {book.author}
                    </Badge>
                </Box>

                <Box mt="1" as="h4" lineHeight="tight" isTruncated>
                    <Tooltip label={book.title}><Text>{book.title}</Text></Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default BookCard