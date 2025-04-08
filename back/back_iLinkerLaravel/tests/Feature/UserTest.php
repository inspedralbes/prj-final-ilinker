<?php

namespace Tests\Feature;

use App\Services\CompanyService;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
{

    use RefreshDatabase;

    private $userService;

    protected function setUp(): void
    {
        parent::setUp(); // Siempre llamar a setUp del padre

        // Obtener instancia del servicio usando el contenedor de Laravel
        $this->userService = app(UserService::class);
    }
    /**
     * A basic feature test example.
     */

    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_login(): void
    {
        // Crear un usuario en la BD
        $user = $this->userService->createUser([
            'name'=>'Jeremy',
            'surname'=>'Pinto',
            'email' => 'test@example.com',
            'birthday'=> '23/04/2000',
            'password' => '1234',
            'rol' => 'company'
        ]);

        // Datos correctos
        $data = [
            'name'=>'Jeremy',
            'surname'=>'Pinto',
            'birthday'=>'23/04/2000',
            'email' => 'test@example.com',
            'password' => '1234',
            'rol' => 'company',
        ];

        // Hacer la petición POST a /login
        $response = $this->postJson(route('auth.login'), $data);

        // Verificar que el status sea 200 y reciba un token
        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'message', 'token', 'user']);

        $response->assertStatus(200);
    }
}
