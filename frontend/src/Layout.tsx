import { Box, useColorModeValue } from "@chakra-ui/react"
import BookGalery from "./components/Books/BookGalery"
import { Navbar } from "./components/Nav/Navbar"
import { useBooksLoader, useLastReadBooksLoader } from "./hooks/BookUtils"
import { useEffect } from "react"
import { useStateSearchParam } from "./hooks/useStateSearchParam"
import Paginator from "./components/Paginator"


const Home = () => {
    const {setPage:setLoaderPage, books, loading, error, setSearch, search, pageCount } = useBooksLoader()
    const {books: lastReadBooks, loading:lastReadLoading, error:lastReadError} = useLastReadBooksLoader(6,0)
    const queryParams = new URLSearchParams(location.search);
    const initialPage = queryParams.get('page') || '0';
    console.log("initialPage", initialPage)
    const [page, setPage] = useStateSearchParam('page', initialPage)
    const background = useColorModeValue("url('papyrus.webp')", "url('papyrus-dark.webp')")
    
    useEffect(() => {
        console.log("page", page)
        setLoaderPage(Number(page))

    }, [page])

    return (
        <Box backgroundImage={background} backgroundAttachment={"fixed"}>
            <Navbar search={search} setSearch={setSearch}/>
            <Box p={6}>
                {page === "0" && search === "" && !!lastReadBooks && <BookGalery title={"Zuletzt gelesen"} books={lastReadBooks} loading={lastReadLoading} error={!!lastReadError}/>}
                
                <BookGalery title={"Alle Bücher"} books={books} loading={loading} error={!!error}/>
            </Box>

            <Paginator page={page} length={books.length} pages={pageCount} setPage={setPage}/>

        </Box>
    )
}

export default Home