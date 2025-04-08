"use client";

import { useState, useEffect } from "react";

export default function useNavBar() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/users/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
          setUser(data.user);
          setNotifications(data.user.notifications || []); // Si la API devuelve notificaciones
        } else {
          setError(data.message || "Error al cargar los datos del usuario");
        }
      } catch (err) {
        setError(err.message || "Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, notifications, loading, error, setUser };
}