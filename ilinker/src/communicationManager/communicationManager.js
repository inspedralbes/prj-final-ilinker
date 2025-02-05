import Cookies from "js-cookie";

const routeApi = "http://localhost:8000/api/";

export async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const token = Cookies.get("authToken"); // Obtener el token de la cookie

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}), // Agregar el token si existe
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(routeApi + endpoint, options);

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en la petición a ${endpoint}:`, error);
        return { error: error.message }; // Devolver error para manejarlo en el frontend
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