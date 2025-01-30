"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formState, setFormState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // if (response.ok) {
      //   router.push("/");
      // } else {
      //   alert("Error en el login: " + data.message);
      // }
    } catch (error) {
      alert("Error en la conexión");
    }
  };

  const handleSendRecoveryCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/sendRecoveryCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setFormState("code");
      } else {
        alert("Error al enviar el codi de recuperació");
      }
    } catch (error) {
      alert("Error en la conexión");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/verifyCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (response.ok) {
        setFormState("newPassword");
      } else {
        alert("Error al verificar el codi");
      }
    } catch (error) {
      alert("Error en la conexión");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les contrasenyes no coincideixen");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code: verificationCode,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Contrasenya actualitzada correctament");
        setFormState("login");
      } else {
        alert("Error al actualitzar la contrasenya");
      }
    } catch (error) {
      alert("Error en la conexión");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <Image
          className="mx-auto"
          src="/images/logo_nombre.svg"
          alt="logo"
          width={150}
          height={58}
        />

        {formState === "login" && (
          <>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Campo de correo electrónico */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Introdueix el teu correu electrònic"
                />
              </div>

              {/* Campo de contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Contrasenya
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Introduïu la vostra contrasenya"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-[#3e3e3e] hover:shadow-lg transition-all duration-400"
              >
                Iniciar sessió
              </button>
            </form>

            <div className="text-center space-y-4">
              <button
                onClick={() => setFormState("email")}
                className="text-sm text-black hover:underline"
              >
                Has oblidat la contrasenya?
              </button>
              <div className="text-sm text-black">
                Nou a Ilinker?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-gray-400 hover:underline"
                >
                  Registrar-se
                </button>
              </div>
            </div>
          </>
        )}

        {formState === "email" && (
          <form onSubmit={handleSendRecoveryCode} className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-black">
              Recuperar contrasenya
            </h2>
            <div>
              <label
                htmlFor="recovery-email"
                className="block text-sm font-medium text-gray-600"
              >
                Correu electrònic
              </label>
              <input
                type="email"
                id="recovery-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ilinker@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-[#3e3e3e] hover:shadow-lg transition-all duration-400"
            >
              Enviar codi
            </button>
            <button
              type="button"
              onClick={() => setFormState("login")}
              className="w-full text-sm text-black hover:underline"
            >
              Tornar al login
            </button>
          </form>
        )}

        {formState === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <h2 className="text-xl font-bold text-center">Verificar codi</h2>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-600"
              >
                Codi de verificació
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                pattern="\d{6}"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="- - - - - -"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-[#3e3e3e] hover:shadow-lg transition-all duration-400"
            >
              Verificar codi
            </button>
          </form>
        )}

        {formState === "newPassword" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h2 className="text-xl font-bold text-center">Nova contrasenya</h2>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-600"
              >
                Nova contrasenya
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nova contrasenya"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-600"
              >
                Confirmar contrasenya
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirmar nova contrasenya"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-[#3e3e3e] hover:shadow-lg transition-all duration-400"
            >
              Actualitzar contrasenya
            </button>
          </form>
        )}
      </div>
    </div>
  );
}