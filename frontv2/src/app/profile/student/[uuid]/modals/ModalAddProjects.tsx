"use client";

import {useState, useEffect, useContext} from "react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
    Briefcase,
    CalendarIcon,
    X,
    Plus,
    Link as LinkIcon,
    Image,
    AlertTriangle,
    CheckCircle,
    Info
} from "lucide-react";
import {format} from "date-fns";
import {Textarea} from "@/components/ui/textarea";
import {apiRequest} from "@/services/requests/apiRequest";
import {useToast} from "@/hooks/use-toast";
import {LoaderContext} from "@/contexts/LoaderContext";
import Cookies from "js-cookie";

interface ModalProjectsProps {
    handleClose: () => void;
    onSave: (data: any) => void;
    studentId: string;
    initialData?: any; // Datos iniciales para edición
    isEditing?: boolean; // Indica si estamos editando
}

export default function ModalAddProjects({
                                             handleClose,
                                             onSave,
                                             studentId,
                                             initialData = null,
                                             isEditing = false,
                                         }: ModalProjectsProps) {
    const [projectName, setProjectName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [openEndDate, setOpenEndDate] = useState<boolean>(false);
    const {toast} = useToast();
    const [projectId, setProjectId] = useState<string | null>(null);

    const [currentPictureFile, setCurrentPictureFile] = useState<File | null>(null);
    const [pictures, setPictures] = useState<ImageItem[]>([]); // o File[] si prefieres trabajar con los archivos directamente
    const { showLoader, hideLoader } = useContext(LoaderContext);

    // Inicializar los campos si estamos en modo edición
    useEffect(() => {
        if (isEditing && initialData) {
            // Establecer ID para actualización
            setProjectId(initialData.id);

            // Establecer datos del proyecto
            setProjectName(initialData.name || "");
            setDescription(initialData.description || "");
            setLink(initialData.link || "");

            console.log("IMAGENES")
            console.table(initialData.pictures);

            // Establecer imágenes existentes
            if (initialData.pictures) {
                try {
                    // Asegurarnos de que trabajamos con un array, no con un string
                    let parsedPictures;
                    if (typeof initialData.pictures === 'string') {
                        parsedPictures = JSON.parse(initialData.pictures);
                    } else if (Array.isArray(initialData.pictures)) {
                        parsedPictures = initialData.pictures;
                    } else {
                        parsedPictures = [];
                    }

                    if (Array.isArray(parsedPictures)) {
                        // Convertir cada nombre de imagen a un objeto ImageItem
                        const imageItems = parsedPictures.map(pictureName => ({
                            isFile: false,
                            name: pictureName,
                            path: pictureName
                        }));

                        setPictures(imageItems);
                    }
                } catch (error) {
                    console.error("Error al parsear las imágenes:", error);
                }
            }

            // Establecer fecha de finalización
            if (initialData.end_project) {
                const [year, month, day] = initialData.end_project.split('-');
                setEndDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
            }
        }
    }, [isEditing, initialData]);


    const addPictureFile = () => {
        if (!currentPictureFile) return;

        // Añadir el nuevo archivo como un objeto ImageItem
        setPictures([...pictures, {
            isFile: true,
            file: currentPictureFile,
            name: currentPictureFile.name
        }]);

        // Limpia
        setCurrentPictureFile(null);
    };

    const removePictureFile = (index: number) => {
        const newPictures = [...pictures];
        newPictures.splice(index, 1); // Elimina el archivo en el índice dado
        setPictures(newPictures); // Actualiza el estado
    };

    const handleSaveProject = async () => {
        if (!projectName.trim() || !description.trim()) {
            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-gray-500"/>
                        <span>Error</span>
                    </div>
                ),
                description: "Por favor, completa los campos obligatorios (nombre y descripción)",
                variant: "default",
                duration: 2000
            });
            return;
        }

        const formData = new FormData();
        formData.append("id", projectId ?? "");
        formData.append("student_id", studentId);
        formData.append("name", projectName);
        formData.append("description", description);
        formData.append("link", link.trim() || "");
        formData.append("end_project", endDate ? format(endDate, "dd/MM/yyyy") : "");


        // Recopilar los nombres de las imágenes existentes
        const existingImages = pictures
            .filter(item => !item.isFile)
            .map(item => item.path);

        // Añadir la lista de nombres de imágenes existentes
        formData.append('existing_pictures', JSON.stringify(existingImages));

        // Añadir los archivos de imágenes nuevas
        pictures
            .filter(item => item.isFile && item.file)
            .forEach(item => {
                if (item.file) {
                    formData.append('pictures[]', item.file);
                }
            });


        console.log(isEditing ? "ACTUALIZACIÓN PROYECTO:" : "CREACIÓN PROYECTO:");
        console.table(Array.from(formData.entries()));

        try {
            showLoader();
            // Cambiar el endpoint según si estamos creando o actualizando
            const endpoint = isEditing ? "projects/update" : "projects/create";
            const response = await apiRequest(endpoint, "POST", formData)

            console.log("Respuesta:", response);

            if (response.status === "success") {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500"/>
                            <span>{isEditing ? "Proyecto actualizado" : "Proyecto guardado"}</span>
                        </div>
                    ),
                    description: isEditing
                        ? "Proyecto actualizado correctamente 🚀"
                        : "Proyecto guardado correctamente 🚀",
                    variant: "default",
                    duration: 2000
                });

                if (typeof onSave === "function") {
                    onSave(formData);
                }

                hideLoader();
                handleClose();

                // Limpiar el formulario
                setProjectName("");
                setDescription("");
                setLink("");
                setCurrentPictureFile(null)
                setPictures([])
                setEndDate(undefined);
                setProjectId(null);
            } else {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-white-500"/>
                            <span>Error al {isEditing ? "actualizar" : "guardar"}</span>
                        </div>
                    ),
                    description: response.message || `No se pudo ${isEditing ? "actualizar" : "guardar"} el proyecto. Inténtalo de nuevo.`,
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

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div
                className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    {isEditing ? (
                        <h2 className="text-xl font-bold">Editar Proyecto</h2>
                    ) : (
                        <h2 className="text-xl font-bold">Añadir Nuevo Proyecto</h2>
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
                    {/* Nombre del Proyecto */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Nombre del Proyecto <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center relative">
                            <Briefcase className="h-4 w-4 absolute left-3 text-gray-500"/>
                            <Input
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Nombre del proyecto"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Descripción <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe brevemente el proyecto y sus objetivos"
                            className="resize-none min-h-[100px]"
                        />
                    </div>

                    {/* Enlace */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Enlace del Proyecto
                            <span className="text-xs text-gray-500 ml-1">(opcional)</span>
                        </label>
                        <div className="flex items-center relative">
                            <LinkIcon className="h-4 w-4 absolute left-3 text-gray-500"/>
                            <Input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://ejemplo.com/mi-proyecto"
                                className="pl-9"
                                type="url"
                            />
                        </div>
                    </div>

                    {/* Imágenes */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Imágenes del Proyecto
                            <span className="text-xs text-gray-500 ml-1">(opcional)</span>
                        </label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setCurrentPictureFile(file); // Guarda el archivo
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addPictureFile}
                                variant="outline"
                                className="shrink-0"
                            >
                                <Plus className="h-4 w-4 mr-1"/> Añadir
                            </Button>
                        </div>

                        {/* Lista de imágenes añadidas */}
                        {pictures.length > 0 && (
                            <div className="mt-2 border rounded-md p-3 bg-gray-50">
                                <p className="text-sm font-medium mb-2">Imágenes añadidas ({pictures.length})</p>
                                <div className="space-y-2">
                                    {pictures.map((file, index) => (
                                        <div key={index}
                                             className="flex items-center justify-between bg-white p-2 rounded-md border text-sm">

                                            <div
                                                className="truncate max-w-[350px]">
                                                {file.isFile ? (
                                                    <span className="flex items-center">
                                                        <Image className="h-4 w-4 mr-1 text-blue-500" />
                                                        <span className="truncate">{file.name}</span>
                                                        <span className="text-xs text-blue-500 ml-1">(Nuevo)</span>
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <Image className="h-4 w-4 mr-1 text-green-500" />
                                                        <span className="truncate">{file.name}</span>
                                                        <span className="text-xs text-green-500 ml-1">(Existente)</span>
                                                    </span>
                                                )}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePictureFile(index)} // Actualizamos la función de eliminación
                                                className="h-7 w-7 p-0"
                                            >
                                                <X className="h-4 w-4 text-red-500"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Fecha de finalización */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Fecha de finalización
                            <span className="text-xs text-gray-500 ml-1">(opcional)</span>
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
                                    {endDate ? format(endDate, "PPP") : "Seleccionar fecha de finalización..."}
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
                                    className="rounded-md border"
                                    captionLayout="dropdown-buttons"
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveProject}>
                        {isEditing ? "Actualizar proyecto" : "Guardar proyecto"}
                    </Button>
                </div>
            </div>
        </div>
    );
}