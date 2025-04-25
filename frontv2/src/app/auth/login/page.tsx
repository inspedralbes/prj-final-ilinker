"use client"

import Image from "next/image";
import { useCallback, useContext, useState } from "react";
import React from "react"
import config from "@/types/config";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import { apiRequest } from "@/services/requests/apiRequest";


const Login: React.FC = () => {
    const router = useRouter();
    const [formState, setFormState] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    interface EmptyFields {
        email?: string;
        password?: string;
        code?: string;
        newPassword?: string;
        confirmPassword?: string;
    }
    
    const [emptyFields, setEmptyFields] = useState<EmptyFields>({});
    const [apiError, setApiError] = useState("");
    const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isBtnLoader, setIsBtnLoader] = useState(false);

    const { showLoader, hideLoader } = useContext(LoaderContext);

    const validateEmptyFields = (fields: Record<string, string>) => {
        const empty: EmptyFields = {};
        Object.keys(fields).forEach((field) => {
            if (!fields[field].trim()) {
                (empty as any)[field] = "Este campo es obligatorio";
            }
        });
        setEmptyFields(empty);
        return Object.keys(empty).length === 0;
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        showLoader();
        setApiError("");
        
        try {
            // Get CSRF token before login attempt
            await fetch(`${config.apiUrl}/sanctum/csrf-cookie`, {
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error getting CSRF token:', error);
        }


        const isValid = validateEmptyFields({ email, password });
        console.log(isValid)
        if (isValid) {
            try {
                const response = await apiRequest("auth/login", "POST", {
                    email,
                    password,
                });
                console.log("login response", response);

                if (response.status === "success") {
                    router.push("/search");
                    login(response.token, response.user);
                } else {
                    setApiError("Correu electrònic o contrasenya incorrectes");
                }
            } catch (error) {
                setApiError("Error de conexión con el servidor");
            } finally {
                hideLoader();
            }
        }else{
            hideLoader();
        }
    };

    const handleGoogleLogin = async () => {
        try {
            console.log("Iniciando login con Google...");
           

        } catch (error) {
            console.error("Error detallado del login con Google:", error);
        }
    };

    const handleSendRecoveryCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError("");

        const isValid = validateEmptyFields({
            email,
        });

        if (isValid) {
            try {
                const response = await apiRequest("auth/sendRecoveryCode", "POST", {
                    email,
                });

                if (response.status === "success") {
                    setFormState("code");
                    setEmptyFields({});
                    console.log("Código de recuperación enviado correctamente", response);
                } else {
                    console.log("Error al enviar el código de recuperación", response);
                    setApiError("Error al enviar el código de recuperación");
                }
            } catch (error) {
                setApiError("Error de conexión con el servidor");
            }
        }
    };

    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError("");

        const isValid = validateEmptyFields({
            code: verificationCode,
        });

        if (isValid) {
            try {
                const response = await apiRequest("auth/verifyCode", "POST", {
                    email,
                    code: verificationCode,
                });

                if (response.status === "success") {
                    setFormState("newPassword");
                    setEmptyFields({});
                    console.log("Código verificado correctamente", response);
                } else {
                    setApiError("Código de verificación incorrecto");
                }
            } catch (error) {
                setApiError("Error de conexión con el servidor");
            }
        }
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError("");

        const isValid = validateEmptyFields({
            newPassword,
            confirmPassword,
        });

        if (isValid) {
            if (newPassword !== confirmPassword) {
                setApiError("Las contraseñas no coinciden");
                return;
            }

            try {
                const response = await apiRequest("auth/resetPassword", "POST", {
                    email,
                    code: verificationCode,
                    password: newPassword,
                });

                if (response.status === "success") {
                    setFormState("login");
                    setEmptyFields({});
                    console.log("Contraseña restablecida correctamente", response);
                } else {
                    setApiError("Error al actualizar la contraseña");
                }
            } catch (error) {
                setApiError("Error de conexión con el servidor");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="space-y-2">
                    <div className="flex justify-center">
                        <Image
                            src="/images/logo_nombre.svg"
                            alt="logo"
                            width={150}
                            height={58}
                        />
                    </div>
                    {apiError && (
                        <Alert variant="destructive">
                            <AlertDescription>{apiError}</AlertDescription>
                        </Alert>
                    )}
                </CardHeader>

                <CardContent>
                    {formState === "login" && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (e.target.value.trim()) {
                                            setEmptyFields((prev) => ({ ...prev, email: undefined }));
                                        }
                                    }}
                                    placeholder="Introduce tu correo electrónico"
                                    className={emptyFields.email ? "border-red-500" : ""}
                                />
                                {emptyFields.email && (
                                    <p className="text-red-500 text-sm">{emptyFields.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (e.target.value.trim()) {
                                                setEmptyFields((prev) => ({
                                                    ...prev,
                                                    password: undefined,
                                                }));
                                            }
                                        }}
                                        placeholder="Introduce tu contraseña"
                                        className={emptyFields.password ? "border-red-500" : ""}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                {emptyFields.password && (
                                    <p className="text-red-500 text-sm">{emptyFields.password}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-800"
                                disabled={isBtnLoader}
                            >
                                {isBtnLoader ? (
                                    <Loader className="h-4 w-4" />
                                ) : (
                                    "Iniciar sesión"
                                )}
                            </Button>

                            <div className="my-6">
                                <p className="text-center text-gray-500">
                                    ─────────────── O ────────────────
                                </p>
                            </div>

                            {/* Login with Google */}
                            <div className="flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-gray-50 border-gray-300"
                                    onClick={handleGoogleLogin}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>Iniciar sesión con Google</span>
                                </Button>
                            </div>
                        </form>
                    )}

                    {formState === "email" && (
                        <form onSubmit={handleSendRecoveryCode} className="space-y-6">
                            <h2 className="text-xl font-semibold text-center text-gray-800">
                                Recuperar contraseña
                            </h2>
                            <div className="space-y-2">
                                <Label htmlFor="recovery-email">Correo electrónico</Label>
                                <Input
                                    id="recovery-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (e.target.value.trim()) {
                                            setEmptyFields((prev) => ({ ...prev, email: undefined }));
                                        }
                                    }}
                                    placeholder="correo@ejemplo.com"
                                    className={emptyFields.email ? "border-red-500" : ""}
                                />
                                {emptyFields.email && (
                                    <p className="text-red-500 text-sm">{emptyFields.email}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-800"
                            >
                                Enviar código
                            </Button>
                        </form>
                    )}

                    {formState === "code" && (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <h2 className="text-xl font-semibold text-center text-gray-800">
                                Verificar código
                            </h2>
                            <div className="space-y-2">
                                <Label htmlFor="code">Código de verificación</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => {
                                        setVerificationCode(e.target.value);
                                        if (e.target.value.trim()) {
                                            setEmptyFields((prev) => ({ ...prev, code: undefined }));
                                        }
                                    }}
                                    maxLength={6}
                                    placeholder="------"
                                    className={emptyFields.code ? "border-red-500" : ""}
                                />
                                {emptyFields.code && (
                                    <p className="text-red-500 text-sm">{emptyFields.code}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-800"
                            >
                                Verificar código
                            </Button>
                        </form>
                    )}

                    {formState === "newPassword" && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <h2 className="text-xl font-semibold text-center text-gray-800">
                                Nueva contraseña
                            </h2>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nueva contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (e.target.value.trim()) {
                                                setEmptyFields((prev) => ({
                                                    ...prev,
                                                    newPassword: undefined,
                                                }));
                                            }
                                        }}
                                        placeholder="Nueva contraseña"
                                        className={emptyFields.newPassword ? "border-red-500" : ""}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {emptyFields.newPassword && (
                                    <p className="text-red-500 text-sm">
                                        {emptyFields.newPassword}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (e.target.value.trim()) {
                                                setEmptyFields((prev) => ({
                                                    ...prev,
                                                    confirmPassword: undefined,
                                                }));
                                            }
                                        }}
                                        placeholder="Confirmar contraseña"
                                        className={
                                            emptyFields.confirmPassword ? "border-red-500" : ""
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {emptyFields.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {emptyFields.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-800"
                            >
                                Actualizar contraseña
                            </Button>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    {formState === "login" && (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => setFormState("email")}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                ¿Has olvidado la contraseña?
                            </Button>
                            <div className="text-sm text-center text-gray-600">
                                ¿Nuevo en Ilinker?{" "}
                                <Button
                                    variant="link"
                                    onClick={() => router.push("/register")}
                                    className="text-black-400 hover:text-gray-800"
                                >
                                    Registrarse
                                </Button>
                            </div>
                        </>
                    )}
                    {formState !== "login" && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setFormState("login");
                                setApiError("");
                                setEmptyFields({});
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            Volver al login
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default Login;
