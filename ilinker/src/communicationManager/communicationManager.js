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
