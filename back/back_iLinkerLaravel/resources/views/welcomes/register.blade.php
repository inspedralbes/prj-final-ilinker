<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a iLinker</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .email-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 30px 20px;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }

        .header .logo {
            font-size: 40px;
            margin-bottom: 10px;
        }

        .content {
            padding: 30px;
        }

        .welcome-message {
            text-align: center;
            margin-bottom: 30px;
        }

        .welcome-message h2 {
            color: #667eea;
            font-size: 24px;
            margin-bottom: 10px;
        }

        .role-specific {
            background-color: #f8f9ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }

        .info-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .info-item strong {
            color: #667eea;
            display: block;
            margin-bottom: 5px;
        }

        .cta-section {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
        }

        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin-top: 15px;
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            background: #f0f0f0;
            color: #764ba2;
        }

        .features-list {
            list-style: none;
            padding: 0;
        }

        .features-list li {
            padding: 8px 0;
            padding-left: 30px;
            position: relative;
        }

        .features-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
            font-size: 16px;
        }

        .footer {
            background: #2d3748;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 14px;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
        }

        .social-links {
            margin: 15px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            font-size: 18px;
            text-decoration: none;
        }

        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }

            body {
                padding: 10px;
            }

            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<div class="email-container">
    <!-- Header -->
    <div class="header">
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu plataforma de conexión profesional</p>
    </div>

    <!-- Content -->
    <div class="content">
        <!-- Welcome Message -->
        <div class="welcome-message">
            <h2>¡Bienvenido, {{ $user->name }}!</h2>
            <p style="font-size: 16px; color: #666;">
                Nos alegra mucho tenerte en nuestra comunidad. Tu registro se ha completado exitosamente.
            </p>
        </div>

        <!-- Role Specific Content -->
        @switch($user->rol)
            @case('student')
                <div class="role-specific">
                    <h3 style="color: #667eea; margin-top: 0;">👨‍🎓 Información del Estudiante</h3>
                    <p>Como estudiante en iLinker, tendrás acceso a increíbles oportunidades de crecimiento
                        profesional.</p>

                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Nombre Completo:</strong>
                            {{ $user->name }} {{ $user->lastname ?? '' }}
                        </div>
                        <div class="info-item">
                            <strong>Email de Accesso:</strong>
                            {{ $user->email }}
                        </div>
                    </div>

                    <h4 style="color: #667eea;">¿Qué puedes hacer ahora?</h4>
                    <ul class="features-list">
                        <li>Crear y optimizar tu perfil profesional</li>
                        <li>Buscar ofertas de prácticas y empleos</li>
                        <li>Conectar con empresas de tu sector</li>
                        <li>Acceder a recursos de desarrollo profesional</li>
                        <li>Participar en eventos y networking</li>
                    </ul>
                </div>
                @break

            @case('company')
                <div class="role-specific">
                    <h3 style="color: #667eea; margin-top: 0;">🏢 Información de la Empresa</h3>
                    <p>Bienvenido al lugar donde encontrarás el mejor talento joven para tu empresa.</p>

                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Representante:</strong>
                            {{ $user->name }} {{ $user->lastname ?? '' }}
                        </div>
                        <div class="info-item">
                            <strong>Email Accesso:</strong>
                            {{ $user->email }}
                        </div>

                    </div>

                    <h4 style="color: #667eea;">Servicios disponibles para tu empresa:</h4>
                    <ul class="features-list">
                        <li>Publicar ofertas de empleo y prácticas</li>
                        <li>Acceder a una base de datos de candidatos cualificados</li>
                        <li>Filtrar perfiles por especialidades y habilidades</li>
                        <li>Conectar directamente con instituciones educativas</li>
                    </ul>
                </div>
                @break

            @case('institution')
                <div class="role-specific">
                    <h3 style="color: #667eea; margin-top: 0;">🎓 Información del Instituto</h3>
                    <p>Como institución educativa, serás el puente entre tus estudiantes y el mundo profesional.</p>

                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Coordinador:</strong>
                            {{ $user->name }} {{ $user->lastname ?? '' }}
                        </div>
                        <div class="info-item">
                            <strong>Email Accesso:</strong>
                            {{ $user->email }}
                        </div>
                    </div>

                    <h4 style="color: #667eea;">Herramientas para tu institución:</h4>
                    <ul class="features-list">
                        <li>Monitorear oportunidades disponibles</li>
                        <li>Establecer partnerships con empresas</li>
                        <li>Organizar eventos de networking</li>
                    </ul>
                </div>
                @break

            @default
                <div class="role-specific">
                    <h3 style="color: #667eea; margin-top: 0;">👤 Tu Información</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Nombre:</strong>
                            {{ $user->name }}
                        </div>
                        <div class="info-item">
                            <strong>Email de Accesso:</strong>
                            {{ $user->email }}
                        </div>
                    </div>
                </div>
        @endswitch

        <!-- Call to Action -->
        <div class="cta-section">
            <h3 style="color: white; margin-top: 0;">¡Completa tu perfil ahora!</h3>
            <p style="color: white; opacity: 0.9; margin-bottom: 0;">
                Para aprovechar al máximo iLinker, te recomendamos completar toda tu información de perfil.
            </p>
            <a href="{{ config('app.url_front') }}/publicacion" class="cta-button">
                Acceder a mi Dashboard
            </a>
        </div>

        <!-- Next Steps -->
        <div style="margin-top: 30px;">
            <h3 style="color: #667eea;">Próximos pasos recomendados:</h3>
            <ol style="padding-left: 20px; color: #666;">
                <li style="margin-bottom: 8px;">Completa tu perfil con toda tu información</li>
                <li style="margin-bottom: 8px;">Sube tu foto de perfil y CV actualizado</li>
                <li style="margin-bottom: 8px;">Explora las oportunidades disponibles</li>
                <li style="margin-bottom: 8px;">Conéctate con otros miembros de la comunidad</li>
            </ol>
        </div>

        <!-- Support Info -->
        <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h4 style="color: #667eea; margin-top: 0;">¿Necesitas ayuda?</h4>
            <p style="margin-bottom: 10px; color: #666;">
                Nuestro equipo de soporte está aquí para ayudarte. No dudes en contactarnos:
            </p>
            <p style="margin: 5px 0;">
                📧 Email: <a href="mailto:soporte@ilinker.com" style="color: #667eea;">soporte@ilinker.com</a>
            </p>
            <p style="margin: 5px 0;">
                📞 Teléfono: +34 666 188 934
            </p>
            <p style="margin: 5px 0;">
                🕒 Horario: Lunes a Viernes, 9:00 - 9:30
            </p>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="social-links">
            <a href="#">📘 Facebook</a>
            <a href="#">🐦 Twitter</a>
            <a href="#">💼 LinkedIn</a>
            <a href="#">📷 Instagram</a>
        </div>
        <p style="margin: 10px 0;">
            © {{ date('Y') }} iLinker. Todos los derechos reservados.
        </p>
        <p style="margin: 5px 0; font-size: 12px; opacity: 0.8;">
            Si no deseas recibir más emails, puedes
            <a href="{{ config('app.url') }}/unsubscribe">darte de baja aquí</a>
        </p>
    </div>
</div>
</body>
</html>
