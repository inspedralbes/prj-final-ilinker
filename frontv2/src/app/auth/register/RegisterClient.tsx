'use client'

import {useState, useEffect, useContext} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {useDropzone} from 'react-dropzone';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {useForm, FormProvider} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {apiRequest} from "@/services/requests/apiRequest";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import Cookies from "js-cookie";
import {AuthContext} from "@/contexts/AuthContext";


export default function RegisterClient({countries, sectors}: {countries: any, sectors: any}) {
    const {toast} = useToast();
    const router = useRouter();
    const {login} = useContext(AuthContext);
    const stepSchemas = [
        // Step 1 validation schema
        yup.object({
            name: yup.string().required("El nombre es obligatorio"),
            surname: yup.string().required("Los apellidos son obligatorios"),
            birthday: yup.date().required("La fecha de nacimiento es obligatoria"),
            email: yup
                .string()
                .email("Debe ser un correo válido")
                .required("El correo es obligatorio"),
            password: yup.string().required("La constraseña es obligatorio"),
            rol: yup.string().required("El rol es obligatorio"),
        }),
        // Step 2 validation schema
        yup.object({
            company: yup.object().when('rol', {
                is: 'empresa',
                then: () => yup.object({
                    name: yup.string().required("El nombre es obligatorio"),
                    phone: yup.string().required("El teléfono es obligatorio"),
                    CIF: yup.string().required("El CIF/NIF es obligatorio"),
                    address: yup.string().required("La dirección es obligatoria"),
                }),
                otherwise: () => yup.object().nullable()
            }),
            institution: yup.object().when('rol', {
                is: 'instituto',
                then: () => yup.object({
                    name: yup.string().required("El nombre es obligatorio"),
                    email: yup.string().required("El email es obligatorio"),
                    phone: yup.string().required("El teléfono es obligatorio"),
                    cif_nif: yup.string().required("El CIF/NIF es obligatorio"),
                    type: yup.string().required("El tipo es obligatorio"),
                    address: yup.string().required("La dirección es obligatoria"),
                }),
                otherwise: () => yup.object().nullable()
            }),
            student: yup.object().when('rol', {
                is: 'student',
                then: () => yup.object({
                    type_document: yup.string().required("El tipo de documento es necesario."),
                    id_document: yup.string().required('El ID del documento es necesario.'),
                    country:  yup.string().required('El campo de pais es necesario.'),
                    city: yup.string().required('La ciudad es un campo necesario.'),
                    address: yup.string().required('La dirección es un campo necesario.'),
                    phone: yup.number().required('El numero de telefono es un campo necesario.')
                })
            })
        }),
        yup.object({
            company: yup.object().when('rol', {
                is: 'empresa',
                then: () => yup.object({
                    logo: yup.string(), // Ya no es requerido
                    short_description: yup.string(), // Ya no es requerido
                    sectors: yup
                        .array()
                        .of(
                            yup.object({
                                id: yup.number().required(),
                                name: yup.string().required(),
                            })
                        )
                        .nullable(),
                }),
                otherwise: () => yup.object().nullable()
            }),
        })
    ];
    const animatedComponents = makeAnimated();
    const [totalSteps, setTotalSteps] = useState(2);
    const [step, setStep] = useState(1);
    const [cities, setCities] = useState([]);
    const methods = useForm({
        resolver: yupResolver(stepSchemas[step - 1] as any),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            surname: "",
            birthday: "",
            email: "",
            password: "",
            rol: "student",
            student: {
                type_document: "",
                id_document: null,
                phone: null,
                address: "",
                city: "",
                country: "",
                postal_code: "",
                // "skills": [],
                languages: []
            },
            company: {
                name: "dsadsadas",
                phone: "",
                CIF: "",
                short_description: "",
                logo: "",
                address: "",
                sectors: [],
            },
            institution: {
                name: "",
                cif_nif: "",
                type: "",
                academic_sector: "",
                logo: "",
                phone: null,
                email: "",
                website: "",
                responsible_phone: null,
                position: "",
                address: "",
                city: "",
                country: "",
                postal_code: ""
            },
        },
    });
    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        fechaNacimiento: "",
        email: "",
        rol: "estudiante",
        carrera: "",
        universidad: "",
        semestre: "",
        company: {
            name: "",
            phone: "",
            cif_nif: "",
            short_description: "",
            logo: "",
            address: "",
            sectors: [],
        },
        nombreInstituto: "",
        tipo: "",
        ubicacion: "",
    });

    useEffect(() => {
        switch (methods.watch('rol')) {
            case 'student':
                setTotalSteps(2); // Información personal + académica
                break;
            case 'company':
                setTotalSteps(3); // Información personal + empresa (2 pasos) + opcional
                break;
            case 'institutions':
                setTotalSteps(2); // Información personal + instituto
                break;
            default:
                setTotalSteps(2); // Valor por defecto
        }
    }, [methods.watch('rol')]);
    useEffect(() => {
        console.log(cities)
    }, [cities])

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*' as any,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length) {
                const imageUrl = URL.createObjectURL(acceptedFiles[0]);
                methods.setValue("company.logo", imageUrl);
            }
        },
    });
    const handleRemoveImage = () => {
        methods.setValue("company.logo", "");
    };
    const handleInputChange = (e: any) => {
        const {name, value} = e.target;

        if (name.startsWith('company_')) {
            setFormData((prevData) => ({
                ...prevData,
                company: {
                    ...prevData.company,
                    [name.replace('company_', '')]: value,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    const handleNext = () => {
        setStep(step + 1);
    };
    const onSubmit = async (data: any) => {
        console.log("Datos del formulario:", data); // Enviar el formulario

        if (step < totalSteps) {
            setStep(step + 1); // Avanzar al siguiente paso
        } else {
            console.log("Datos del formulario:", data); // Enviar el formulario
            // auth/register
            const response = await apiRequest('auth/register', "POST", data);
            console.log(response)

            if (response.status === 'success') {
                router.push("/");
                login(response.token, response.user, response.notifications);
                toast({
                    title: "Se ha iniciado sesion correctamente",
                    description: "Las credenciales son correctas.",
                    variant: "success"
                })
            }
        }
    };
    const handleBack = () => {
        setStep(step - 1);
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Datos del formulario:', formData);
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información Personal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-darkGray mb-2">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        {...methods.register("name")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.name?.message}</p>
                </div>
                <div>
                    <label htmlFor="apellidos" className="block text-sm font-medium text-darkGray mb-2">
                        Apellidos
                    </label>
                    <input
                        type="text"
                        id="apellidos"
                        {...methods.register("surname")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.surname?.message}</p>
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-darkGray mb-2">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    {...methods.register("email")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                />
                <p className="text-sm text-red-600">{methods.formState.errors.email?.message}</p>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-darkGray mb-2">
                    Contraseñas
                </label>
                <input
                    type="password"
                    id="password"
                    {...methods.register("password")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                />
                <p className="text-sm text-red-600">{methods.formState.errors.password?.message}</p>
            </div>
            <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-darkGray mb-2">
                    Fecha de Nacimiento
                </label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    {...methods.register("birthday")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                />
                <p className="text-sm text-red-600">{methods.formState.errors.birthday?.message}</p>
            </div>
            <div>
                <label htmlFor="rol" className="block text-sm font-medium text-darkGray mb-2">
                    Tipo de Usuario
                </label>
                <select
                    id="rol"
                    {...methods.register("rol")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                >
                    <option value="student">Estudiante</option>
                    <option value="company">Empresa</option>
                    <option value="institutions">Instituto</option>
                </select>
                <p className="text-sm text-red-600">{methods.formState.errors.rol?.message}</p>
            </div>
        </div>
    );

    const renderStep2Estudiante = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información Académica</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="student_type_document" className="block text-sm font-medium text-darkGray mb-2">
                        Tipo de Documento
                    </label>
                    <select
                        id="student_type_document"
                        {...methods.register("student.type_document")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    >
                        <option value="DNI">DNI</option>
                        <option value="NIE">NIE</option>
                        <option value="PASAPORTE">Pasaporte</option>
                    </select>
                    <p className="text-sm text-red-600">{methods.formState.errors.student?.type_document?.message}</p>
                </div>
                <div>
                    <label htmlFor="id_document" className="block text-sm font-medium text-darkGray mb-2">
                        Documento
                    </label>
                    <input
                        type="text"
                        id="id_document"
                        {...methods.register("student.id_document")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.student?.id_document?.message}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="student_country" className="block text-sm font-medium text-darkGray mb-2">
                        Pais de residencia
                    </label>
                    <Select
                        components={animatedComponents}
                        options={countries}
                        isSearchable
                        placeholder="Busca y selecciona un país..."
                        getOptionLabel={(option: any) => (
                            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <img
                                    src={option.flags.svg}
                                    alt={option.name.common}
                                    style={{width: "20px", height: "15px", borderRadius: "3px"}}
                                />
                                {option.name.common}
                            </div>
                        )}
                        getOptionValue={(option) => option.cca3}
                        filterOption={(candidate, input) => {
                            const label = candidate.data.name.common.toLowerCase();
                            const searchTerm = input.toLowerCase();
                            return label.includes(searchTerm);
                        }}
                        onChange={(selectedOption) => {
                            console.log("País seleccionado:", selectedOption);
                            const option = selectedOption.name.common;
                            methods.setValue('student.country', option);

                            async function fetchCountries() {
                                const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({"country": selectedOption.name.common})
                                });
                                let data = null;
                                data = await response.json();

                                console.log(data)
                                if (!data.error) {
                                    const cityOptions = data.data.map((city: any) => ({
                                        label: city,
                                        value: city
                                    }));
                                    setCities(cityOptions);
                                }
                            }

                            fetchCountries();
                        }}
                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.student?.country?.message}</p>
                </div>
                <div>
                    <label htmlFor="student_cities" className="block text-sm font-medium text-darkGray mb-2">
                        Ciudad de residencia
                    </label>
                    <Select
                        components={animatedComponents}
                        options={cities}
                        isSearchable
                        placeholder="Busca tu ciudad..."
                        onChange={(selectedOption: any) => {
                            console.log("Ciudad seleccionado:", selectedOption);
                            const option = selectedOption.label
                            methods.setValue('student.city', option);
                        }}
                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.student?.city?.message}</p>
                </div>
            </div>
            <div>
                <label htmlFor="student_address" className="block text-sm font-medium text-darkGray mb-2">
                    Dirección
                </label>
                <input
                    type="text"
                    id="student_address"
                    {...methods.register("student.address")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                />
                <p className="text-sm text-red-600">{methods.formState.errors.student?.address?.message}</p>
            </div>
            <div>
                <label htmlFor="student_phone" className="block text-sm font-medium text-darkGray mb-2">
                    Numero de telefono
                </label>
                <input
                    type="text"
                    id="student_phone"
                    {...methods.register("student.phone")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                />
                <p className="text-sm text-red-600">{methods.formState.errors.student?.phone?.message}</p>
            </div>
            {/*<div>*/}
            {/*    <label htmlFor="student_lenguages" className="block text-sm font-medium text-darkGray mb-2">*/}
            {/*        Dirección*/}
            {/*    </label>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        id="student_lenguages"*/}
            {/*        {...methods.register("student.address")}*/}
            {/*        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"*/}
            {/*    />*/}
            {/*    <p className="text-sm text-red-600">{methods.formState.errors.student?.address?.message}</p>*/}
            {/*</div>*/}
        </div>
    );

    const renderStep2Empresa = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información de la Empresa</h2>
            <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-darkGray mb-2">
                    Nombre de la Empresa
                </label>
                <input
                    type="text"
                    id="company_name"
                    // name="company_name"
                    // value={formData.company.name}
                    // onChange={handleInputChange}
                    {...methods.register("company.name")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                />
                <p className="text-sm text-red-600">{methods.formState.errors.company?.name?.message}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="company_phone" className="block text-sm font-medium text-darkGray mb-2">
                        Telefono de contacto
                    </label>
                    <input
                        type="text"
                        id="company_phone"
                        // name="company_phone"
                        // value={formData.company.phone}
                        // onChange={handleInputChange}
                        {...methods.register("company.phone")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.company?.phone?.message}</p>
                </div>
                <div>
                    <label htmlFor="company_cif_nif" className="block text-sm font-medium text-darkGray mb-2">
                        Identificació fiscal (C.I.F o N.I.F)
                    </label>
                    <input
                        type="text"
                        id="company_cif_nif"
                        // name="company_cif_nif"
                        // value={formData.company.cif_nif}
                        // onChange={handleInputChange}
                        {...methods.register("company.CIF")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.company?.CIF?.message}</p>
                </div>
            </div>
            <div>
                <label htmlFor="company_address" className="block text-sm font-medium text-darkGray mb-2">
                    Dirección de la empresa
                </label>
                <input
                    id="company_address"
                    type="text"
                    // name="company_address"
                    // value={formData.company.address}
                    // onChange={handleInputChange}
                    {...methods.register("company.address")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    placeholder="Ingresa la dirección de la empresa"

                />
                <p className="text-sm text-red-600">{methods.formState.errors.company?.address?.message}</p>
            </div>
        </div>
    );

    const renderStep3Empresa = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información extra opcional</h2>
            <div>
                <label htmlFor="company_logo" className="block text-sm font-medium text-darkGray mb-2">
                    Logo
                </label>
                <div className="relative">
                    {/* Mostrar el área de Drag and Drop solo si no hay una imagen cargada */}
                    {!methods.watch("company.logo") && ( // Verificar si el logo no está cargado
                        <div {...getRootProps()}
                             className="w-full h-[128px] px-4 py-2 rounded-lg border border-gray-200 mt-2 text-center cursor-pointer">
                            <input {...getInputProps()} id="company_logo" name="company_logo" accept="image/*"
                            />
                            <p className="text-sm text-gray-500">Drag & drop an image here, or click to select</p>
                        </div>
                    )}

                    {methods.watch("company.logo") && ( // Verificar si el logo ya está cargado
                        <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                            <img
                                src={methods.watch("company.logo")} // Usar watch para obtener el valor del logo
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                            />
                            {/* Botón para eliminar la imagen */}
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white px-1.5 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label htmlFor="sectores" className="block text-sm font-medium text-darkGray mb-2">
                    Selecciona Sectores
                </label>
                <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    defaultValue={[]}
                    isMulti
                    options={sectors}
                    isSearchable
                    placeholder="Busca y selecciona..."
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    onChange={(selectedOptions: any) => {
                        console.log(selectedOptions);
                        methods.setValue("company.sectors", selectedOptions)
                        methods.trigger("company.sectors"); // Asegurar que el formulario detecte el cambio

                    }
                    }
                />
            </div>
            <div>
                <label htmlFor="company_short_description" className="block text-sm font-medium text-darkGray mb-2">
                    Descripció corta
                </label>
                <textarea
                    id="company_short_description"
                    {...methods.register("company.short_description")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    rows={3}
                    placeholder="Escribe una breve descripción de la empresa"
                ></textarea>
            </div>
        </div>
    );

    const renderStep4Empresa = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información extra opcional</h2>
            <label htmlFor="sectores" className="block text-sm font-medium text-darkGray mb-2">
                Selecciona Sectores
            </label>
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={[sectors[2], sectors[1]]}
                isMulti
                options={sectors}
                isSearchable
                placeholder="Busca y selecciona..."
                getOptionLabel={(option: any) => option.nombre}
                getOptionValue={(option: any) => option.id}
            />
        </div>

    );

    const renderStep2Instituto = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información del Instituto</h2>
            <div>
                <label htmlFor="nombreInstituto" className="block text-sm font-medium text-darkGray mb-2">
                    Nombre del Instituto
                </label>
                <input
                    type="text"
                    id="nombreInstituto"
                    {...methods.register("institution.name")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                />
                <p className="text-sm text-red-600">{methods.formState.errors.institution?.name?.message}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="institution_phone" className="block text-sm font-medium text-darkGray mb-2">
                        Telefono de contacto
                    </label>
                    <input
                        type="text"
                        id="institution_phone"
                        // name="company_phone"
                        // value={formData.company.phone}
                        // onChange={handleInputChange}
                        {...methods.register("institution.phone")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.institution?.phone?.message}</p>
                </div>
                <div>
                    <label htmlFor="institution_cif_nif" className="block text-sm font-medium text-darkGray mb-2">
                        Identificació fiscal (C.I.F o N.I.F)
                    </label>
                    <input
                        type="text"
                        id="institution_cif_nif"
                        // name="company_cif_nif"
                        // value={formData.company.cif_nif}
                        // onChange={handleInputChange}
                        {...methods.register("institution.cif_nif")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.institution?.cif_nif?.message}</p>
                </div>
            </div>
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-darkGray mb-2">
                    Tipo de Instituto
                </label>
                <select
                    id="tipo"
                    {...methods.register("institution.type")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                >
                    <option value="">Seleccionar tipo</option>
                    <option value="universidad">Universidad</option>
                    <option value="instituto">Instituto Técnico</option>
                    <option value="escuela">Escuela Profesional</option>
                </select>
                <p className="text-sm text-red-600">{methods.formState.errors.institution?.type?.message}</p>
            </div>
            <div>
                <label htmlFor="institution_email" className="block text-sm font-medium text-darkGray mb-2">
                    Email
                </label>
                <input
                    type="text"
                    id="institution_email"
                    {...methods.register("institution.email")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                />
                <p className="text-sm text-red-600">{methods.formState.errors.institution?.email?.message}</p>
            </div>
            <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-darkGray mb-2">
                    Ubicación
                </label>
                <input
                    type="text"
                    id="ubicacion"
                    {...methods.register("institution.address")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                />
                <p className="text-sm text-red-600">{methods.formState.errors.institution?.address?.message}</p>
            </div>
        </div>
    );

    const renderStep2 = () => {
        switch (formData.rol) {
            case 'estudiante':
                return renderStep2Estudiante();
            case 'empresa':
                setTotalSteps(4);
                if (step === 2) return renderStep2Empresa();
                if (step === 3) return renderStep3Empresa();
                if (step === 4) return renderStep4Empresa();
            case 'instituto':
                return renderStep2Instituto();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-lightGray to-white py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                {/*<LanguageSwitcher/>*/}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-darkGray">Registro</h1>
                        <div className="text-sm text-darkGray">
                            Paso {step} de {totalSteps}
                        </div>
                    </div>
                    <div className="w-full bg-lightGray h-2 rounded-full">
                        <div
                            className="bg-darkGray h-2 rounded-full transition-all duration-300"
                            style={{width: `${(step / totalSteps) * 100}%`}}
                        />
                    </div>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                        {step === 1 && renderStep1()}
                        {step === 2 && methods.watch('rol') === 'student' && renderStep2Estudiante()}
                        {step === 2 && methods.watch('rol') === 'company' && renderStep2Empresa()}
                        {step === 3 && methods.watch('rol') === 'company' && renderStep3Empresa()}
                        {step === 2 && methods.watch('rol') === 'institutions' && renderStep2Instituto()}

                        <div className="flex justify-between mt-8">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center text-sm font-medium text-darkGray"
                                >
                                    <ArrowLeft className="inline-block mr-2"/> Atrás
                                </button>
                            )}
                            {step < totalSteps ? (
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-3 text-sm font-medium text-white bg-black rounded-lg"
                                >
                                    Siguiente <ArrowRight className="inline-block ml-2"/>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-3 text-sm font-medium text-white bg-black rounded-lg"
                                >
                                    Enviar
                                </button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
