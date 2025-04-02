"use client"

import React from 'react';
import Image from 'next/image';

const LoadingPage = ({logoSrc = '/images/logo.svg'}) => {
    return (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm">
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center gap-6 rounded-xl bg-white p-6 shadow-lg">
                    {/* Spinner Container */}
                    <div className="relative h-24 w-24">
                        {/* Outer ring */}
                        <div className="h-24 w-24 rounded-full border-4 border-gray-200 dark:border-gray-800" />
                        {/* Inner spinning ring */}
                        <div className="absolute left-0 top-0 h-24 w-24 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                        {/* Center logo */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12">
                            <Image
                                src={logoSrc}
                                alt="Logo de la empresa"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Pulse Effect */}
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-primary/20 animate-pulse" />
                        <div className="relative rounded-full bg-white px-6 py-2 ">
                            <span className="text-lg font-medium text-primary">Loading...</span>
                        </div>
                    </div>

                    {/* Animated Dots */}
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-2 w-2 rounded-full bg-primary animate-bounce"
                                style={{
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;

//export default function Loading() {
//     return (
//         <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
//             <img src="/images/logo_nombre.svg" className="w-36" alt="Logo"/>
//             <div className="flex items-center justify-center space-x-2 mt-4">
//                 <div className="w-7 h-7 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
//                 <p className="text-black">Carregant...</p>
//             </div>
//         </div>
//     );
// }