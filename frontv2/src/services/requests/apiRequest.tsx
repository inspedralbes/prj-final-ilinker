import Cookies from "js-cookie";
import config from "@/types/config";

const routeApi: string = config.apiUrl;

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null
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

    const response = await fetch(`${routeApi}${endpoint}`, options);

    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en la respuesta: ${response.status}`);
    }

   
    return {
      status: 'success',
      data: await response.json(),
    }
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message,
    };
  }
}