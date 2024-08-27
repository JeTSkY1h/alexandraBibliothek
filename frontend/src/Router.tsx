import Register from "./pages/User/Register";
import { isAdmin, isLoggedIn } from "./hooks/UserUtils";
import EpupRender from "./components/Reader/EpubRender";
import { useState } from "react";
import EditBook from "./pages/EditBook";
import BookDetails from "./pages/BookDetails";
import Home from "./Layout"
import Login from "./pages/User/Login";
import ErrorPage from "./ErrorPage";
import { createBrowserRouter, Route, Navigate, createRoutesFromElements, RouterProvider } from "react-router-dom";

const Router = () => {
  const [loginState, setLoginState] = useState<boolean>(isLoggedIn());
  const [isAdminBool, setIsAdmin] = useState<boolean>(isAdmin());

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={loginState ? <Home /> : <Navigate to="/login" />}/>
        <Route path="login" element={loginState ? <Home /> : <Login />} />
        <Route path="register" element={<Register />} />
        <Route path="private" element={loginState ? <Home /> : <Navigate to="/login" />} />
        <Route path="book/:id" element={<BookDetails />} />
        <Route path="read/:id" element={<EpupRender />} />
        <Route path="edit/:id" element={isAdminBool ? <EditBook /> : <Navigate to="/login" />} />
        <Route path="*" element={<ErrorPage />} />
      </>
    )
  );

  return router;

};

export default Router;