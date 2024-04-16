import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import { Box, Flex, IconButton, HStack, useDisclosure, Menu, MenuButton, Button, MenuList, MenuItem, Input } from "@chakra-ui/react"
import { useState } from "react";
import { Link } from "react-router-dom"

interface NavbarProps {
    search: string;
    setSearch: (search: string) => void;
}

export const Navbar = ({search, setSearch}:NavbarProps) => {

    const {isOpen, onToggle} = useDisclosure()
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    };

    return  (
        <Box bgColor="teal.800" px={16}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton 
              size={'md'}
              display={{ md: "none" }}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} 
              aria-label={'Toggle Menu'}
              onClick={onToggle}
              bgColor="action"
              _hover={{
                bgColor: "teal.200"
              }}
            />
            <HStack spacing={8} alignItems={"center"}>
                <Box color={"whitesmoke"} fontWeight={"semibold"}>Alexandra</Box>
                <Input value={search} onChange={handleSearch} placeholder="Suche"/>
            </HStack>
            <Flex alignItems={"center"}>
                <Menu>
                    <MenuButton 
                        as={Button}
                        rounded={"full"}
                    />
                    <MenuList>
                        <MenuItem>
                            <Link to="login">Anmelden</Link>
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