import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Index from "./components/Index";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "./App.css";
import Organizer from "./components/Organizer";
import { getUser } from "./operations";
import AdminPage from "./components/AdminPage";

export default function App() {
  const [token, setToken] = useState(false);
  const [userInfo, setUserInfo] = useState();

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token") || "");
      setToken(data);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/signin" element={<SignIn setToken={setToken} />} />
          <Route path="/signup" element={<SignUp />} />
          {token ? <Route path="/home" element={<Home token={token} />} /> : ""}
          {token ? (
            <Route path="/organizer" element={<Organizer token={token} />} />
          ) : (
            ""
          )}
          {token ? (
            <Route path="/admin" element={<AdminPage token={token} />} />
          ) : (
            ""
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
