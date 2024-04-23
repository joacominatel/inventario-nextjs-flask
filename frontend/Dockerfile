# Usar la imagen base de Node
FROM node:latest 

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Compila la aplicación
RUN npm run build

# Expone el puerto
EXPOSE 3000

# Ejecuta la aplicación
CMD ["npm", "start"]