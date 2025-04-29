import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Globe, Users, Banknote, GraduationCap, BookmarkPlus } from "lucide-react";
import Link from "next/link";

export default function ModalOffer({ handleClose, isEditMode = false, selectedInfoJob }) {
    // Estados para los campos editables
    const [jobTitle, setJobTitle] = useState(isEditMode ? selectedInfoJob.title : "");
    const [jobDescription, setJobDescription] = useState(isEditMode ? selectedInfoJob.description : "");
    const [companyDescription, setCompanyDescription] = useState(isEditMode ? selectedInfoJob.company.short_description : "");
    const [salary, setSalary] = useState(isEditMode ? selectedInfoJob.salary : "");
    const [companyName, setCompanyName] = useState(isEditMode ? selectedInfoJob.company.name : "");
    const [companyAddress, setCompanyAddress] = useState(isEditMode ? selectedInfoJob.address : "");

    const handleSave = () => {
        // Aquí iría la lógica para guardar los cambios o crear la nueva oferta
        const newJob = {
            title: jobTitle,
            description: jobDescription,
            company: {
                name: companyName,
                short_description: companyDescription,
                address: companyAddress,
            },
            salary,
        };

        console.log("Guardando nueva oferta:", newJob);
        handleClose(); // Cierra el modal después de guardar
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                <h2>{isEditMode ? "Editar Oferta" : "Añadir Nueva Oferta"}</h2>
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-lg text-gray-600 hover:text-gray-900"
                >
                    X
                </button>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            <Input
                                className="text-2xl font-bold"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="Título de la oferta"
                            />
                        </h2>
                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <Building2 className="h-4 w-4" />
                            <Input
                                className="ml-2"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Nombre de la empresa"
                            />
                            <MapPin className="h-4 w-4 ml-2" />
                            <Input
                                value={companyAddress}
                                onChange={(e) => setCompanyAddress(e.target.value)}
                                placeholder="Dirección de la empresa"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button className="flex-1">Aplicar ahora</Button>
                            <Button variant="outline" size="icon">
                                <BookmarkPlus className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span>Remote available</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>501-1,000 employees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                placeholder="Rango salarial"
                                className="text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span>Bachelor's degree</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Descripción de la oferta</h3>
                        <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                            placeholder="Descripción de la oferta"
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Sobre la empresa</h3>
                        <Textarea
                            value={companyDescription}
                            onChange={(e) => setCompanyDescription(e.target.value)}
                            rows={4}
                            placeholder="Descripción de la empresa"
                        />
                    </div>

                    <div className="mt-4 flex justify-end gap-4">
                        <Button onClick={handleSave}>{isEditMode ? "Guardar cambios" : "Crear oferta"}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
