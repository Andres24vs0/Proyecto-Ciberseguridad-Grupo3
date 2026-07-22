BEGIN;

--Limpieza del entorno
DROP TABLE IF EXISTS sesiones CASCADE; 
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Se revocan los permisos públicos que PostgreSQL otorga por defecto
-- Se aplica "Denegación por defecto" impidiendo que un usuario no autenticado
-- inspeccione el esquema o interactue con los datos
REVOKE ALL ON DATABASE proyecto_grupo3 FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Crear la tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contra VARCHAR(255) NOT NULL, -- Se espera un formato salt:hash
    -- La fecha permite realizar auditorías y análisis forense 
    -- Garantiza consistencia en los logs
    -- El tiempo esta seteado automáticamente de modo que el usuario o desde el backend
    -- no se manipule el tiempo de registro
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Optimiza la velocidad de respuesta en la autenticación y validación anti-IDOR
-- Previene degradaciones de rendimiento
CREATE INDEX idx_usuarios_email ON usuarios (email);

-- Crear la tabla sesiones 
-- Apto para la mitigación manual de Broken Acces Control (OWASP A01)
-- Esto para permitir la revocación inmediata de tokens
CREATE TABLE sesiones (
    id SERIAL PRIMARY KEY, 
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    -- con Varchar(64) UNIQUE almacena tokens de alta entropía
    token VARCHAR(64) NOT NULL UNIQUE,
    -- En caso de auditoría de ciclo de vida de la sesión
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMPTZ NOT NULL, 
    activo BOOLEAN NOT NULL DEFAULT TRUE -- permite el logout
);

--índices de sesión
CREATE INDEX idx_sesiones_token_activo ON sesiones (token, activo);
CREATE INDEX idx_sesiones_usuario_activo ON sesiones (usuario_id, activo);

-- Crear la tabla Productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    -- Restricción check 
    -- Para la "Defensa en profundidad" para que la base de datos rechace de forma nativa
    -- valores negativos para prevenir ataques de manipulación de parámetros
    precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0)
);

-- Se aplica el "Principio de menor privilegio"
-- Se crea un rol exclusivo de servicio para que la app opere con un perfil de acceso límitado
DO $$
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_grupo3') THEN 
        ALTER ROLE app_grupo3 WITH LOGIN PASSWORD 'ClaveAppGrupo3_2026';
    ELSE 
        CREATE ROLE app_grupo3 WITH LOGIN PASSWORD 'ClaveAppGrupo3_2026';
    END IF;
END
$$;

-- Se asignan los privilegios mínimos 
-- Conexión y visibilidad mínima del esquema
GRANT CONNECT ON DATABASE proyecto_grupo3 TO app_grupo3;
GRANT USAGE ON SCHEMA public TO app_grupo3;

-- Permisos por tabla para la operación necesaria del backend
-- usuarios: login, registro y actualizar contraseña
GRANT SELECT, INSERT, UPDATE ON TABLE usuarios TO app_grupo3;

-- sesiones: crear tokens, consultar vigencia, invalidar sesiones
GRANT SELECT, INSERT, UPDATE ON TABLE sesiones TO app_grupo3;

-- productos: solo lectura, si el backend o el endpoint de productos sufren una vulnerabilidad
-- el atacante no puede modificar ni borrar el catálogo
GRANT SELECT ON TABLE productos TO app_grupo3;

-- Generación de IDs autoincrementales
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_grupo3;

COMMIT;