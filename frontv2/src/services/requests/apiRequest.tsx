import Cookies from "js-cookie"; 
import config from "@/types/config"; 

const routeApi: string = config.apiUrl; 

// Función de utilidad para obtener el token de autenticación
export function getAuthToken(): string | null { 
  // Primero intentamos obtener el token de cookies (más seguro)
  const cookieToken = Cookies.get("authToken"); 
  if (cookieToken) return cookieToken; 
  
  // Si no está en cookies, intentamos obtenerlo del localStorage
  return localStorage.getItem("authToken");
}

// Función general de petición a la API
export async function  apiRequest(
  endpoint: string, 
  method: string = "GET", 
  body: any = null 
): Promise<any> { 
  try { 
    const token = Cookies.get("authToken"); 
    const headers: Record<string, string> = { 
      "Accept": "application/json", 
    }; 

    if (token) { 
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = { 
      method, 
      headers, 
      credentials: 'include' 
    }; 

    if (body instanceof FormData) {
      // Si es FormData, no ponemos Content-Type: lo infiere el navegador con boundary
      options.body = body;
    } else if (body != null) {
      // Para cualquier otro body, enviamos JSON
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    //const response = await fetch(`${routeApi}${endpoint}`, options);
    const response = await fetch(`${routeApi.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }


    return response.status !== 204 ? await response.json() : { success: true };
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Función para obtener usuarios reportados
export async function fetchReportedUsers() {
  try {
    const response = await apiRequest('admin/reported-users');
    return {
      status: 'success',
      data: response
    };
  } catch (error: any) { 
    return { 
      status: 'error', 
      message: error.message, 
    }; 
  } 
} 
 