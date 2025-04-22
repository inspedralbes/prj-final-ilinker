import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function InstituteDoesntExist() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="mb-8 relative h-48">
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops! Compañía no encontrada</h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, pero no hemos podido encontrar la compañía que estás buscando. Puede que haya sido eliminada o
            que la dirección sea incorrecta.
          </p>
          <Link href="/" passHref>
            <Button variant="default" size="lg" className="w-full">
              <ArrowLeft className="mr-2 h-5 w-5" /> Volver a la página principal
            </Button>
          </Link>
        </div>
        <div className="bg-gray-50 px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
            ¿Necesitas ayuda?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
