import Cookies from "js-cookie";
import config from "@/types/config";

const routeApi: string = config.apiUrl;

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null,
  isFormData: boolean = false
): Promise<any> {
  try {
    // Solo leer la cookie en cliente
    let token: string | undefined;
    if (typeof window !== "undefined") {
      token = Cookies.get("authToken");
      console.log("Token from cookies:", token); // Debug token
    }

    // Preparamos headers comunes
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    
    // Solo agregamos el token si existe
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header added:", headers.Authorization);
    }

    console.log("Request headers:", headers); // Debug headers

    const options: RequestInit = {
      method,
      headers,
    };

    if (body instanceof FormData) {
      // Si es FormData, no ponemos Content-Type: lo infiere el navegador con boundary
      options.body = body;
    } else if (body != null) {
      // Para cualquier otro body, enviamos JSON
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    // Formatear la URL correctamente
    const baseUrl = routeApi.endsWith('/') ? routeApi.slice(0, -1) : routeApi;
    const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${apiEndpoint}`;
    
    console.log("Request URL:", url); // Debug URL

    const response = await fetch(url, options);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Authentication error: Token invalid or expired");
        throw new Error("No autorizado. Por favor, inicie sesión de nuevo.");
      }
      if (response.status === 422 && data.errors) {
        // Handle validation errors
        const errorMessages = Object.values(data.errors).flat().join('\n');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || `Error en la respuesta: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`Error en la petición a ${endpoint}:`, error.message);
    throw error;
  }
}
