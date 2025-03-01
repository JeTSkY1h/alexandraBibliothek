import { Badge, Box, Button, Flex, Image, Text, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { getCoverPath } from "../../hooks/BookUtils"
import { Book } from "../../lib/types/Book"
import { Link } from "react-router-dom"
import { MdEdit } from "react-icons/md";

const BookCard = ({ book }: { book: Book }) => {

    const bg = useColorModeValue("white", "gray.800");

    return (
        <Box
            role="group"
            as="article"
            w={{base: 150, md: 200}}
            h={{base: 275, md: 400}}
            overflow={"hidden"}
            borderRadius={"lg"}
            boxShadow={"md"} 
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            bg={bg}
        >
            <Link to={`/edit/${book._id}`}>
            <Button 
                position="absolute"
                top="5px"
                right="5px"
                opacity="0"
                _groupHover={{opacity: "1"}}>
                <MdEdit size={24}/>

            </Button>
            </Link>
            <Link to={`/book/${book._id}`}>
                <Flex justify="center" alignItems={"items-center"}>
                    <Image src={getCoverPath(book)} w="full" h={{base: 200, md:300}} alt={book.title} objectFit={"cover"} />
                </Flex>
            </Link>
            <Box p={{base:"0.2rem", md:"1rem"}}>
                <Box>
                    <Badge fontSize={{base: 8, md: "small"}} borderRadius="full" px={{base: 0, md: 2}} colorScheme="teal">
                        {book.author}
                    </Badge>
                </Box>

                <Box fontSize={{base: 8, md: "small"}} mt="1" as="h4" lineHeight="tight" isTruncated>
                    <Tooltip label={book.title}><Text>{book.title}</Text></Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default BookCard