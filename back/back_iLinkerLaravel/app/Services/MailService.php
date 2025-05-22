<?php

namespace App\Services;

use Mockery\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class MailService
{
    public function __construct()
    {

    }

    public function enviarMail($nombre, $email, $body, $pdfPath = null)
    {
        $mail = new PHPMailer(true);

        try {
            // Configuración del servidor SMTP
            $mail->isSMTP();
            $mail->Host = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth = true;
            $mail->Username = env('MAIL_USERNAME');
            $mail->Password = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION', 'ssl');
            $mail->Port = env('MAIL_PORT', 587);

            //Configurar Correo
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($email, $nombre);

            //Contenido del correo
            $mail->isHTML(true);
            $mail->Subject = 'Bienvenido a nuestro sistema';
            $mail->Body = $body;

            // Adjuntar el PDF si existe
            if ($pdfPath && file_exists($pdfPath)) {
                $mail->addAttachment($pdfPath, 'informacion_usuario.pdf');
            }

            //Enviar Correo
            $mail->send();
            return true;

        } catch (Exception $e) {
            return "Error al enviar el correo";
        }
    }
}
