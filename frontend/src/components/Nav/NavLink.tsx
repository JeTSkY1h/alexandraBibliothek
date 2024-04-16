import { Box } from "@chakra-ui/react"
import { Link } from "react-router-dom"

interface NavLinkProps {
    name: string,
    destination: string,
}

export const NavLink = ({name,destination}:NavLinkProps) => {
    return (
        <Box 
            as={Link}
            p={2}
            rounded={"md"}
            bgColor={"#3C6E71"}
            transition={"all 0.5s"}
            _hover={{bgColor: "teal.700", textColor: "white"}}
            to={destination}
        >
            {name}
        </Box>
    )
}