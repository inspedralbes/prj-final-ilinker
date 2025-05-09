 // Función para obtener ubicación por IP
 export const getUserLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo localización por IP:', error);
    }
  };

  // Función para autocompletar direcciones
  export const searchAddresses = async (input: string) => {
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiYTIyamhlcGluY3JlIiwiYSI6ImNtYWdsc2V1MDAyYzgyaXFzNHZ2Y3U1bG4ifQ.WaA39FCZrDZqHd4RB3FUAg'; // Necesitarás registrarte para obtener un token
    
    if (input.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error en autocompletado:', error);
      }
    } else {
      return [];
    }
  };