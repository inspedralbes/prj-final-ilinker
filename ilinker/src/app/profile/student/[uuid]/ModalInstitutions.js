"use client"

import {useState, useEffect} from "react";
import {cn} from "@/lib/utils"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {GraduationCap, Building2, Calendar as CalendarIcon, X, Check} from "lucide-react";
import {format} from "date-fns";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {apiRequest} from "@/communicationManager/communicationManager";
import {useToast} from "@/hooks/use-toast";

export default function ModalInstitutions({handleClose, onSave, studentId}) {
    const [institute, setInstitute] = useState("");
    const [instituteSearchResults, setInstituteSearchResults] = useState([]);
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [isInstituteFound, setIsInstituteFound] = useState(null);

    const [degree, setDegree] = useState("");
    const [degreeSearchResults, setDegreeSearchResults] = useState([]);
    const [isDegreeFound, setIsDegreeFound] = useState(null);
    const [selectDegree, setSelectDegree] = useState(null);

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const [isSearching, setIsSearching] = useState(false);
    const [searchCourses, setSearchCourses] = useState(false)

    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const {toast} = useToast();
    //OBTENER FECHA DE HOY const [date, setDate] = useState(Date);


    // Simulación de búsqueda en base de datos
    useEffect(() => {
        if (institute.trim().length > 2) {
            setIsSearching(true);
            // Aquí harías una llamada a la API real
            setTimeout(async () => {
                // Datos de ejemplo - en producción, esto vendría de tu API
                const response = await apiRequest('/institution/getInstitutions');
                const allInstitutions = response?.institutions || response; // dependiendo de cómo te responda la API

                // Filtra los resultados según el texto ingresado
                let filteredResults = allInstitutions.filter(item =>
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
                const response = await apiRequest('/courses/getCourses');
                const allDegrees = response?.courses || response; // dependiendo de cómo te responda la API

                // Filtra los resultados según el texto ingresado
                let filteredResults = allDegrees.filter(item =>
                    item.name.toLowerCase().includes(degree.toLowerCase())
                );

                setDegreeSearchResults(filteredResults);
                setIsDegreeFound(filteredResults.length > 0);
                setSearchCourses(false);
            }, 500)
        } else {
            setDegreeSearchResults([]);
            setIsDegreeFound(null);
        }
    }, [degree]);

    const handleSaveEducation = async () => {
        // Validar los campos obligatorios
        if (!institute.trim() || !degree.trim() || !startDate) {
            alert("Por favor, completa todos los campos obligatorios");
            return;
        }

        // Crear objeto con los datos del estudio
        // Ahora usará el objeto seleccionado si existe, o creará uno con el texto introducido

        const educationData = {
            // Usar el instituto seleccionado si existe, o crear uno con el texto introducido
            student_id: studentId,
            courses_id: selectDegree ? selectDegree.id : null,
            institution_id: selectedInstitute ? selectedInstitute.id : null,
            institute: selectedInstitute ? null : institute,
            degree: selectDegree ? null : degree,
            start_date: startDate ? format(startDate, "dd/MM/yyyy") : "",
            end_date: endDate ? format(endDate, "dd/MM/yyyy") : "Presente",

        };

        try {

            const response = await apiRequest('/education/create', "POST", educationData);
            console.log("RESPUESTA");
            console.table(response);

            if (response.status === 'success') {

                toast({
                    title: "¡Estudio guardado!",
                    description: "El nuevo estudio se ha guardado correctamente",
                    variant: "default" // or you can use "success" if your toast component supports it
                });

                // Enviar datos al componente padre
                if (typeof onSave === 'function') {
                    onSave(educationData);
                }

                handleClose();

                // Limpiar estados
                setInstitute("");
                setDegree("");
                setStartDate(undefined);
                setEndDate(undefined);
                setSelectedInstitute(null);
                setSelectDegree(null);

            } else {
                // Error from API
                toast({
                    title: "Error al guardar",
                    description: response.error || "No se pudo guardar el estudio. Inténtalo de nuevo.",
                    variant: "destructive"
                });
            }


        } catch (error) {
            console.log("Error saving education", error);

            toast({
                title: "Error de conexion",
                description: "Ha ocurrido un error al conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.",
                variant: "destructive"
            });
        }

    };

    const selectInstitute = (instituteName, result) => {
        setInstitute(instituteName);
        setSelectedInstitute(result)
        setInstituteSearchResults([]); // Limpiar resultados después de seleccionar
    };

    const selectDegreeInput = (degreeName, result) => {
        setDegree(degreeName);
        setSelectDegree(result);
        setDegreeSearchResults([]);
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Añadir Nuevo Estudio</h2>
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
                                    onChange={(e) => setInstitute(e.target.value)}
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
                                    onChange={(e) => setDegree(e.target.value)}
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
                                        captionLayout="dropdown-buttons"
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
                        Guardar estudio
                    </Button>
                </div>
            </div>
        </div>
    );
}