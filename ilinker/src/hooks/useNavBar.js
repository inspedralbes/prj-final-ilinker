"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function useNavBar() {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Realiza una petición a tu API para obtener los datos del usuario autenticado
        const response = await axios.get("/auth/login", {
          headers: {
            // Asegúrate de incluir el token de autenticación si es necesario
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data); // Guarda los datos del usuario en el estado
      } catch (err) {
        setError(err.message || "Error al cargar los datos del usuario");
      } finally {
        setLoading(false); // Marca la carga como completada
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
