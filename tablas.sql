-- Crear la tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contra VARCHAR(255) NOT NULL
);

-- Crear la tabla Productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL
);
