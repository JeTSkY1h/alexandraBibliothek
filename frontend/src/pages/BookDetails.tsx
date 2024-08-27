import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, Image, Spinner, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaRegStar, FaStar } from "react-icons/fa";
import {Navbar} from '../components/Nav/Navbar'; // Adjust the import path as necessary
import { useBookLoader } from '../hooks/BookUtils'; // Adjust the import path as necessary
import { getCoverPath } from '../hooks/BookUtils'; // Adjust the import path as necessary
import { useRatingUtils } from '../hooks/UserBookUtils';

const BookDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { book, isLoading, error } = useBookLoader(id || "");
    const [hoveredIndex, setHoveredIndex] = React.useState(-1);
    const {rating, setRating, isLoading: ratingLoading} = useRatingUtils(id || "");

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(-1);
    };

    const handleRating = (index: number) => () => {
        console.log("Rating", index + 1);

    }




    return (
        <>
            <Navbar />
            <Flex justifyContent="center" alignItems="center" flexDirection="column" p={4}>
                {isLoading && <Spinner size="xl" />}
                {error && <Text color="red.500">Error loading book details</Text>}
                {book && (
                    <Flex
                        flexDirection={{ base: 'column', md: 'row' }}
                        maxWidth="960px"
                        width="100%"
                        boxShadow="lg"
                        p={4}
                        borderRadius="md"
                    >
                        <Box flex="1" textAlign="center">
                            <Image
                                src={getCoverPath(book)}
                                alt={book.title}
                                borderRadius="md"
                                maxHeight="400px"
                                objectFit="cover"
                                mx="auto"
                            />
                        </Box>
                        <Box flex="2" p={4}>
                            <Heading as="h1" size="xl" mb={4}>{book.title}</Heading>
                            <Heading as="h2" size="md" mb={2}>{book.author}</Heading>
                            <Text fontSize="lg" mb={4}>ISBN: {book.isbn}</Text>
                            <Text fontSize="lg" mb={4}>Rating</Text>
                            <Flex mb={4} onMouseLeave={handleMouseLeave}>
                                {Array(5).fill(0).map((_, index) => (
                                    <Box key={index} onClick={handleRating(index)} onMouseEnter={() => handleMouseEnter(index)}>
                                        {index <= hoveredIndex ? <FaStar size={24} /> : <FaRegStar size={24} />}
                                    </Box>
                                ))}
                            </Flex>
                            <Flex gap={4}>
                                <Link to={`/edit/${book._id}`}>
                                    <Button colorScheme="blue">Edit</Button>
                                </Link>
                                <Link to="/books">
                                    <Button colorScheme="gray">Back to List</Button>
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