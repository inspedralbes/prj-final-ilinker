import Cookies from "js-cookie";

const routeApi = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/").replace(/\/+$/, "") + "/";

export async function apiRequest(endpoint, method = "GET", body = null, isFormData = false) {
    try {
        let token = null;

        if (typeof window !== "undefined") {
            // Estamos en el cliente
            token = Cookies.get("authToken");
        }

        const options = {
            method,
            headers: {
                "Accept": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
        };

        if (body) {
            if (isFormData) {
                // For FormData (file uploads), don't set Content-Type (browser will set it with boundary)
                options.body = body;
            } else {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }

        const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, ""); // Eliminamos la barra inicial si la hay
        const url = `${routeApi}${cleanEndpoint}`;


        const response = await fetch(url, options);

        // if (!response.ok) {
        //     throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        // }
        const data = await response.json();
        
        if (!response.ok) {
            const error = new Error(data.message || `Error en la respuesta: ${response.status}`);
            error.response = {
                status: response.status,
                data: data
            };
            throw error;
        }

        return data;
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
