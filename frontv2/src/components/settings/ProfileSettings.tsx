import React, { useEffect, useState } from "react";
import { Mail, Lock, Image, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/requests/apiRequest";
import { LoaderContext } from "@/contexts/LoaderContext";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import config from "@/types/config";

const ProfileSettings: React.FC = () => {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { toast } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [emailLoader, setEmailLoader] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    apiRequest("settings/profile")
      .then((response) => {
        if (response.status === "success") {
          setProfile(response.profile);
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "Error al obtener la información del perfil",
          variant: "destructive",
        });
      })
      .finally(() => {
        hideLoader();
      });
  }, []);

  const getProfilePic = () => {
    switch (profile?.rol) {
      case "student":
        return profile?.student?.profile_pic;
        break;
      case "company":
        return profile?.company?.logo;
        break;
      case "institutions":
        return profile?.institutions?.logo;
        break;
      default:
        return "";
    }
  };

  const getName = () => {
    switch (profile?.rol) {
      case "student":
        return profile?.student?.name;
        break;
      case "company":
        return profile?.company?.name;
        break;
      case "institutions":
        return profile?.institutions?.name;
        break;
      default:
        return "";
    }
  };

  const getShortDesc = () => {
    switch (profile?.rol) {
      case "student":
        return profile?.student?.short_description;
        break;
      case "company":
        return profile?.company?.slogan;
        break;
      case "institutions":
        return profile?.institutions?.slogan;
        break;
      default:
        return "";
    }
  };

  const handleSaveNewPassword = () => {
    showLoader();
    setPasswordLoader(true);
    apiRequest("settings/profile/new-password", "POST", {
      currentPassword: profile?.currentPassword,
      newPassword: profile?.newPassword,
      confirmPassword: profile?.confirmPassword,
    })
      .then((response) => {
        if (response.status === "success") {
          toast({
            title: "Success",
            description: "Contraseña actualizada exitosamente",
            variant: "default",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "Error al actualizar la contraseña",
          variant: "destructive",
        });
      })
      .finally(() => {
        hideLoader();
        setPasswordLoader(false);
      });
  };

  const handleSaveEmail = () => {
    setEmailLoader(true);
    apiRequest("settings/profile/new-email", "POST", {
      email: profile?.email,
    })
      .then((response) => {
        if (response.status === "success") {
          toast({
            title: "Success",
            description: "Email actualizado exitosamente",
            variant: "success",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "Error al actualizar el email",
          variant: "destructive",
        });
      })
      .finally(() => {
        hideLoader();
        setEmailLoader(false);
      });
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Cuenta</h2>

      <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-center gap-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={config.storageUrl + getProfilePic()}
              alt={getProfilePic()}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1.5 shadow-md border border-gray-200">
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {getName()}
            </p>
            <p className="text-gray-600">
              {getShortDesc() || "Sin descripción todavia"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full">
          {/* Campo Email ocupa todo el espacio restante */}
          <div className="flex-1 w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={profile?.email || ""}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 py-2 px-3 text-gray-700"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          {/* Botón alineado al final */}
          <button
            onClick={handleSaveEmail}
            className={`whitespace-nowrap px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors ${emailLoader ? 'opacity-50' : ''}`}
            disabled={emailLoader}
          >
            {emailLoader ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Cargando...
              </div>
            ) : (
              "Guardar"
            )}
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Cambiar Contraseña
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña actual
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={profile?.currentPassword || ""}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 py-2 px-3 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña nueva
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profile?.newPassword || ""}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 py-2 px-3 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmar Contraseña nueva
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profile?.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 py-2 px-3 text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveNewPassword}
            disabled={passwordLoader}
            className={`px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors ${passwordLoader && "opacity-50"}`}
          >
            {passwordLoader ? (
              <div className="flex items-center gap-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cambiando contraseña...
              </div>
            ) : (
              "Guardar nueva contraseña"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
