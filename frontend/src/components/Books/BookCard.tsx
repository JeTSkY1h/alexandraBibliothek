import { Badge, Box, Button, Flex, Image, Text, Tooltip } from "@chakra-ui/react"
import { getCoverPath } from "../../hooks/BookUtils"
import { Book } from "../../lib/types/Book"
import { Link } from "react-router-dom"

const BookCard = ({ book }: { book: Book }) => {

    

    return (
        <Box
            role="group"
            as="article"
            w={{base: 100, md: 200}}
            h={{base: 200, md: 400}}
            overflow={"hidden"}
            borderRadius={"lg"}
            boxShadow={"md"} 
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            bg={"white"}
        >
            <Button 
                position="absolute"
                top="5px"
                right="5px"
                opacity="0"
                _groupHover={{opacity: "1"}}>
                Edit
            </Button>
            <Link to={`/book/${book._id}`}>
                <Flex justify="center" alignItems={"items-center"}>
                    <Image src={getCoverPath(book)} w="full" h={{base: 150, md:300}} alt={book.title} objectFit={"cover"} />
                </Flex>
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