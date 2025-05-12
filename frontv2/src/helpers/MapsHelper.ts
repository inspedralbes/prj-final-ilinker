import config from "@/types/config";
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
  const MAPBOX_TOKEN = config.mapboxToken; // Necesitarás registrarte para obtener un token

  if (input.length > 5) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true`
      );
      const data = await response.json();
      const placesResult = data.features.map((feature: any) => ({
          place_name: feature.place_name,
          center: feature.center,
          lat: feature.center[1],
          lng: feature.center[0]
        }))
      return placesResult;
    } catch (error) {
      console.error('Error en autocompletado:', error);
    }
  } else {
    return [];
  }
};