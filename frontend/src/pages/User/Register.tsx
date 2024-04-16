import { useState } from "react"
import UserForm from "../../components/UserForm"
import { Box, Button, Flex, Spinner, useToast } from "@chakra-ui/react"
import { User } from "../../lib/types/User"
import { useRegisterUser } from "../../hooks/UserUtils"

const Register = () => {
    const [user, setUser] = useState<User>();
    const toast = useToast();
    const {isLoading, isSuccess, isError, registerUser} = useRegisterUser();

    
    const handleSubmit = () => {
        if(isLoading) {
            toast({
                title: "Fehler",
                description: "Bitte warte bis die Anfrage abgeschlossen ist",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            return
        }
        if(!user) {
            toast({
                title: "Fehler",
                description: "Bitte fülle alle Felder aus",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            return
        }
        console.log(user)
        registerUser(user)

    }

    return (
        <Flex justifyContent={"center"} alignItems={"center"}>
            <Box w={"720px"} p={1}>
                <UserForm setUser={setUser}/>
                <Button w={"100%"} onClick={handleSubmit}>{isLoading ? <Spinner/> : isError ? "Es gab einen Fehler" : isSuccess ? "Gespeichert!" : "Registrieren" }</Button>
            </Box>
        </Flex>
    )
}

export default Register