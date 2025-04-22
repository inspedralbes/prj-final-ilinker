'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { User, AuthContextType } from '@/types/global'
import { LoaderComponent } from '@/components/ui/loader-layout'

// Valor por defecto del contexto
const defaultAuthContext: AuthContextType = {
  loggedIn: false,
  userData: null,
  login: () => {},
  logout: () => {},
  checkAuth: () => {},
  isLoading: false, // Añadido isLoading
}

// Crear contexto
export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

// Props para el proveedor
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true) // Estado de carga

  const checkAuth = () => {
    const token = Cookies.get('authToken')
    const userDataCookie = Cookies.get('userData')

    if (token && userDataCookie) {
      setLoggedIn(true)
      try {
        const parsedData: User = JSON.parse(userDataCookie)
        setUserData(parsedData)
      } catch (error) {
        console.error('Error al parsear userData:', error)
        setUserData(null)
      }
    } else {
      setLoggedIn(false)
      setUserData(null)
    }
    setIsLoading(false) // Terminar el estado de carga
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = (token: string, userDataObj: User) => {
    Cookies.set('authToken', token)
    Cookies.set('userData', JSON.stringify(userDataObj))
    setLoggedIn(true)
    setUserData(userDataObj)
  }

  const logout = () => {
    Cookies.remove('authToken')
    Cookies.remove('userData')
    setLoggedIn(false)
    setUserData(null)
  }

  if (isLoading) {
    return <LoaderComponent /> // Aquí puedes poner un spinner o un mensaje de carga mientras se verifica la autenticación
  }

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        userData,
        login,
        logout,
        checkAuth,
        isLoading, // Pasar el estado de carga al contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
