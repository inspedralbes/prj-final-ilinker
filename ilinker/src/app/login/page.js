"use client";
import Image from "next/image";
import { useState } from "react";

export default  function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // Enviar los datos al backend
    // const response = await fetch("http://localhost:3000/api/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password }),
    // });

    // const data = await response.json();
    // console.log("Datos enviados:", data);
  };

  // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula un retraso
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-2 border border-gray-300  text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Introduïu la vostra contrasenya"
            />
          </div>

          {/* Botón de login */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-[#3e3e3e] hover:shadow-lg transition-all duration-400"
            >
              Login
            </button>
          </div>
        </form>

        {/* Link para recuperar la contraseña */}
        <div className="text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
