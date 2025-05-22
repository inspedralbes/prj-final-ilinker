import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from "@/components/ui/button"; // Usa tu botón si es otro
import { Info   } from "lucide-react";

export default function ConfirmDialog({ open, onOpenChange, icon = <Info  className="text-gray-500" />, title, description, onConfirm, onCancel, confirmText = "Continuar", cancelText = "Cancelar" }) {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
                <AlertDialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-md w-full bg-white p-6 rounded-xl shadow-lg space-y-4">
                    <AlertDialog.Title className="text-lg font-semibold flex items-center gap-2">
                        {icon}
                        {title}
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-sm text-gray-600">
                        {description}
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-2">
                        <AlertDialog.Cancel asChild>
                            <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button variant="destructive" onClick={onConfirm}>{confirmText}</Button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
