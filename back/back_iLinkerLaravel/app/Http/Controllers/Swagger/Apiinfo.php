<?php

namespace App\Http\Controllers\Swagger;

/**
 * @OA\Info(
 *     title="API iLinker",
 *     version="1.0.0",
 *     description="Documentación de la API iLinker",
 *     @OA\Contact(
 *         email="soporte@ilinker.com"
 *     )
 * )
 *
 * @OA\SecurityScheme(
 *      securityScheme="bearerAuth",
 *      type="http",
 *      scheme="bearer",
 *      bearerFormat="JWT"
 * * )
 */
class ApiInfo
{
    // Este archivo solo existe para la anotación @OA\Info
}
