'use client'

import Image from "next/image"
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, MoreHorizontal, UserPlus } from "lucide-react";

export default function CompanyProfileMeClient({}) {
    const { loggedIn, userData } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("acerca-de");

    const company = {
        "name": "Red Computer",
        "logo": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
        "coverImage": "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        "tagline": "Empowering People. Unlocking innovation.",
        "short_description": "Servicios y consultoría de TI",
        "description": "Red Computer es una empresa líder en servicios de tecnología e innovación digital que ayuda a las organizaciones a transformar sus negocios a través de soluciones tecnológicas avanzadas.",
        "location": "Barcelona, Catalonia",
        "followers": "125K",
        "employees": "501-1000",
        "website": "www.redcomputer.com",
        "email": "info@redcomputer.com",
        "phone": "698 532 147"
    };

    return (
        <div className="max-w-6xl mx-auto p-3">
            {/* Perfil Principal */}
            <Card className="mb-4 shadow-sm border-0 overflow-hidden" style={{ border: "3px solid black" }}>
                {/* Imagen de portada */}
                <div className="relative h-48 w-full bg-blue-900 overflow-hidden">
                    <Image
                        src={company.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute right-4 top-4 text-white font-bold flex items-center">
                        {company.name}
                    </div>
                </div>

                <div className="relative px-6 pb-6">
                    {/* Logo */}
                    <div className="absolute -top-16 left-6 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-white">
                        <Image
                            src={company.logo}
                            alt="Company Logo"
                            width={120}
                            height={120}
                            className="object-cover"
                        />
                    </div>

                    {/* Información de la empresa */}
                    <div className=" flex justify-between items-start">
                        <div className="mt-20">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{company.name}</h1>
                                <svg viewBox="0 0 24 24" width="24" height="24" className="text-blue-500">
                                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <p className="text-gray-600">{company.tagline}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {company.short_description} · {company.location} · {company.followers} seguidores · {company.employees} empleados
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <span className="flex items-center mr-4">
                                    <span className="w-6 h-6 rounded-full bg-gray-200 mr-2"></span>
                                    Martín y 2 antiguos alumnos más trabajan aquí
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <UserPlus className="h-4 w-4 mr-2" /> Seguir
                            </Button>
                            <Button variant="outline" className="border-blue-600 text-blue-600">
                                <MessageSquare className="h-4 w-4 mr-2" /> Enviar mensaje
                            </Button>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Pestañas */}
                <Tabs defaultValue="acerca-de" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="border-t border-b h-12 bg-transparent justify-start rounded-none px-6">
                        <TabsTrigger value="inicio" className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none h-full">
                            Inicio
                        </TabsTrigger>
                        <TabsTrigger value="acerca-de" className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none h-full">
                            Acerca de
                        </TabsTrigger>
                        <TabsTrigger value="publicaciones" className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none h-full">
                            Publicaciones
                        </TabsTrigger>
                        <TabsTrigger value="empleos" className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none h-full">
                            Empleos
                        </TabsTrigger>
                        <TabsTrigger value="vida-empresa" className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none h-full">
                            Vida en la empresa
                        </TabsTrigger>
                        <TabsTrigger value="personas" className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none h-full">
                            Personas
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </Card>

            {/* Contenido según la pestaña seleccionada */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2" style={{ border: "3px solid black" }}>
                    <Card className="shadow-sm border-0">
                        <CardHeader className="border-b pb-4">
                            <h2 className="text-xl font-bold">About {company.name}</h2>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-gray-700">{company.description}</p>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Información de contacto</h3>
                                    <ul className="mt-2 space-y-2">
                                        <li className="flex items-center text-gray-700">
                                            <span className="w-24 text-gray-500">Sitio web:</span>
                                            <a href={`https://${company.website}`} className="text-blue-600 hover:underline">{company.website}</a>
                                        </li>
                                        <li className="flex items-center text-gray-700">
                                            <span className="w-24 text-gray-500">Teléfono:</span>
                                            <span>{company.phone}</span>
                                        </li>
                                        <li className="flex items-center text-gray-700">
                                            <span className="w-24 text-gray-500">Email:</span>
                                            <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">Ubicación</h3>
                                    <p className="mt-2 text-gray-700">{company.location}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                    <div className="col-span-1" style={{ border: "3px solid black" }}>
                    {/* Sidebar con empleos recomendados */}
                    <Card className="shadow-sm border-0 mb-4">
                        <CardHeader className="pb-2">
                            <h3 className="font-medium">Empleos en {company.name}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">Descubre empleos que coincidan con tus aptitudes</p>
                            <Button className="w-full mt-4">Ver empleos</Button>
                        </CardContent>
                    </Card>

                    {/* Anuncios */}
                    <Card className="shadow-sm border-0">
                        <CardHeader className="pb-2">
                            <h3 className="font-medium">Personas que podrías conocer</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                        <div>
                                            <p className="font-medium">Nombre del empleado</p>
                                            <p className="text-xs text-gray-500">{company.name}</p>
                                            <Button variant="outline" size="sm" className="mt-1">
                                                <UserPlus className="h-3 w-3 mr-1" /> Conectar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}