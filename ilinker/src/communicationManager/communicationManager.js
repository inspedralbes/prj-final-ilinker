import Cookies from "js-cookie";

const routeApi = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

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
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }
           
        console.log("URL de la solicitud:", `${routeApi}/${endpoint}`);
        console.log("Opciones de la solicitud:", options);
        
        const response = await fetch(routeApi + endpoint, options);

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en la petición a ${endpoint}:`, error.message);
        return { error: "No se pudo conectar con el servidor. Inténtalo más tarde." };
    }
}

export async function login(){
    try {
        const response = await fetch(routeApi + 'login');
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