import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import { Box, Flex, IconButton, HStack, useDisclosure, Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react"
import { NavLink } from "./NavLink"
import { Link } from "react-router-dom"

const links = [{name:"Home",dest:"/"}, {name:"Produkte",dest:"products"}, {name:"Überuns",dest:"#"}, {name:"Kontakt",dest:"#"}]

export const Navbar = () => {

    const {isOpen, onToggle} = useDisclosure()

    return  (
        <Box bgColor="main" px={16}>
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
                <Box>Logo</Box>
                <HStack as={"nav"} spacing={4} display={{base: "none", md: "flex"}}>
                    {links.map((link, i)=>{
                        return (
                            <NavLink key={"navlink"+i} name={link.name} destination={link.dest}/>
                        )
                    })}
                </HStack>
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