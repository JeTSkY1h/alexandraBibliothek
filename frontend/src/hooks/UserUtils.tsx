import { useState, useCallback, useEffect } from "react";
import { register, login } from "../lib/api/user";
import { User } from "../lib/types/User";
import { useNavigate } from "react-router-dom";

export const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) {
      return false;
    }
  
    const expirationDate = new Date(exp * 1000);
    if (new Date() > expirationDate) {
      return false;
    }
  
    return true;
  }

export const useLoginUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();


    const loginUser = useCallback(() => {
        setIsLoading(true);
        console.log(username, password)
        if ( username === "" || password === "") {
            setIsError(true);
            setIsLoading(false);
            return;
        }
        if(!username || !password) {
            setIsError(true);
            setIsLoading(false);
            return;
        }
        login(username, password).then((tokenObj) => {
            setIsLoading(false);
            setIsError(false);
            localStorage.setItem("token", tokenObj.access_token);
            setTimeout(()=>{navigate("/")}, 200);
            
        }).catch((error) => {
            localStorage.removeItem("token");
            console.log(error)
            setIsLoading(false);
            setIsError(true);
        });

    }, [username, password, navigate]);

    return {
        username, setUsername,
        password, setPassword,
        isLoading,
        isError,
        loginUser,
    }
}

export const useRegisterUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const registerUser = useCallback((user: User) => {
        setIsLoading(true);
        if (!user) {
            setIsError(true);
            setIsLoading(false);
            return;
        }
        register(user).then(() => {
            setIsLoading(false);
            setIsError(false);
            setIsSuccess(true);
        }).catch(() => {
            setIsLoading(false);
            setIsError(true);
        });
    }, []);

    return {
        isLoading,
        isError,
        isSuccess,
        registerUser
    }
}

