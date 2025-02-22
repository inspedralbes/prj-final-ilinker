'use client'

import Image from "next/image"
import {AuthContext} from "@/contexts/AuthContext";
import {useContext, useEffect, useRef, useState} from "react";
import {apiRequest} from "@/communicationManager/communicationManager";


export default function CompanyProfileMeClient({}) {
    const {loggedIn, userData, logout} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("Acerca de");


    return (
        <div className="max-w-5xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
            {/* Columna Izquierda (Perfil de la empresa) */}
            <div className="w-full lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Banner */}
                <div className="relative h-40 w-full">
                    <Image src="/banner.jpg" alt="Banner" layout="fill" objectFit="cover" className="rounded-t-lg"/>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center">
                        <h2 className="text-lg font-bold">
                            Empower Your Future: <br/>
                            <span className="text-green-300">Earn, Grow, and Inspire with Projectum Cert</span>
                        </h2>
                    </div>
                </div>

                {/* Perfil de la empresa */}
                <div className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                        <Image src="/logo.png" alt="Logo" width={64} height={64} className="rounded-full"/>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Projectum Cert</h1>
                        <p className="text-gray-600 text-sm">
                            Formación profesional y coaching • Miami, Florida <br/> 15 seguidores • 2-10 empleados
                        </p>
                    </div>
                </div>

                {/* Botones */}
                <div className="px-4 flex space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                        + Seguir
                    </button>
                    <button className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center">
                        ✉ Enviar mensaje
                    </button>
                </div>

                {/* Navegación */}
                <div className="border-t mt-4">
                    <nav className="flex space-x-6 p-3 text-gray-600 text-sm">
                        {["Inicio", "Acerca de", "Publicaciones", "Empleos", "Personas"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 ${activeTab === tab ? "font-bold text-green-700 border-b-2 border-green-600" : "hover:text-black"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Columna Derecha (Anuncios y otras páginas vistas) */}
            <div className="w-full lg:w-1/4 space-y-6">
                {/* Anuncio */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <Image src="/ad.jpg" alt="Anuncio" width={300} height={200} className="w-full"/>
                    <div className="p-4">
                        <p className="text-sm font-bold">See who's hiring on LinkedIn.</p>
                    </div>
                </div>

                {/* Otras páginas vistas */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">Otras páginas vistas</h2>
                    <div className="flex items-center justify-between py-2 border-b">
                        <p className="text-sm">LPA Corporate Solutions</p>
                        <button className="bg-gray-200 text-black px-3 py-1 text-xs rounded-lg hover:bg-gray-300">
                            + Seguir
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <p className="text-sm">Niubox Legal | Digital</p>
                        <button className="bg-gray-200 text-black px-3 py-1 text-xs rounded-lg hover:bg-gray-300">
                            + Seguir
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}