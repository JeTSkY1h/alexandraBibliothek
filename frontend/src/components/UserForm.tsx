import { Box, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { User } from "../lib/types/User"

interface UserFormProps {
    user?: User,
    setUser: (user: User) => void;
}


const UserForm = ({user, setUser}:UserFormProps) => {

    const [username, setUsername] = useState<string>(user?.username || "")
    const [password, setPassword] = useState<string>("")
    const [passwordRepeat, setPasswordRepeat] = useState<string>("")
    const [email, setEmail] = useState<string>(user?.email || "")
    useEffect(() => {
        setUser({
            username: username,
            password: password,
            email: email,
        })
    },[username, password, passwordRepeat, email])

    return (
        <>
            <Box>
                <Heading>Registrierung</Heading>
                <FormControl isRequired p={1}>
                    <FormLabel mb={0}>Username</FormLabel>
                    <Input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
                    <FormHelperText>Der Benutzername ist Für andere nutzer nicht sichtbar</FormHelperText>
                    <FormErrorMessage>Bitte geben Sie einen Benutzernamen ein.</FormErrorMessage>
                </FormControl>
                <FormControl isRequired p={1}>
                    <FormLabel mb={0}>Password</FormLabel>
                    <Input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" />
                    <FormErrorMessage>Bitte geben Sie ein Passwort ein.</FormErrorMessage>
                </FormControl>
                <FormControl isRequired p={1}>
                    <FormLabel mb={0}>Password wiederholen</FormLabel>
                    <Input value={passwordRepeat} onChange={e=>setPasswordRepeat(e.target.value)} type="password" placeholder="Password" />
                    <FormErrorMessage>Bitte wiederholen Sie das Passwort.</FormErrorMessage>    
                </FormControl>
                <FormControl isRequired p={1}>
                    <FormLabel mb={0}>Email</FormLabel>
                    <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
                    <FormErrorMessage>Bitte geben Sie eine Email ein.</FormErrorMessage>
                </FormControl>
            </Box>
        </>
    )
}

export default UserForm