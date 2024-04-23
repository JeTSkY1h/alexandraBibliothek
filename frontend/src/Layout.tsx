import { Box } from "@chakra-ui/react"
import BookGalery from "./components/Books/BookGalery"
import { Navbar } from "./components/Nav/Navbar"
import { useBookLoader } from "./hooks/BookUtils"


const Home = () => {
    const {books, loading, error, setLimit, setOffset, setSearch, search } = useBookLoader()


    return (
        <Box backgroundImage={"url('papyrus.webp')"} backgroundAttachment={"fixed"}>
            <Navbar search={search} setSearch={setSearch}/>
            <BookGalery books={books} loading={loading} error={!!error}/>
        </Box>
    )
}

export default Home