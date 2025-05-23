'use client'

import { useEffect, useState } from 'react';
import en from '../../public/locales/en.json';
import es from '../../public/locales/es.json';
import fr from '../../public/locales/fr.json';
import Cookies from 'js-cookie';

const translations = { en, es, fr };

export const useTranslation = () => {
    const [locale, setLocale] = useState('en');  // Estado para el idioma

    // Este efecto solo se ejecutará en el cliente
    useEffect(() => {
        const savedLocale = Cookies.get('locale');  // Leer el idioma guardado en la cookie
        if (savedLocale) {
            setLocale(savedLocale);  // Si existe, usar el idioma guardado
        } else if (typeof navigator !== 'undefined') {
            setLocale(navigator.language.split('-')[0] || 'en');  // Si no existe, usar el idioma del navegador
        }
    }, []);


    const t = (key) => {
        return translations[locale]?.[key] || key;
    };

    const changeLanguage = (event) => {
        const newLocale = event.target.value;  // Extraer el valor del evento
        console.log(newLocale);  // Verifica el nuevo idioma seleccionado
        setLocale(newLocale);  // Actualizar el idioma
        Cookies.set('locale', newLocale);  // Guardar el idioma en la cookie
    };

    return { t, locale, changeLanguage };
};
