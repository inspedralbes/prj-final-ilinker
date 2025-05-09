"use client";

import {useState, useEffect, useContext} from "react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {GraduationCap, Building2, Calendar as CalendarIcon, X, Check} from "lucide-react";
import {format} from "date-fns";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {apiRequest} from "@/services/requests/apiRequest";
import {useToast} from "@/hooks/use-toast"
import {AlertTriangle, CheckCircle, Info } from "lucide-react";
import {white} from "next/dist/lib/picocolors"; // Puedes usar cualquier icono de lucide-react
import {LoaderContext} from "@/contexts/LoaderContext";


interface ModalInstitutionsProps {
    handleClose: () => void;
    onSave: (data: any) => void;
    studentId: number;
    initialData?: any; // Datos iniciales para edición
    isEditing?: boolean; // Indica si estamos editando
}

export default function ModalAddStudies({
                                            handleClose,
                                            onSave,
                                            studentId,
                                            initialData = null,
                                            isEditing = false,
                                        }: ModalInstitutionsProps) {
    const [institute, setInstitute] = useState<string>("");
    const [instituteSearchResults, setInstituteSearchResults] = useState<any[]>([]);
    const [selectedInstitute, setSelectedInstitute] = useState<any | null>(null);
    const [isInstituteFound, setIsInstituteFound] = useState<boolean | null>(null);

    const [degree, setDegree] = useState<string>("");
    const [degreeSearchResults, setDegreeSearchResults] = useState<any[]>([]);
    const [isDegreeFound, setIsDegreeFound] = useState<boolean | null>(null);
    const [selectDegree, setSelectDegree] = useState<any | null>(null);

    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchCourses, setSearchCourses] = useState<boolean>(false);

    const [openStartDate, setOpenStartDate] = useState<boolean>(false);
    const [openEndDate, setOpenEndDate] = useState<boolean>(false);
    const {toast} = useToast();
    const [educationId, setEducationId] = useState<string | null>(null);
    const { showLoader, hideLoader } = useContext(LoaderContext);

    // Inicializar los campos si estamos en modo edición
    useEffect(() => {
        if (isEditing && initialData) {
            // Establecer ID para actualización
            setEducationId(initialData.id);

            // Establecer institución
            setInstitute(initialData.institute || "");
            if (initialData.institution_id) {
                setSelectedInstitute({
                    id: initialData.institution_id,
                    name: initialData.institution_name || initialData.institute
                });
            }

            // Establecer grado/título
            setDegree(initialData.degree || "");
            if (initialData.courses_id) {
                setSelectDegree({
                    id: initialData.courses_id,
                    name: initialData.course_name || initialData.degree
                });
            }

            // Establecer fechas
            if (initialData.start_date) {
                // Convertir string a Date (asumiendo formato dd/MM/yyyy)
                const [year, month, day] = initialData.start_date.split('-');
                console.log(year, month, day);
                setStartDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
            }

            if (initialData.end_date && initialData.end_date !== "Presente") {
                const [year, month, day] = initialData.end_date.split('-');
                setEndDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
            }
        }
    }, [isEditing, initialData]);


    useEffect(() => {
        if (institute.trim().length > 2) {
            setIsSearching(true);
            setTimeout(async () => {
                const response = await apiRequest("institution/getInstitutions");
                const allInstitutions = response?.institutions || response; // dependiendo de cómo te responda la API

                let filteredResults = allInstitutions.filter((item: any) =>
                    item.name.toLowerCase().includes(institute.toLowerCase())
                );

                setInstituteSearchResults(filteredResults);
                setIsInstituteFound(filteredResults.length > 0);
                setIsSearching(false);
            }, 500);
        } else {
            setInstituteSearchResults([]);
            setIsInstituteFound(null);
        }
    }, [institute]);

    useEffect(() => {
        if (degree.trim().length > 2) {
            setSearchCourses(true);
            setTimeout(async () => {
                const response = await apiRequest("courses/getCourses");
                const allDegrees = response?.courses || response;

                let filteredResults = allDegrees.filter((item: any) =>
                    item.name.toLowerCase().includes(degree.toLowerCase())
                );

                setDegreeSearchResults(filteredResults);
                setIsDegreeFound(filteredResults.length > 0);
                setSearchCourses(false);
            }, 500);
        } else {
            setDegreeSearchResults([]);
            setIsDegreeFound(null);
        }
    }, [degree]);

    // Modificar función de guardado para soportar actualización
    const handleSaveEducation = async () => {
        if (!institute.trim() || !degree.trim() || !startDate) {
            toast({
                title: "Error",
                description: "Por favor, completa todos los campos obligatorios",
                variant: "default",
                duration: 2000
            });
            return;
        }

        const educationData = {
            id: educationId, // Incluir ID si estamos editando
            student_id: studentId,
            courses_id: selectDegree ? selectDegree.id : null,
            institution_id: selectedInstitute ? selectedInstitute.id : null,
            institute: selectedInstitute ? null : institute,
            degree: selectDegree ? null : degree,
            start_date: startDate ? format(startDate, "dd/MM/yyyy") : "",
            end_date: endDate ? format(endDate, "dd/MM/yyyy") : null,
        };

        console.log(isEditing ? "ACTUALIZACIÓN:" : "CREACIÓN:");
        console.table(educationData);

        try {
            showLoader();
            // Cambiar el endpoint según si estamos creando o actualizando
            const endpoint = isEditing ? "education/update" : "education/create";
            const response = await apiRequest(endpoint, "POST", educationData);

            console.log("Respuesta:", response);

            if (response.status === "success") {
                toast({
                    title: isEditing ? "Estudio actualizado" : "Estudio guardado",
                    description: isEditing
                        ? "Estudio actualizado correctamente 🎓"
                        : "Estudio guardado correctamente 🎓",
                    variant: "default",
                    duration: 2000
                });

                if (typeof onSave === "function") {
                    onSave(educationData);
                }

                hideLoader();
                handleClose();

                // Limpiar el formulario
                setInstitute("");
                setDegree("");
                setStartDate(undefined);
                setEndDate(undefined);
                setSelectedInstitute(null);
                setSelectDegree(null);
                setEducationId(null);
            } else {
                toast({
                    title: isEditing ? "Error al actualizar" : "Error al guardar",
                    description: response.status || `No se pudo ${isEditing ? "actualizar" : "guardar"} el estudio. Inténtalo de nuevo.`,
                    variant: "destructive",
                    duration: 2000
                });
                hideLoader();
            }
        } catch (error) {
            toast({
                title: "Error de conexión",
                description: "Ha ocurrido un error al conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.",
                variant: "destructive",
                duration: 2000
            });
            hideLoader();
        }
    };

    const selectInstitute = (instituteName: string, result: any) => {
        setInstitute(instituteName);
        setSelectedInstitute(result);
        setInstituteSearchResults([]);
    };

    const selectDegreeInput = (degreeName: string, result: any) => {
        setDegree(degreeName);
        setSelectDegree(result);
        setDegreeSearchResults([]);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    {isEditing ? (
                        <h2 className="text-xl font-bold">Editar Estudio</h2>
                    ) : (
                        <h2 className="text-xl font-bold">Añadir Nuevo Estudio</h2>

                    )}
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5"/>
                    </button>
                </div>

                <Separator className="mb-4"/>

                <div className="space-y-4">
                    {/* Instituto/Universidad con autocompletado */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Instituto/Universidad <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="flex items-center">
                                <Building2 className="h-4 w-4 absolute left-3 text-gray-500"/>
                                <Input
                                    value={institute}
                                    onChange={(e) => {
                                        setInstitute(e.target.value);
                                        if (selectedInstitute && selectedInstitute.name !== e.target.value) {
                                            setSelectedInstitute(null);
                                        }
                                    }}
                                    placeholder="Buscar institución educativa..."
                                    className="pl-9"
                                />
                                {isSearching && (
                                    <div
                                        className="absolute right-3 animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                )}
                                {!isSearching && isInstituteFound !== null && (
                                    <div className="absolute right-3">
                                        {isInstituteFound ? (
                                            <Check className="h-4 w-4 text-green-500"/>
                                        ) : (
                                            <X className="h-4 w-4 text-red-500"/>
                                        )}
                                    </div>
                                )}
                            </div>

                            {instituteSearchResults.length > 0 && (
                                <div
                                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {instituteSearchResults.map((result) => (
                                                    <CommandItem
                                                        key={result.id}
                                                        onSelect={() => selectInstitute(result.name, result)}
                                                        className="cursor-pointer py-2 px-3 hover:bg-gray-100"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {result.logo && (
                                                                <div
                                                                    className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                                    <img src={result.logo} alt={result.name}
                                                                         className="w-full h-full object-cover"/>
                                                                </div>
                                                            )}
                                                            <span>{result.name}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </div>
                            )}
                        </div>
                        {!isInstituteFound && institute.length > 2 && (
                            <p className="text-xs text-gray-500">
                                Esta institución no está registrada. Se guardará el texto introducido.
                            </p>
                        )}
                    </div>

                    {/* Grado/Título */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Título/Grado <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <div className="flex items-center">
                                <GraduationCap className="h-4 w-4 absolute left-3 text-gray-500"/>
                                <Input
                                    value={degree}
                                    onChange={(e) => {
                                        setDegree(e.target.value);
                                        if (selectDegree && selectDegree.name !== e.target.value) {
                                            setSelectDegree(null);
                                        }
                                    }}
                                    placeholder="Buscar curso..."
                                    className="pl-9"
                                />
                                {searchCourses && (
                                    <div
                                        className="absolute right-3 animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                )}
                                {!searchCourses && isDegreeFound !== null && (
                                    <div className="absolute right-3">
                                        {isDegreeFound ? (
                                            <Check className="h-4 w-4 text-green-500"/>
                                        ) : (
                                            <X className="h-4 w-4 text-red-500"/>
                                        )}
                                    </div>
                                )}
                            </div>

                            {degreeSearchResults.length > 0 && (
                                <div
                                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {degreeSearchResults.map((result) => (
                                                    <CommandItem
                                                        key={result.id}
                                                        onSelect={() => selectDegreeInput(result.name, result)}
                                                        className="cursor-pointer py-2 px-3 hover:bg-gray-100"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {result.logo && (
                                                                <div
                                                                    className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                                    <img src={result.logo} alt={result.name}
                                                                         className="w-full h-full object-cover"/>
                                                                </div>
                                                            )}
                                                            <span>{result.name}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </div>
                            )}
                        </div>
                        {!isDegreeFound && degree.length > 2 && (
                            <p className="text-xs text-gray-500">
                                Este título no está registrado. Se guardará el texto introducido.
                            </p>
                        )}
                    </div>

                    {/* Fechas: Inicio y Fin */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Fecha de inicio */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Fecha de inicio <span className="text-red-500">*</span>
                            </label>
                            <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[240px] justify-start text-left font-normal",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {startDate ? format(startDate, "PPP") : "Seleccionar..."}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => {
                                            setStartDate(date);
                                            setOpenStartDate(false);
                                        }}
                                        className="rounded-md border"
                                        //captionLayout="dropdown-buttons"
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Fecha de fin */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Fecha de fin
                                <span className="text-xs text-gray-500 ml-1">(o actual)</span>
                            </label>
                            <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[240px] justify-start text-left font-normal",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {endDate ? format(endDate, "PPP") : "Cursando actualmente"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => {
                                            setEndDate(date);
                                            setOpenEndDate(false);
                                        }}
                                        fromYear={1990}
                                        toYear={2030}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveEducation}>
                        {isEditing ? "Actualizar estudio" : "Guardar estudio"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
