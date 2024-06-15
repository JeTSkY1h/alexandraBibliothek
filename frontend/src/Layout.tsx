import { Box, Button, Flex } from "@chakra-ui/react"
import BookGalery from "./components/Books/BookGalery"
import { Navbar } from "./components/Nav/Navbar"
import { useBooksLoader } from "./hooks/BookUtils"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { useStateSearchParam } from "./hooks/useStateSearchParam"


const Home = () => {
    const {books, loading, error, setLimit, setOffset, setSearch, search } = useBooksLoader()
    const [page, setPage] = useStateSearchParam('page', '0')
    
    
    useEffect(() => {
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
        <Box backgroundImage={"url('papyrus.webp')"} backgroundAttachment={"fixed"}>
            <Navbar search={search} setSearch={setSearch}/>
            <BookGalery books={books} loading={loading} error={!!error}/>

            <Flex w={"100%"} justifyContent={"center"} alignItems={"center"}>
            <Button onClick={handlePrev}><ChevronLeftIcon/></Button>
            <Box>{parseInt(page)+1}</Box>
            <Button onClick={handleNext}><ChevronRightIcon/></Button>
            </Flex>

        </Box>
    )
}

export default Home