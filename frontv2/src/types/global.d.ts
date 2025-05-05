// src/types/global.d.ts

// Interfaz para el usuario (ajústala según tu API)
export interface User {
    id: number
    name: string
    email: string
    role?: string
    avatarUrl?: string
    [key: string]: any
  }
  
  // Contexto de autenticación
  export interface AuthContextType {
    loggedIn: boolean
    userData: User | null
    login: (token: string, userData: User) => void
    logout: () => void
    checkAuth: () => void
    notifications: any[]
    isLoading: boolean
  }
  
  // Interfaz para una respuesta genérica de la API
  export interface ApiResponse<T = any> {
    success: boolean
    message: string
    data: T
  }
  