import Cookies from "js-cookie";
import config from "@/types/config";

// const routeApi: string = "https://api.play2learn.pro/api";
const routeApi: string = config.apiUrl;

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null,
  isFormData: boolean = false
): Promise<any> {
  try {
    let token: string | undefined;

    // Solo ejecutar js-cookie en el cliente
    if (typeof window !== 'undefined') {
      token = Cookies.get("authToken");
    }

    const options: RequestInit = {
      method,
      headers: isFormData
        ? {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          }
        : {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
      //   credentials: "include",
    };

    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    // Asegurarse de que no haya barras diagonales duplicadas en la URL
    const baseUrl = routeApi.endsWith('/') ? routeApi.slice(0, -1) : routeApi;
    const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${apiEndpoint}`;

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en la respuesta: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error en la petición a ${endpoint}:`, error.message);
    throw error;
  }
}