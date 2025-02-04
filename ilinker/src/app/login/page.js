"use client";
import Image from "next/image";
import { useCallback, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { apiRequest } from "@/communicationManager/communicationManager";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const router = useRouter();
  const [formState, setFormState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emptyFields, setEmptyFields] = useState({});
  const [apiError, setApiError] = useState("");

  const validateEmptyFields = (fields) => {
    const empty = {};
    Object.keys(fields).forEach((field) => {
      if (!fields[field].trim()) {
        empty[field] = "Este campo es obligatorio";
      }
    });
    setEmptyFields(empty);
    return Object.keys(empty).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");

    const isValid = validateEmptyFields({ email, password });

    if (isValid) {
      try {
        const response = await apiRequest("auth/login", "POST", {
          email,
          password,
        });
        console.log("login response", response);

        console.log("login response", response);

        if (response.status === "success") {
          router.push("/");
        } else {
          setApiError("Correu electrònic o contrasenya incorrectes");
        }
      } catch (error) {
        setApiError("Error de conexión con el servidor");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleSendRecoveryCode = async (e) => {
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

        if (response.success) {
          setFormState("code");
          setEmptyFields({});
        } else {
          setApiError("Error al enviar el código de recuperación");
        }
      } catch (error) {
        setApiError("Error de conexión con el servidor");
      }
    }
  };

  const handleVerifyCode = async (e) => {
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

        if (response.success) {
          setFormState("newPassword");
          setEmptyFields({});
        } else {
          setApiError("Código de verificación incorrecto");
        }
      } catch (error) {
        setApiError("Error de conexión con el servidor");
      }
    }
  };

  const handleResetPassword = async (e) => {
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

        if (response.success) {
          setFormState("login");
          setEmptyFields({});
        } else {
          setApiError("Error al actualizar la contraseña");
        }
      } catch (error) {
        setApiError("Error de conexión con el servidor");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
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
                <Input
                  id="password"
                  type="password"
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
                {emptyFields.password && (
                  <p className="text-red-500 text-sm">{emptyFields.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>

              <br></br>
              <p>─────────────── OR ───────────────</p>
              <br></br>
            </form>
          )}

          {/*Hacer login con Google  */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Iniciar sesión con Google
            </Button>
          </div>

          {formState === "email" && (
            <form onSubmit={handleSendRecoveryCode} className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
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
              <Button type="submit" className="w-full">
                Enviar código
              </Button>
            </form>
          )}

          {formState === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
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
              <Button type="submit" className="w-full">
                Verificar código
              </Button>
            </form>
          )}

          {formState === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
                Nueva contraseña
              </h2>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
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
                {emptyFields.newPassword && (
                  <p className="text-red-500 text-sm">
                    {emptyFields.newPassword}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
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
                {emptyFields.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {emptyFields.confirmPassword}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
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
                className="text-sm"
              >
                ¿Has olvidado la contraseña?
              </Button>
              <div className="text-sm text-center">
                ¿Nuevo en Ilinker?{" "}
                <Button
                  variant="link"
                  onClick={() => router.push("/register")}
                  className="text-gray-400"
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
              className="text-sm"
            >
              Volver al login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
