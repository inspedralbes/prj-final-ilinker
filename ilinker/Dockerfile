# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos clave de configuración primero
COPY package.json package-lock.json ./

# Instala las dependencias necesarias
RUN npm install

# Copia el resto del código fuente al contenedor
COPY . .

# Expone el puerto de desarrollo de Next.js
EXPOSE 5173

# Comando de inicio
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
