import { Box, Center, Heading, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom"

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <Center bg={"themedWhite"} w={"100vw"} h={"100vh"}>
            <Box bg={"white"} p={"3rem"} boxShadow={"0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"}>
                <Heading>
                    Ohhh-Ohhh...
                </Heading>
                <Text>Scheint so als gäbe es die Seite die du suchst nicht mehr.</Text>
            </Box>
        </Center>
    )
}

export default ErrorPage