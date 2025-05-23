<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Rutas permitidas
    'allowed_methods' => ['*'], // Métodos permitidos (GET, POST, PUT, DELETE, etc.)
    //'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins' => ['*'], // Orígenes permitidos (cambiar '*' si quieres restringir)
    'allowed_origins_patterns' => [], // Patrones de origen permitidos
    'allowed_headers' => ['*'], // Encabezados permitidos
    'exposed_headers' => [], // Encabezados expuestos
    'max_age' => 0, // Tiempo de cache del preflight request
    'supports_credentials' => true, // Habilitar credenciales (true si usas cookies o sesiones)
];


