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
export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null
): Promise<any> {
  try {
    // Obtener token
    const token = getAuthToken();
    
    // Preparamos headers comunes
    const headers: Record<string, string> = {
      "Accept": "application/json",
    };
    
    // Agregar token si existe
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const options: RequestInit = {
      method,
      headers,
      credentials: 'include' // Aseguramos que las cookies se envíen
    };
    
    if (body instanceof FormData) {
      // Si es FormData, no ponemos Content-Type: lo infiere el navegador con boundary
      options.body = body;
    } else if (body != null) {
      // Para cualquier otro body, enviamos JSON
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
    
    const url = `${routeApi}${endpoint}`;
    console.log(`Enviando solicitud a: ${url}`, { method, headers: {...headers, Authorization: token ? 'Bearer [TOKEN]' : undefined} });
    
    const response = await fetch(url, options);
    
    // Manejar errores de respuesta HTTP
    if (!response.ok) {
      let errorMessage = `Error en la respuesta: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Si no podemos parsear como JSON, dejamos el mensaje por defecto
      }
      
      // Si es un error de autenticación, podemos limpiar el token
      if (response.status === 401) {
        Cookies.remove("authToken");
        localStorage.removeItem("authToken");
        
        // Redireccionar al login si es necesario
        if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
      }
      
      throw new Error(errorMessage);
    }
    
    // Solo intentamos parsear como JSON si esperamos una respuesta con contenido
    if (response.status !== 204) { // 204 = No Content
      return await response.json();
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error en apiRequest:', error);
    return {
      status: 'error',
      message: error.message,
    };
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

// Función para eliminar un reporte
export async function deleteReport(reportId: number) {
  try {
    await apiRequest(`admin/reported-users/${reportId}`, 'DELETE');
    return {
      status: 'success',
      message: 'Reporte eliminado correctamente'
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message,
    };
  }
}