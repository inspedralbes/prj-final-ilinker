'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { User, AuthContextType } from '@/types/global'
import { LoaderComponent } from '@/components/ui/loader-layout'
import { apiRequest } from '@/services/requests/apiRequest'
import { useRouter } from 'next/navigation'
import socket from '@/services/websockets/sockets'

// Valor por defecto del contexto
const defaultAuthContext: AuthContextType = {
  loggedIn: false,
  userData: null,
  login: () => {},
  token: '',
  logout: () => {},
  checkAuth: () => {},
  notifications: [],
  isLoading: false, // Añadido isLoading
  allUsers: [],
  setAllUsers: () => {},
}

// Crear contexto
export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

// Props para el proveedor
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true) // Estado de carga
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [token, setToken] = useState<any | undefined | null>('')

  const checkAuth = async () => {
    const auxToken = Cookies.get('authToken')
    if (!auxToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest('auth/check');
      console.log(response)
      if (response.status === 'success') {
        login(auxToken, response.user, response.notifications);
        setToken(auxToken);
      }else{
        logout();
      }
    } catch(e) {
      console.error("Error checking auth:", e);
      logout();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();

    socket.on('new_notifications', (data)=>{
      console.log(data)
    });

    return () => {
      socket.off('new_notifications');
    };
  }, [])

  const login = (token: string, userDataObj: User, notifications: any[]) => {
    Cookies.set('authToken', token)
    Cookies.set('userData', JSON.stringify(userDataObj))
    setLoggedIn(true)
    setUserData(userDataObj)
    setNotifications(notifications)
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
        token,
        logout,
        checkAuth,
        notifications,
        isLoading, // Pasar el estado de carga al contexto
        allUsers,
        setAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
