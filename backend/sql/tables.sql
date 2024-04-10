CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    workday_id VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    mail VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    win11_installed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_computadoras (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) NOT NULL,
    computer_id INTEGER REFERENCES computadoras(id) NOT NULL
);

CREATE TABLE computadoras (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    serie VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE accesorios (
    id SERIAL PRIMARY KEY,
    workday_id VARCHAR(10) REFERENCES usuarios(workday_id) NOT NULL,
    accesorio VARCHAR(100) NOT NULL,
    detalle VARCHAR(100),
    cantidad INTEGER DEFAULT 1,
    ticket VARCHAR(100) DEFAULT 'No tiene',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);