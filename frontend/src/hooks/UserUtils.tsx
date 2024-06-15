import { useState, useCallback } from "react";
import { register, login } from "../lib/api/user";
import { User } from "../lib/types/User";

export const logoutUser = () => {
    localStorage.removeItem("token");
    window.location.reload();
}

export const isAdmin = () => {
    const roles = getUserRoles();
    return roles.includes("admin");
}

export const getUserRoles = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }
  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    const { roles } = JSON.parse(jsonPayload);
    return roles;
}

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
  
    const { exp, roles } = JSON.parse(jsonPayload);
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


    const loginUser = useCallback(() => {
        setIsLoading(true);
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
            setTimeout(() => {
                window.location.reload();
            }, 1000);          
        }).catch((error) => {
            localStorage.removeItem("token");
            console.log(error)
            setIsLoading(false);
            setIsError(true);
        });

    }, [username, password]);

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

