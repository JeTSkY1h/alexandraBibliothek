import { Box, Center, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom"
import { Navbar } from "./components/Nav/Navbar";

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);
    const background = useColorModeValue("url('papyrus.webp')", "url('papyrus-dark.webp')")
    const color = useColorModeValue("white", "black")


    return (
        <>
        <Navbar/>
        <Center  bg={background} w={"100vw"} h={"calc(100vh-60px)"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Box borderRadius={"md"} bg={"white"} p={"3rem"} boxShadow={"0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"}>
                <Heading color={color}>
                    Ohhh-Ohhh...
                </Heading>
                <Text color={color}>Scheint so als gäbe es die Seite die du suchst nicht mehr.</Text>
            </Box>
        </Center>
        </>
    )
}

export default ErrorPage