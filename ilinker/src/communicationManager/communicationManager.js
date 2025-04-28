import Cookies from "js-cookie";

const routeApi = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/").replace(/\/+$/, "") + "/";

export async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        let token = null;

        if (typeof window !== "undefined") {
            // Estamos en el cliente
            token = Cookies.get("authToken");
        }

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, ""); // Eliminamos la barra inicial si la hay
        const url = `${routeApi}${cleanEndpoint}`;


        const response = await fetch(url, options);

        // if (!response.ok) {
        //     throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        // }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en la respuesta: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en la petición a ${endpoint}:`, error.message);
        throw error;
        // return { error: "No se pudo conectar con el servidor. Inténtalo más tarde." };
    }
}

export async function login() {
    try {
        // Use the apiRequest function for consistency
        // return await apiRequest('login');
        await fetch(`${routeApi.replace('/api/', '')}/sanctum/csrf-cookie`, {
            credentials: 'include'
        });

        return await apiRequest('auth/login', 'POST', credentials);

    } catch (error) {
        console.error('Error al realizar login:', error);
        return { error: error.message };
    }
}

export async function getAllCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los países:', error);
        return { error: error.message }; // Devolvemos un objeto con el error para manejarlo donde se llame esta función
    }
}

export async function fetchReportedUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/reported-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Puedes añadir tu token si usas auth:
        // 'Authorization': `Bearer ${token}`
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios reportados');
    }
  
    return response.json();
  }
  
  export async function deleteReport(reportId) {
    const response = await fetch(`${API_BASE_URL}/admin/reported-users/${reportId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al eliminar el reporte');
    }
  
    return response.json();
  }