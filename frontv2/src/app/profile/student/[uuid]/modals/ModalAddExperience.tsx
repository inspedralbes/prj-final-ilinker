"use client";

import {useState, useEffect, useContext} from "react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Building2, Calendar as CalendarIcon, X, Check, Briefcase, MapPin} from "lucide-react";
import {format} from "date-fns";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {apiRequest} from "@/services/requests/apiRequest";
import {useToast} from "@/hooks/use-toast";
import {AlertTriangle, CheckCircle, Info} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {LoaderContext} from "@/contexts/LoaderContext";

interface ModalExperienceProps {
    handleClose: () => void;
    onSave: (data: any) => void;
    studentId: string;
    initialData?: any; // Datos iniciales para edición
    isEditing?: boolean; // Indica si estamos editando
}

export default function ModalAddExperience({
                                               handleClose,
                                               onSave,
                                               studentId,
                                               initialData = null,
                                               isEditing = false,
                                           }: ModalExperienceProps) {
    const [company, setCompany] = useState<string>("");
    const [companySearchResults, setCompanySearchResults] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
    const [isCompanyFound, setIsCompanyFound] = useState<boolean | null>(null);

    const [department, setDepartment] = useState<string>("");
    const [employeeType, setEmployeeType] = useState<string>("");
    const [companyAddress, setCompanyAddress] = useState<string>("");
    const [locationType, setLocationType] = useState<string>("");

    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [openStartDate, setOpenStartDate] = useState<boolean>(false);
    const [openEndDate, setOpenEndDate] = useState<boolean>(false);
    const {toast} = useToast();
    const [experienceId, setExperienceId] = useState<string | null>(null);
    const { showLoader, hideLoader } = useContext(LoaderContext);

    // Inicializar los campos si estamos en modo edición
    useEffect(() => {
        if (isEditing && initialData) {
            // Establecer ID para actualización
            setExperienceId(initialData.id);

            // Establecer compañía
            setCompany(initialData.company_name || "");
            if (initialData.company_id) {
                setSelectedCompany({
                    id: initialData.company_id,
                    name: initialData.company_name
                });
            }

            // Establecer otros campos
            setDepartment(initialData.department || "");
            setEmployeeType(initialData.employee_type || "");
            setCompanyAddress(initialData.company_address || "");
            setLocationType(initialData.location_type || "");

            // Establecer fechas
            if (initialData.start_date) {
                const [year, month, day] = initialData.start_date.split('-');
                setStartDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
            }

            if (initialData.end_date && initialData.end_date !== "Presente") {
                const [year, month, day] = initialData.end_date.split('-');
                setEndDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
            }
        }
    }, [isEditing, initialData]);

    useEffect(() => {
        if (company.trim().length > 2) {
            setIsSearching(true);
            setTimeout(async () => {
                const response = await apiRequest("allCompanies");
                const allCompanies = response?.companies || response; // dependiendo de cómo te responda la API

                let filteredResults = allCompanies.filter((item: any) =>
                    item.name.toLowerCase().includes(company.toLowerCase())
                );

                setCompanySearchResults(filteredResults);
                setIsCompanyFound(filteredResults.length > 0);
                setIsSearching(false);
            }, 500);
        } else {
            setCompanySearchResults([]);
            setIsCompanyFound(null);
        }

        if (!isCompanyFound && company.length > 2) {
            setCompanyAddress("");
        }

    }, [company]);

    // Función para guardar la experiencia laboral
    const handleSaveExperience = async () => {

        if (!company.trim() || !startDate || !locationType || !companyAddress) {
            toast({
                // title: (
                //     <div className="flex items-center gap-2">
                //         <Info className="h-5 w-5 text-gray-500"/>
                //         <span>Error</span>
                //     </div>
                // ),
                title: "Error",
                description: "Por favor, completa todos los campos obligatorios",
                variant: "default",
                duration: 2000
            });
            return;
        }

        const experienceData = {
            id: experienceId, // Incluir ID si estamos editando
            student_id: studentId,
            company_id: selectedCompany ? selectedCompany.id : null,
            company_name: selectedCompany ? null : company,
            department: department,
            employee_type: employeeType,
            company_address: selectedCompany ? null : companyAddress,
            location_type: locationType,
            start_date: startDate ? format(startDate, "dd/MM/yyyy") : "",
            end_date: endDate ? format(endDate, "dd/MM/yyyy") : null,
        };

        console.log(isEditing ? "ACTUALIZACIÓN:" : "CREACIÓN:");
        console.table(experienceData);


        try {
            showLoader();
            // Cambiar el endpoint según si estamos creando o actualizando
            const endpoint = isEditing ? "experience/update" : "experience/create";
            const response = await apiRequest(endpoint, "POST", experienceData);

            console.log("Respuesta:", response);


            if (response.status === "success") {
                toast({
                    // title: (
                    //     <div className="flex items-center gap-2">
                    //         <CheckCircle className="h-5 w-5 text-green-500"/>
                    //         <span>{isEditing ? "Experiencia actualizada" : "Experiencia guardada"}</span>
                    //     </div>
                    // ),
                    title: isEditing ? "Experiencia actualizada" : "Experiencia guardada",
                    description: isEditing
                        ? "Experiencia laboral actualizada correctamente 💼"
                        : "Experiencia laboral guardada correctamente 💼",
                    variant: "default",
                    duration: 2000
                });

                if (typeof onSave === "function") {
                    onSave(experienceData);
                }

                hideLoader();
                handleClose();

                // Limpiar el formulario
                setCompany("");
                setDepartment("");
                setEmployeeType("");
                setCompanyAddress("");
                setLocationType("");
                setStartDate(undefined);
                setEndDate(undefined);
                setSelectedCompany(null);
                setExperienceId(null);
            } else {
                toast({
                    // title: (
                    //     <div className="flex items-center gap-2">
                    //         <AlertTriangle className="h-5 w-5 text-white-500"/>
                    //         <span>Error al {isEditing ? "actualizar" : "guardar"}</span>
                    //     </div>
                    // ),
                    title: "Error al " + (isEditing ? "actualizar" : "guardar"),
                    description: response.status || `No se pudo ${isEditing ? "actualizar" : "guardar"} la experiencia. Inténtalo de nuevo.`,
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

    const selectCompany = (companyName: string, result: any) => {
        setCompany(companyName);
        setSelectedCompany(result);
        setCompanyAddress(result.address)
        setCompanySearchResults([]);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    {isEditing ? (
                        <h2 className="text-xl font-bold">Editar Experiencia Laboral</h2>
                    ) : (
                        <h2 className="text-xl font-bold">Añadir Nueva Experiencia Laboral</h2>
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
                    {/* Empresa con autocompletado */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Empresa <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="flex items-center">
                                <Building2 className="h-4 w-4 absolute left-3 text-gray-500"/>
                                <Input
                                    value={company}
                                    onChange={(e) => {
                                        setCompany(e.target.value);
                                        if (selectedCompany && selectedCompany.name !== e.target.value) {
                                            setSelectedCompany(null);
                                        }
                                    }}
                                    placeholder="Buscar empresa..."
                                    className="pl-9"
                                />
                                {isSearching && (
                                    <div
                                        className="absolute right-3 animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                )}
                                {!isSearching && isCompanyFound !== null && (
                                    <div className="absolute right-3">
                                        {isCompanyFound ? (
                                            <Check className="h-4 w-4 text-green-500"/>
                                        ) : (
                                            <X className="h-4 w-4 text-red-500"/>
                                        )}
                                    </div>
                                )}
                            </div>

                            {companySearchResults.length > 0 && (
                                <div
                                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {companySearchResults.map((result) => (
                                                    <CommandItem
                                                        key={result.id}
                                                        onSelect={() => selectCompany(result.name, result)}
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
                        {!isCompanyFound && company.length > 2 && (
                            <p className="text-xs text-gray-500">
                                Esta empresa no está registrada. Se guardará el texto introducido.
                            </p>
                        )}
                    </div>

                    {/* Departamento y Tipo de empleado (grid de 2 columnas) */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Departamento */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Departamento
                            </label>
                            <div className="relative">
                                <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 absolute left-3 text-gray-500"/>
                                    <Input
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="Ej: Marketing, IT, Finanzas..."
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tipo de empleado */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tipo de empleado
                            </label>
                            <div className="relative">
                                <div className="flex items-center">
                                    <Input
                                        value={employeeType}
                                        onChange={(e) => setEmployeeType(e.target.value)}
                                        placeholder="Ej: Tiempo completo, Becario..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dirección y Tipo de ubicación (grid de 2 columnas) */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Dirección
                            </label>
                            <div className="relative">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 absolute left-3 text-gray-500"/>
                                    <Input
                                        value={companyAddress}
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                        placeholder="Dirección de la empresa"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tipo de ubicación */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tipo de ubicación
                            </label>
                            <Select
                                value={locationType}
                                onValueChange={(value) => setLocationType(value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="remoto">Remoto</SelectItem>
                                    <SelectItem value="hibrido">Híbrido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                                            "w-full justify-start text-left font-normal",
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
                                        captionLayout="dropdown"
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
                                            "w-full justify-start text-left font-normal",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {endDate ? format(endDate, "PPP") : "Trabajo actual"}
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
                    <Button onClick={handleSaveExperience}>
                        {isEditing ? "Actualizar experiencia" : "Guardar experiencia"}
                    </Button>
                </div>
            </div>
        </div>
    );
}