'use client'

import {useState, useEffect} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {useTranslation} from "@/hooks/useTranslation";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {useDropzone} from 'react-dropzone';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {useForm, FormProvider} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as comm from "@/communicationManager/communicationManager";

export default function Register() {
    const stepSchemas = [
        // Step 1 validation schema
        yup.object({
            nombre: yup.string().required("El nombre es obligatorio"),
            apellidos: yup.string().required("Los apellidos son obligatorios"),
            fechaNacimiento: yup.date().required("La fecha de nacimiento es obligatoria"),
            email: yup
                .string()
                .email("Debe ser un correo válido")
                .required("El correo es obligatorio"),
            rol: yup.string().required("El rol es obligatorio"),
        }),
        // Step 2 validation schema
        yup.object({
            company: yup.object().when('rol', {
                is: 'empresa',
                then: () => yup.object({
                    name: yup.string().required("El nombre es obligatorio"),
                    phone: yup.string().required("El teléfono es obligatorio"),
                    cif_nif: yup.string().required("El CIF/NIF es obligatorio"),
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
                    address: yup.string().required("La dirección es obligatoria"),
                }),
                otherwise: () => yup.object().nullable()
            }),
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
                                nombre: yup.string().required(),
                            })
                        )
                        .nullable(),
                }),
                otherwise: () => yup.object().nullable()
            }),
        })
    ];
    const {t} = useTranslation();
    const animatedComponents = makeAnimated();
    const [totalSteps, setTotalSteps] = useState(2);
    const [step, setStep] = useState(1);
    const methods = useForm({
        resolver: yupResolver(stepSchemas[step - 1]),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            nombre: "",
            apellidos: "",
            fechaNacimiento: "",
            email: "",
            rol: "estudiante",
            student: {
                type_document: "",
                id_document: null,
                nationality: "",
                photo_pic: "",
                birthday: "",
                gender: "",
                phone: null,
                address: "",
                city: "",
                country: "",
                postal_code: "",
                institution: "",
                education: [
                    {
                        "degree": "Grado en Ingeniería Informática",
                        "institution": "Universidad Complutense de Madrid",
                        "start_date": "2018-09-01",
                        "end_date": "2022-06-30",
                        "grade": "Sobresaliente"
                    },
                    {
                        "degree": "Máster en Ciencia de Datos",
                        "institution": "Universidad Politécnica de Madrid",
                        "start_date": "2023-09-01",
                        "end_date": null,
                        "grade": null
                    }
                ],
                "skills": [
                    "Python",
                    "Laravel",
                    "SQL",
                    "Machine Learning"
                ],
                "experience": [
                    {
                        "company": "Tech Solutions S.L.",
                        "position": "Desarrollador Web",
                        "start_date": "2021-01-01",
                        "end_date": "2022-12-31",
                        "description": "Desarrollo de aplicaciones web en Laravel y Vue.js."
                    },
                    {
                        "company": "AI Innovators",
                        "position": "Data Scientist Intern",
                        "start_date": "2023-02-01",
                        "end_date": null,
                        "description": "Colaboración en proyectos de machine learning."
                    }
                ],
                "languages": [
                    {
                        "language": "Español",
                        "level": "Nativo"
                    },
                    {
                        "language": "Inglés",
                        "level": "Avanzado"
                    },
                    {
                        "language": "Francés",
                        "level": "Intermedio"
                    }
                ],
                "projects": [
                    {
                        "id": 1,
                        "user_id": 1,
                        "name": "Sistema de Gestión Académica",
                        "description": "Aplicación para la gestión de notas y matrículas de estudiantes.",
                        "link": "https://github.com/juanperez/gestion-academica",
                        "pictures": [
                            "https://example.com/projects/gestion1.png",
                            "https://example.com/projects/gestion2.png"
                        ],
                        "end_project": "2022-06-15"
                    },
                    {
                        "id": 2,
                        "user_id": 1,
                        "name": "Chatbot Inteligente",
                        "description": "Chatbot con IA para atención al cliente.",
                        "link": "https://juanperez.com/chatbot",
                        "pictures": [],
                        "end_project": "2023-08-01"
                    }
                ]
            },
            company: {
                name: "dsadsadas",
                phone: "",
                cif_nif: "",
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

    const sectores = [
        {id: 1, nombre: 'Tecnología'},
        {id: 2, nombre: 'Salud'},
        {id: 3, nombre: 'Educación'},
        {id: 4, nombre: 'Marketing'},
        {id: 5, nombre: 'Cultura'}
    ];

    useEffect(() => {
        switch (methods.watch('rol')) {
            case 'estudiante':
                setTotalSteps(2); // Información personal + académica
                break;
            case 'empresa':
                setTotalSteps(3); // Información personal + empresa (2 pasos) + opcional
                break;
            case 'instituto':
                setTotalSteps(2); // Información personal + instituto
                break;
            default:
                setTotalSteps(2); // Valor por defecto
        }
    }, [methods.watch('rol')]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const data = await comm.getAllCountries();
            if (!data.error) {
                setCountries(data);
            } else {
                console.error("Error al obtener los países:", data.error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        console.log("Países actualizados:", countries);
    }, [countries]);

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
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
    const handleInputChange = (e) => {
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
    const onSubmit = (data) => {
        if (step < totalSteps) {
            setStep(step + 1); // Avanzar al siguiente paso
        } else {
            console.log("Datos del formulario:", data); // Enviar el formulario
        }
    };
    const handleBack = () => {
        setStep(step - 1);
    };
    const handleSubmit = (e) => {
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
                        // name="nombre"
                        // value={formData.nombre}
                        // onChange={handleInputChange}
                        {...methods.register("nombre")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.nombre?.message}</p>
                </div>
                <div>
                    <label htmlFor="apellidos" className="block text-sm font-medium text-darkGray mb-2">
                        Apellidos
                    </label>
                    <input
                        type="text"
                        id="apellidos"
                        // name="apellidos"
                        // value={formData.apellidos}
                        // onChange={handleInputChange}
                        {...methods.register("apellidos")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.apellidos?.message}</p>
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-darkGray mb-2">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    // name="email"
                    // value={formData.email}
                    // onChange={handleInputChange}
                    {...methods.register("email")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                />
                <p className="text-sm text-red-600">{methods.formState.errors.email?.message}</p>
            </div>
            <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-darkGray mb-2">
                    Fecha de Nacimiento
                </label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    // name="fechaNacimiento"
                    // value={formData.fechaNacimiento}
                    // onChange={handleInputChange}
                    {...methods.register("fechaNacimiento")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                />
                <p className="text-sm text-red-600">{methods.formState.errors.fechaNacimiento?.message}</p>
            </div>
            <div>
                <label htmlFor="rol" className="block text-sm font-medium text-darkGray mb-2">
                    Tipo de Usuario
                </label>
                <select
                    id="rol"
                    // name="rol"
                    // value={formData.rol}
                    // onChange={handleInputChange}
                    {...methods.register("rol")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                >
                    <option value="estudiante">Estudiante</option>
                    <option value="empresa">Empresa</option>
                    <option value="instituto">Instituto</option>
                </select>
                <p className="text-sm text-red-600">{methods.formState.errors.rol?.message}</p>
            </div>
        </div>
    );

    const renderStep2Estudiante = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información Académica</h2>
            <div>
                <label htmlFor="carrera" className="block text-sm font-medium text-darkGray mb-2">
                    Carrera
                </label>
                <input
                    type="text"
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="universidad" className="block text-sm font-medium text-darkGray mb-2">
                    Universidad
                </label>
                <input
                    type="text"
                    id="universidad"
                    name="universidad"
                    value={formData.universidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="semestre" className="block text-sm font-medium text-darkGray mb-2">
                    Semestre Actual
                </label>
                <input
                    type="text"
                    id="semestre"
                    name="semestre"
                    value={formData.semestre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="student_nacionality" className="block text-sm font-medium text-darkGray mb-2">
                    Nacionalidad
                </label>
                <Select
                    components={animatedComponents}
                    options={countries}
                    isSearchable
                    placeholder="Busca y selecciona un país..."
                    getOptionLabel={(option) => (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                                src={option.flags.svg}
                                alt={option.name.common}
                                style={{ width: "20px", height: "15px", borderRadius: "3px" }}
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
                        console.log("País seleccionado:", selectedOption)
                        methods.setValue('student.nationality', selectedOption);
                    }}
                />
            </div>
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
                        {...methods.register("company.cif_nif")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"

                    />
                    <p className="text-sm text-red-600">{methods.formState.errors.company?.cif_nif?.message}</p>
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
                    options={sectores}
                    isSearchable
                    placeholder="Busca y selecciona..."
                    getOptionLabel={(option) => option.nombre}
                    getOptionValue={(option) => option.id}
                    onChange={(selectedOptions) => methods.setValue("company.sectors", selectedOptions)}
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
                    rows="3"
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
                defaultValue={[sectores[2], sectores[1]]}
                isMulti
                options={sectores}
                isSearchable
                placeholder="Busca y selecciona..."
                getOptionLabel={(option) => option.nombre}
                getOptionValue={(option) => option.id}
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
                        <h1 className="text-3xl font-bold text-darkGray">{t('register')}</h1>
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
                        {step === 2 && methods.watch('rol') === 'estudiante' && renderStep2Estudiante()}
                        {step === 2 && methods.watch('rol') === 'empresa' && renderStep2Empresa()}
                        {step === 3 && methods.watch('rol') === 'empresa' && renderStep3Empresa()}
                        {step === 2 && methods.watch('rol') === 'instituto' && renderStep2Instituto()}

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
