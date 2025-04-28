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
    }

    // Preparamos headers comunes
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

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

    // Asegurarse de que no haya barras diagonales duplicadas en la URL
    const baseUrl = routeApi.endsWith('/') ? routeApi.slice(0, -1) : routeApi;
    const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${apiEndpoint}`;

    const response = await fetch(url, options);

    const data = await response.json();

    if (!response.ok) {
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
