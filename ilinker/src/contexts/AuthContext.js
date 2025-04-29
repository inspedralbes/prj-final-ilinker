"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext({
    loggedIn: false,
    userData: null,
    login: () => {},
    logout: () => {},
    checkAuth: () => {},
});

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Función para verificar el estado de autenticación a partir de las cookies
    const checkAuth = () => {
        const token = Cookies.get("authToken");
        const userDataCookie = Cookies.get("userData");

        if (token && userDataCookie) {
            setLoggedIn(true);
            try {
                setUserData(JSON.parse(userDataCookie));
            } catch (error) {
                console.error("Error al parsear userData:", error);
                setUserData(null);
            }
        } else {
            setLoggedIn(false);
            setUserData(null);
        }
    };

    // Ejecutamos la verificación al montar el componente
    useEffect(() => {
        checkAuth();
    }, []);

    // Función para iniciar sesión: establece las cookies y actualiza el estado
    const login = (token, userDataObj) => {
        Cookies.set("authToken", token);
        Cookies.set("userData", JSON.stringify(userDataObj));
        setLoggedIn(true);
        setUserData(userDataObj);
    };

    // Función para cerrar sesión: elimina las cookies y actualiza el estado
    const logout = () => {
        Cookies.remove("authToken");
        Cookies.remove("userData");
        setLoggedIn(false);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ loggedIn, userData, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
