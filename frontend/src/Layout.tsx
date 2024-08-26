import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react"
import BookGalery from "./components/Books/BookGalery"
import { Navbar } from "./components/Nav/Navbar"
import { useBooksLoader, useLastReadBooksLoader } from "./hooks/BookUtils"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { useStateSearchParam } from "./hooks/useStateSearchParam"


const Home = () => {
    const {books, loading, error, setLimit, setOffset, setSearch, search } = useBooksLoader()
    const {books: lastReadBooks, loading:lastReadLoading, error:lastReadError} = useLastReadBooksLoader(6,0)
    const [page, setPage] = useStateSearchParam('page', '0')
    const background = useColorModeValue("url('papyrus.webp')", "url('papyrus-dark.webp')")
    
    useEffect(() => {
        setPage("0")
    }, [search])


    useEffect(() => {
        console.log("page", page)
        setOffset(parseInt(page)*10)
    }, [page])

    const handleNext = () => {
        if(books.length < 30) return;
        setPage((parseInt(page)+1).toString())
    }

    const handlePrev = () => {
        if(parseInt(page) === 0) return;
        setPage((parseInt(page)-1).toString())
    }



    return (
        <Box backgroundImage={background} backgroundAttachment={"fixed"}>
            <Navbar search={search} setSearch={setSearch}/>
            <Box p={6}>
                {page === "0" && search === "" && !!lastReadBooks && <BookGalery title={"Zuletzt gelesen"} books={lastReadBooks} loading={lastReadLoading} error={!!lastReadError}/>}
                
                <BookGalery title={"Alle Bücher"} books={books} loading={loading} error={!!error}/>
            </Box>


                {(page !== "0" || books.length >= 30) &&
                <Flex w={"100%"} gap={6} justifyContent={"center"} alignItems={"center"} pb={6}>
                    {<Button isDisabled={page === "0"} onClick={handlePrev}><ChevronLeftIcon/></Button>}
                    <Box>{parseInt(page)+1}</Box>
                    <Button isDisabled={books.length < 30} onClick={handleNext}><ChevronRightIcon/></Button>
                </Flex>
                }

        </Box>
    )
}

export default Home