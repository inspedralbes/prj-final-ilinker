export default function Loading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <img src="/images/logo_nombre.svg" className="w-36" alt="Logo"/>
            <div className="flex items-center justify-center space-x-2 mt-4">
                <div className="w-7 h-7 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
                <p className="text-black">Carregant...</p>
            </div>

        </div>
    );
}
