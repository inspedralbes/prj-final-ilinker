/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    // esto Esta comentado para que funciona el login de google pero si descomentas OUTPUT va salir error y no va funcionar el login de google
    
    // output: 'export',
};

export default nextConfig;
