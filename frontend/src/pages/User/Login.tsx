import { Box, Button, Center, Flex, FormControl, Heading, Input, Spinner } from "@chakra-ui/react"
import { useLoginUser } from "../../hooks/UserUtils"


const Login = () => {
    const {username, setUsername, password, setPassword, isLoading, isError, loginUser} = useLoginUser()
    return (
        <Flex justifyContent="center" p={"1rem"} alignContent={"center"} h={"100%"} bgGradient={"radial(rgba(40,157,170,1) 0%, rgba(32,136,147,1) 30%, rgba(8,28,47,1) 100%)"}>
            <Center h={"100vh"}>
                <Box borderRadius={"5px"} p={"1rem"} width={"50vw"}> 
                    <Heading>Anmelden</Heading>
                    <FormControl mb={"1rem"}>
                        <Input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
                    </FormControl>
                    <FormControl>
                        <Input onKeyDown={e=>{if(e.key === "Enter"){loginUser()}}} value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" />
                    </FormControl>
                    <Button onClick={loginUser} mt={"1rem"} w="100%" colorScheme={isError ? "red" : "gray"}>{isLoading ? <Spinner/> : isError ? "Erneut Versuchen" : "Login"}</Button>
                </Box>
            </Center>    
        </Flex>
    )
}

export default Login