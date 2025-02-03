import Cookies from "js-cookie";

const routeApi = "http://localhost:8000/api/";

export async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const token = Cookies.get("authToken");
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

        console.log(`Haciendo petición a ${routeApi + endpoint}`, options); // Para debugging

        const response = await fetch(routeApi + endpoint, options);
        const data = await response.json();

        console.log("Respuesta del servidor:", data); // Para debugging

        if (!response.ok) {
            // Si la respuesta no es ok, convertimos el mensaje de error en un objeto error
            return {
                error: data.message || `Error: ${response.status} ${response.statusText}`
            };
        }

        return data;
    } catch (error) {
        console.error(`Error en la petición a ${endpoint}:`, error);
        return { 
            error: "Error de conexión al servidor"
        };
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