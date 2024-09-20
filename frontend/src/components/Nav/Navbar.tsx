import { Box, Flex, HStack, Menu, MenuButton, Button, MenuList, MenuItem, Input } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { logoutUser } from "../../hooks/UserUtils";

interface NavbarProps {
    search?: string;
    setSearch?: (search: string) => void;
}

export const Navbar = ({search, setSearch}:NavbarProps) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!setSearch) return;
        setSearch(e.target.value)
    };

    return  (
        <Box bgColor="teal.800" px={16}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            
            <HStack spacing={8} alignItems={"center"}>
                <Link to="/"><Box color={"whitesmoke"} fontWeight={"semibold"}>Alexandra</Box></Link>
                
                { !!setSearch && <Input value={search} onChange={handleSearch} placeholder="Suche"/>}
            </HStack>
            <Flex alignItems={"center"}>
                <Menu>
                    <MenuButton 
                        as={Button}
                        rounded={"full"}
                    />
                    <MenuList>
                        <MenuItem onClick={logoutUser}>
                            Abmelden
                        </MenuItem>
                        <MenuItem>
                        <Link to="register">Registrieren</Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
          </Flex>
        </Box>
    )
}