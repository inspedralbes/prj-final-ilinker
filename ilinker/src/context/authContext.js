// En src/context/authContext.js
"use client"
import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import { apiRequest } from "@/communicationManager/communicationManager"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userData, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = Cookies.get("authToken");
    console.log("Verificando token:", token);

    if (token) {
      try {
        const json = {
          id: 1
        }
        const userData = await apiRequest(`users/info?id=1`, "GET");
        console.log("Datos del usuario Auth:", userData);

        if (!userData.error) {
          setUser(userData);
        } else {
          console.log("Error al obtener datos del usuario:", userData.error);
          setUser(null);
          Cookies.remove("authToken");
        }
      } catch (error) {
        console.error("Error fetchUser:", error);
        setUser(null);
        Cookies.remove("authToken");
      }
    } else {
      console.log("No hay token");
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (userData) => {
    try {
      console.log("Login con datos:", userData);
      Cookies.set("authToken", userData.token);

      // Verificar inmediatamente los datos del usuario
      await fetchUser();
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("authToken")
    setUser(null)
  }

  const value = {
    userData,
    loading,
    login,
    logout,
    refreshUser: fetchUser // Exportamos la función para refrescar el usuario
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)