<?php

if (!function_exists('generateSlug')) {
    function generateSlug($name) {
        // Eliminar acentos y caracteres especiales
        $name = transliterator_transliterate('Any-Latin; Latin-ASCII', $name);

        // Convertir a minúsculas
        $slug = strtolower($name);

        // Reemplazar cualquier carácter que no sea alfanumérico con un guion
        $slug = preg_replace('/[^a-z0-9]+/u', '-', $slug);

        // Eliminar guiones al inicio y al final
        $slug = trim($slug, '-');

        return $slug;
    }
}
