import { useState, useRef, useEffect, useContext } from "react";
import * as Icons from "lucide-react";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function NotificationDropDown() {
  const { notifications } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className=" rounded-full relative">
        <div className={`flex flex-col items-center ${notifications.length > 0 ? "text-foreground" : "text-muted-foreground"} relative`}>
          <Icons.Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-0 inline-flex items-center justify-center px-1 text-[10px] font-semibold text-white bg-red-600 rounded-full">
              {notifications.length}
            </span>
          )}
          <span className="text-[12px] mt-1">Notificaciones</span>
        </div>
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white rounded-lg shadow-lg">
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              // 1) Asegúrate de que notif.icon es una clave válida de Icons
              const iconKey = notif.icon as keyof typeof Icons;

              // 2) Asserts para que TS lo trate como componente React
              const IconComp = Icons[
                iconKey
              ] as React.ComponentType<Icons.LucideProps>;
              return (
                <li
                  key={notif.id}
                  className="border-b last:border-none p-4 hover:bg-gray-50 cursor-pointer flex items-start"
                  onClick={() => {
                    // Manejar clic: redirigir a notif.url o marcar como leído
                    setIsOpen(false);
                  }}
                >
                  {IconComp && (
                    <IconComp className="w-5 h-5 text-black mr-3 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {notif.title}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {notif.message}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="p-4 text-center text-sm text-gray-500">
              No hay notificaciones
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
