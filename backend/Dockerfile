# instala la imagen de python
FROM python:3.11.9-slim

# establece el directorio de trabajo
WORKDIR /app

# instala las dependencias
COPY requirements.txt .
RUN pip install -r requirements.txt

# copia el código fuente
COPY . .

# expone el puerto
EXPOSE 8010

# ejecuta el servidor
CMD ["gunicorn", "-b", "0.0.0.0:8010", "app:app"]