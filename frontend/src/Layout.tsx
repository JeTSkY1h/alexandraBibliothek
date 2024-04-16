import { Box } from "@chakra-ui/react"
import BookGalery from "./components/Books/BookGalery"
import { Navbar } from "./components/Nav/Navbar"
import { useEffect, useState } from "react"


const Home = () => {
    const [search, setSearch] = useState<string>("")

    useEffect(() => {
        console.log(search)
    }, [search])

    return (
        <Box>
            <Navbar search={search} setSearch={setSearch}/>
            <BookGalery />
        </Box>
    )
}

export default Home