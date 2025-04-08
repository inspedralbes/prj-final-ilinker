<?php

namespace App\Console\Commands;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Console\Command;

class MakeService extends Command
{
    protected $signature = 'make:service {name}';
    protected $description = 'Crear una nueva clase de servicio';

    public function __construct()
    {
        parent::__construct();
    }
    public function handle()
    {
        $name = $this->argument('name');
        $path = app_path("Services/{$name}.php");

        // Verifica si el archivo ya existe
        if (file_exists($path)) {
            $this->components->error("El servicio [{$path}] ya existe.");
            return;
        }

        // Crea el directorio si no existe
        (new Filesystem())->ensureDirectoryExists(app_path('Services'));

        // Plantilla de la clase de servicio
        $content = <<<PHP
<?php

namespace App\Services;

class {$name}
{
    // Agrega la lógica de tu servicio aquí
}
PHP;

        // Crea el archivo
        file_put_contents($path, $content);

        // Muestra un mensaje de éxito similar al estilo de Laravel
        $this->components->info("Service [{$path}] creado correctamente.");
    }
}
