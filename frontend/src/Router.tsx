import { Navigate, Route, Routes } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Home from "./Layout";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import { isAdmin, isLoggedIn } from "./hooks/UserUtils";
import EpupRender from "./components/Reader/EpubRender";
import { useEffect, useState } from "react";
import EditBook from "./pages/EditBook";


const Router = () => {
  const [loginState, setLoginState] = useState<boolean>(isLoggedIn());
  const [isAdminBool, setIsAdmin] = useState<boolean>(false);

  useEffect(()=>{
    setLoginState(isLoggedIn());
    setIsAdmin(isAdmin());
  }, [])

  return (
    <Routes>
      <Route index element={loginState ? <Home/> : <Navigate to="/login"/>}/>
      <Route path="/" element={loginState ? <Home/> : <Navigate to="/login"/>}/>
      <Route path="login" element={loginState ? <Home/> : <Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="private" element={loginState ? <Home/> : <Navigate to="/login"/>}/>
      <Route path="book/:id" element={<EpupRender/>}/>
      <Route path="edit/:id" element={ isAdminBool ? <EditBook/> : <Navigate to="/login"/>}/>
      <Route path="*" element={<ErrorPage/>}/>
      
    </Routes>
  )
}

export default Router

