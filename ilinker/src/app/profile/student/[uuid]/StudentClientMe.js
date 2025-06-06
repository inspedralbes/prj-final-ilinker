"use client"

import {BriefcaseIcon, Camera, Globe, Mail, MapPin, MessageCircle, Pencil, Phone, Share2, UserIcon} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import Select from "react-select";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Avatar} from "@/components/ui/avatar";
import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link"
import ModalInstitutions from "@/app/profile/student/[uuid]/ModalInstitutions";

export default function StudentClientMe({student}) {

    const [studentEdit, setStudentEdit] = useState(student);
    const [experienceEdit, setExperienceEdit] = useState(student.experience);
    const [educationEdit, setEducationEdit] = useState(student.education);
    const [projectsEdit, setProjectEdit] = useState(student.projects);
    const [skillsEdit, setSkillsEdit] = useState(student.skills);
    const [userEdit, setUserEdit] = useState(student.user);
    const [isEditing, setIsEditing] = useState(null);
    const [coverImage, setCoverImage] = useState("https://img.freepik.com/fotos-premium/fondo-tecnologico-purpura-elementos-codigo-e-iconos-escudo_272306-172.jpg?semt=ais_hybrid&w=740");
    const [logoImage, setLogoImage] = useState("https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png");
    const [modalState, setModalState] = useState(false);
    const [modalModeEdit, setModalModeEdit] = useState(false);
    const [jobData, setJobData] = useState(null);

    const handleOpenModalAddStudies = () => {
        setModalState(!modalState)
        setModalModeEdit(false)
        setJobData(null)
    }

    const handleCloseModal = () => {
        setModalState(false)
        setModalModeEdit(false)
        setJobData(null)
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Cover Photo */}
                <div className="relative h-80 bg-gray-300">
                    <img
                        src={studentEdit?.cover_photo ? `http://localhost:8000/storage/${studentEdit.cover_photo}` : coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <label className="absolute bottom-4 right-4 cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'cover_photo')}
                        />
                        <Camera className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70"/>
                    </label>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Section */}
                    <div className="relative -mt-32">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <div className="sm:flex sm:space-x-5">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            className="mx-auto h-40 w-40 rounded-lg border-4 border-white shadow-lg object-cover"
                                            src={studentEdit?.photo_pic ? `http://localhost:8000/storage/${studentEdit.photo_pic}` : logoImage}
                                            alt={studentEdit?.photo_pic}
                                        />
                                        <label className="absolute bottom-2 right-2 cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'logo')}
                                            />
                                            <Camera
                                                className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70"/>
                                        </label>
                                    </div>
                                    <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                                        {isEditing === 'basic' ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={institute.basic.name}
                                                    onChange={(e) => updateInstitute('basic', {
                                                        ...institute.basic,
                                                        name: e.target.value
                                                    })}
                                                    className="text-xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                                                />
                                                <input
                                                    type="text"
                                                    value={institute.basic.slogan}
                                                    onChange={(e) => updateInstitute('basic', {
                                                        ...institute.basic,
                                                        slogan: e.target.value
                                                    })}
                                                    className="text-lg text-gray-600 border rounded px-2 py-1 w-full"
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-5 w-5 text-gray-400"/>
                                                    <input
                                                        type="text"
                                                        value={institute.basic.location}
                                                        onChange={(e) => updateInstitute('basic', {
                                                            ...institute.basic,
                                                            location: e.target.value
                                                        })}
                                                        className="text-gray-600 border rounded px-2 py-1 flex-1"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleSave}
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Guardar
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{student?.name + " " + student.surname || "No tenemos este dato"}</h1>
                                                <p className={`text-lg text-gray-600 ${!student?.name ? 'hidden' : ''}`}>
                                                    {student?.name}
                                                </p>
                                                <p className="text-gray-500 flex items-center mt-2">
                                                    <MapPin className="h-5 w-5 text-gray-400 mr-2"/>
                                                    {student?.address}
                                                </p>
                                                <button
                                                    onClick={() => handleEdit('basic')}
                                                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                                                >
                                                    <Pencil className="h-4 w-4 mr-1"/>
                                                    Editar información básica
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-center sm:mt-0">
                                    <div className="flex space-x-2">
                                        <button
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            <MessageCircle className="h-5 w-5 mr-2 text-gray-400"/>
                                            Contactar
                                        </button>

                                        <button
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            <Share2 className="h-5 w-5 text-gray-400"/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center">
                                        <Globe className="h-5 w-5 text-gray-400 mr-2"/>
                                        <a href={student?.country || ""} className="text-blue-600 hover:underline">
                                            {student?.country || "No hay website vinculada"}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-gray-400 mr-2"/>
                                        <span className="text-gray-600">{student?.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-gray-400 mr-2"/>
                                        <span
                                            className="text-gray-600">{userEdit?.email || "Sin dirección de correo"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
                                    <button
                                        onClick={() => handleEdit('about')}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </button>
                                </div>
                                {isEditing === 'about' ? (
                                    <div>
                                    <textarea
                                        value={institute.basic.about}
                                        onChange={(e) => updateInstitute('basic', {
                                            ...institute.basic,
                                            about: e.target.value
                                        })}
                                        className="w-full h-32 p-2 border rounded"
                                    />
                                        <button
                                            onClick={handleSave}
                                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                ) : (
                                    <div dangerouslySetInnerHTML={{__html: studentEdit.description}}/>
                                )}
                            </div>
                        </div>

                        <Tabs defaultValue="inicio" className="w-full mt-5">
                            <TabsList
                                className="w-full justify-start h-auto p-0 bg-transparent border-b bg-white shadow-lg">
                                {/*<TabsTrigger*/}
                                {/*    value="inicio"*/}
                                {/*    className="  flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"*/}
                                {/*>*/}
                                {/*    <HomeIcon className="h-4 w-4"/>*/}
                                {/*    Inicio*/}
                                {/*</TabsTrigger>*/}
                                <TabsTrigger
                                    value="acerca"
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                                >
                                    <UserIcon className="h-4 w-4"/>
                                    Acerca de
                                </TabsTrigger>
                                {/*<TabsTrigger*/}
                                {/*    value="publicaciones"*/}
                                {/*    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"*/}
                                {/*>*/}
                                {/*    <NewspaperIcon className="h-4 w-4"/>*/}
                                {/*    Publicaciones*/}
                                {/*</TabsTrigger>*/}
                                <TabsTrigger
                                    value="studies"
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                                >
                                    <BriefcaseIcon className="h-4 w-4"/>
                                    Mis Estudios
                                </TabsTrigger>
                                {/*<TabsTrigger*/}
                                {/*    value="empleados"*/}
                                {/*    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"*/}
                                {/*>*/}
                                {/*    <UsersIcon className="h-4 w-4"/>*/}
                                {/*    Personas empleadas*/}
                                {/*</TabsTrigger>*/}
                            </TabsList>

                            <TabsContent value="inicio" className="mt-6 shadow-lg">
                                <Card className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Página principal</h2>
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-blue-800">Destacados</h3>
                                            <p className="text-blue-600 mt-2">
                                                Tech Company ha sido reconocida como una de las mejores empresas para
                                                trabajar en 2024
                                            </p>
                                        </div>
                                        <div className="border-t pt-4">
                                            <h3 className="font-semibold mb-2">Actividad reciente</h3>
                                            <div className="space-y-4">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div
                                                            className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"/>
                                                        <div>
                                                            <p className="font-medium">Nuevo logro alcanzado</p>
                                                            <p className="text-sm text-gray-500">Hace {i} días</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="acerca" className="mt-6">
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-xl font-semibold mb-4">Acerca de {studentEdit.name}</h2>
                                        <button
                                            onClick={() => handleEdit('description')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil className="h-4 w-4"/>
                                        </button>
                                    </div>

                                    {isEditing === "description" ? (
                                        <>
                                            <div className="mb-6">
                                                <Textarea
                                                    className="min-h-[150px]"
                                                    value={studentEdit.description}
                                                    onChange={(e) =>
                                                        setStudentEdit({
                                                            ...studentEdit,
                                                            description: e.target.value
                                                        })
                                                    }
                                                    placeholder="Escribe la descripción..."
                                                />
                                            </div>
                                        </>
                                    ) : (<>
                                        <div className="mb-6"
                                             dangerouslySetInnerHTML={{__html: studentEdit.description}}/>
                                    </>)}

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Información General */}
                                        <div className="">
                                            <h3 className="font-semibold mb-2">Información general</h3>

                                            {isEditing === "description" ? (
                                                <div className="space-y-3">
                                                    <Input
                                                        value={studentEdit.country}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            website: e.target.value
                                                        })}
                                                        placeholder="Sitio web"
                                                    />

                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={sectors}
                                                        isSearchable
                                                        isMulti
                                                        placeholder="Busca y selecciona..."
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(selectedOption) => {
                                                            console.log(selectedOption);
                                                            setStudentEdit({
                                                                ...studentEdit,
                                                                sectors: selectedOption
                                                            })
                                                        }}
                                                    />
                                                    <Input
                                                        value={studentEdit.postal_code}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            postal_code: e.target.value
                                                        })}
                                                        placeholder="Tamaño"
                                                    />
                                                    <Input
                                                        value={studentEdit.birthday}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            birthday: e.target.value
                                                        })}
                                                        placeholder="Año de fundación"
                                                    />
                                                </div>
                                            ) : (
                                                <ul className="space-y-2 text-gray-600">
                                                    <li><strong>Sitio web:</strong> {studentEdit.address}</li>

                                                    <li><strong>Codigo Postal:</strong> {studentEdit.postal_code}
                                                    </li>
                                                    <li><strong>Año de nacimiento:</strong> {studentEdit.birthday}</li>
                                                </ul>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Especialidades</h3>
                                            {isEditing === "description" ? (
                                                <>
                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={skills}
                                                        isSearchable
                                                        isMulti
                                                        placeholder="Busca y selecciona..."
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(selectedOption) => {
                                                            console.log(selectedOption);
                                                            setStudentEdit({...studentEdit, skills: selectedOption})
                                                        }}
                                                    />
                                                </>
                                            ) : (<>
                                                <div className="flex flex-wrap gap-2 text-gray-600">
                                                    {skillsEdit && skillsEdit.length > 0 ? (
                                                        skillsEdit.map((skill) => (
                                                            <Badge key={skill.id}
                                                                   className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md">
                                                                {skill.name} {/* Renderiza solo el nombre de la habilidad */}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500">No especificado</span>
                                                    )}
                                                </div>
                                            </>)
                                            }
                                        </div>

                                    </div>
                                    {/* Botón Guardar */}
                                    {isEditing && (
                                        <div className="flex justify-end mt-4">
                                            <Button onClick={() => handleSave()}>Guardar</Button>
                                        </div>
                                    )}
                                </Card>
                            </TabsContent>

                            <TabsContent value="publicaciones" className="mt-6 space-y-4">
                                {[1, 2, 3].map((post) => (
                                    <Card key={post} className="p-6">
                                        <div className="flex gap-4">
                                            <Avatar className="h-12 w-12">
                                                <img
                                                    src={`https://images.unsplash.com/photo-${1500000000000 + post}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                                    alt="Author"
                                                    className="aspect-square h-full w-full"
                                                />
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">María García</h3>
                                                        <p className="text-sm text-gray-500">Directora de Innovación</p>
                                                    </div>
                                                    <span className="text-sm text-gray-500">2h</span>
                                                </div>
                                                <p className="mt-2 text-gray-600">
                                                    Emocionados de anunciar nuestro nuevo proyecto de innovación en IA.
                                                    ¡Grandes cosas están por venir! #Innovación #TechCompany
                                                </p>
                                                <div className="mt-4 bg-gray-100 rounded-lg aspect-video"></div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="studies" className="mt-6 space-y-4">
                                {/* Botón para añadir una nueva oferta */}
                                <div className="flex justify-end">
                                    <Button
                                        className="bg-blue-600 text-white"
                                        onClick={() => handleOpenModalAddStudies()}  // Asumiendo que tienes una función para manejar el modal de añadir oferta
                                    >
                                        Añadir Estudios
                                    </Button>
                                </div>

                                <Card className="p-6 mt-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-xl font-semibold mb-4">Estudios de {studentEdit.name}</h2>
                                        <button
                                            onClick={() => handleEdit('studies')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil className="h-4 w-4"/>
                                        </button>
                                    </div>

                                    <div className="gap-6">
                                        {/* Información General */}
                                        <div className="">
                                            {isEditing === "studies" ? (
                                                <div className="space-y-3">

                                                    <Input
                                                        value={studentEdit.country}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            website: e.target.value
                                                        })}
                                                        placeholder="Sitio web"
                                                    />

                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={sectors}
                                                        isSearchable
                                                        isMulti
                                                        placeholder="Busca y selecciona..."
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(selectedOption) => {
                                                            console.log(selectedOption);
                                                            setStudentEdit({
                                                                ...studentEdit,
                                                                sectors: selectedOption
                                                            })
                                                        }}
                                                    />
                                                    <Input
                                                        value={studentEdit.postal_code}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            postal_code: e.target.value
                                                        })}
                                                        placeholder="Tamaño"
                                                    />
                                                    <Input
                                                        value={studentEdit.birthday}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            birthday: e.target.value
                                                        })}
                                                        placeholder="Año de fundación"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {educationEdit && educationEdit.length > 0 ? (
                                                        educationEdit.map((studies) => (
                                                            <Card
                                                                className="overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md"
                                                                key={studies.id || studies.institute}>
                                                                <div className="p-5">
                                                                    <div className="flex items-start gap-4">
                                                                        {/* Imagen a la izquierda */}
                                                                        <div className="flex-shrink-0">
                                                                            <Image
                                                                                src={
                                                                                    studies.institution && studies.institution.logo
                                                                                        ? studies.institution.logo
                                                                                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiI8bK0w9ZqoX3JybXl_26MloLwBwjdsWLIw&s'
                                                                                }
                                                                                alt="Logo del instituto"
                                                                                className="object-cover rounded"
                                                                                width={80}
                                                                                height={80}
                                                                            />
                                                                        </div>

                                                                        {/* Contenido a la derecha de la imagen */}
                                                                        <div className="flex-grow">
                                                                            <div
                                                                                className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                                                {studies.institution_id ? (
                                                                                    <Link
                                                                                        href={`/profile/institution/${studies.institution.slug}`}

                                                                                        passHref>
                                                                                        <span
                                                                                            className="font-semibold text-lg text-blue-600 hover:underline cursor-pointer">
                                                                                            {studies.institute}
                                                                                        </span>
                                                                                    </Link>
                                                                                ) : (
                                                                                    <h3 className="font-semibold text-lg text-gray-900">{studies.institute}</h3>
                                                                                )}

                                                                                <span
                                                                                    className="text-sm text-gray-500 mt-1 sm:mt-0">
                                                                                    {studies.start_date} - {studies.end_date || "Cursando"}
                                                                                </span>
                                                                            </div>
                                                                            <div
                                                                                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm inline-block font-medium mt-1">
                                                                                {studies.degree}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        ))
                                                    ) : (
                                                        <div
                                                            className="py-8 text-center border border-dashed border-gray-300 rounded-lg">
                                                            <p className="text-gray-500">No hay estudios
                                                                especificados</p>
                                                            <button
                                                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                                + Añadir educación
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </Card>
                            </TabsContent>


                            <TabsContent value="empleados" className="mt-6">
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold">Personas empleadas</h2>
                                        <div className="text-sm text-gray-500">1,234 empleados</div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4, 5, 6].map((employee) => (
                                            <div key={employee} className="flex gap-4 items-center">
                                                <Avatar className="h-16 w-16">
                                                    <img
                                                        src={`https://images.unsplash.com/photo-${1500000000000 + employee}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                                        alt="Employee"
                                                        className="aspect-square h-full w-full"
                                                    />
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">Juan Pérez</h3>
                                                    <p className="text-gray-600">Software Engineer</p>
                                                    <p className="text-sm text-gray-500">Madrid, España</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
            {
                modalState && <ModalInstitutions
                    handleClose={handleCloseModal}
                    isEditMode={modalModeEdit}
                    studentId={student.id}
                />
            }
        </>
    )
        ;
}