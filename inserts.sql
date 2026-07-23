BEGIN;
-- Se limpian las tablas, se puede comentar en caso que no se desee
TRUNCATE TABLE sesiones RESTART IDENTITY CASCADE;
TRUNCATE TABLE productos RESTART IDENTITY CASCADE;
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;

-- Insertar 20 usuarios (versión vulnerable)
/*INSERT INTO usuarios (nombre, email, contra) VALUES
('Carlos Gómez', 'carlos.gomez@ejemplo.com', 'pass1234'),
('Ana Martínez', 'ana.martinez@ejemplo.com', 'anaPass2024'),
('Luis Rodríguez', 'luis.rodriguez@ejemplo.com', 'luis_secure'),
('Sofia López', 'sofia.lopez@ejemplo.com', 'sofia789'),
('Javier Hernández', 'javier.h@ejemplo.com', 'javierPass'),
('Elena Torres', 'elena.torres@ejemplo.com', 'elena2024!'),
('Alejandro Díaz', 'alejandro.d@ejemplo.com', 'alex_clave'),
('Carmen Ruiz', 'carmen.ruiz@ejemplo.com', 'carmen_db'),
('Fernando Morales', 'fernando.m@ejemplo.com', 'fer12345'),
('Valentina Castro', 'valentina.c@ejemplo.com', 'valen_secret'),
('Ricardo Vargas', 'ricardo.vargas@ejemplo.com', 'rick_pass'),
('Camila Mendoza', 'camila.m@ejemplo.com', 'cami_99'),
('Gabriel Ortiz', 'gabriel.ortiz@ejemplo.com', 'gabo_key'),
('Isabella Silva', 'isabella.s@ejemplo.com', 'isa_2024'),
('Mateo Ramos', 'mateo.ramos@ejemplo.com', 'mateo_00'),
('Lucía Romero', 'lucia.romero@ejemplo.com', 'lucia_pass'),
('Daniel Navarro', 'daniel.n@ejemplo.com', 'dani_clave'),
('Mariana Delgado', 'mariana.d@ejemplo.com', 'mariana_123'),
('Andrés Gil', 'andres.gil@ejemplo.com', 'andres_pwd'),
('Paula Reyes', 'paula.reyes@ejemplo.com', 'paula_safe');*/

-- Usuarios con seguridad aplicada
-- Se almacena de forma segura las contraseñas (OWASP A02:2025)
-- No se guardan las contraseñas en texto plano
-- Salt aleatorio único por usuarios y jey stretching de 10000 uteraciones
-- Mitiga ataques de fuerza bruta y rainbow tables
-- Formato: salt:hash

INSERT INTO usuarios (nombre, email, contra) VALUES
('Carlos Gómez', 'carlos.gomez@ejemplo.com', '1b5763804c49d37d9cb5b9f9bb105691:e334aec1a7c8ce40aaf46c0b46e2560fa673159636a5249f9da77128b0e9d382'),
('Ana Martínez', 'ana.martinez@ejemplo.com', 'f8800acb54eeb4e8226bce9a62af1721:7d06ca4906fe3895bf8b0440f929ac90753b48473d19ecf0bc6d8c459dfa6783'),
('Luis Rodríguez', 'luis.rodriguez@ejemplo.com', 'c886951bf9c0c8e46d9816f85d76838f:a1f002994b7681cebfacc103b8d2c475cfe4b508949ebfcf537c8a4a8dcd1931'),
('Sofia López', 'sofia.lopez@ejemplo.com', '077b222286e292396b206afffb19d9df:67e956f96d8388c8dd3c0335f56b1f627d6548228ccbe8f1045b60d4001b1177'),
('Javier Hernández', 'javier.h@ejemplo.com', 'd10342477b56ab9e5c677ad0c70ba9dd:94216fbc13c62b789de3112fc278fbbc7a4e237e9f2ac42b3e44586d62ec7160'),
('Elena Torres', 'elena.torres@ejemplo.com', '2019909ef8384ae66c506a05341832c0:28283a862802ec2bf915b6361e3d71ebaa0791da944c5f87d2bbd217d5065cde'),
('Alejandro Díaz', 'alejandro.d@ejemplo.com', '0fe0a7a1b7ef9c9b0d3d2a9b2847e5a0:080c24d9a146baf3dc9f2beb302edc19b2d654a2338ade44aa2fceaf40e31b09'),
('Carmen Ruiz', 'carmen.ruiz@ejemplo.com', '97a74e295ba8e1a5d1064d28a906a21d:0f97640796d5a2d83b6c56056064f2a7df884fc81d9e62add23d28bf9cd87b2a'),
('Fernando Morales', 'fernando.m@ejemplo.com', '331a6f9584faecbeac95051c7888bb8a:0a621a53f206cb24999052d9a8c0363a6c13b7a7e3bcf488557fa4a1aefededa'),
('Valentina Castro', 'valentina.c@ejemplo.com', 'fcbd4ba7ad4edaaa0534d485ba823e41:42c20f17be6a57f8ed57ef63273f61ddf1437039418bee0d162e776826087412'),
('Ricardo Vargas', 'ricardo.vargas@ejemplo.com', '1dfb5bea508dd38cbe4bfae64ac02d02:43abdf76fcd87576dc090033f7fbd618f1a896a21cc3a8bcb89e874b9e153ad7'),
('Camila Mendoza', 'camila.m@ejemplo.com', '844d507da421bc99df1afa1199740b6c:25db4b9d4c3c2ed2c47a5170ea06553d7029c9f16a2e5ddcb92785e004f82187'),
('Gabriel Ortiz', 'gabriel.ortiz@ejemplo.com', '713222d3053d7f8ef9d4d482fd7f4d8c:d783706573f7d3fb4c40cc2a9a48e4800eaac80e7e6fb528a0db9970f995fa72'),
('Isabella Silva', 'isabella.s@ejemplo.com', 'a16ccc8f10cc4539bad284ff8cdf0b3e:471e7273403c97bdff6ad6f0fcca74342338ff76d41d896c4d9d632b1df31de6'),
('Mateo Ramos', 'mateo.ramos@ejemplo.com', '6897088475c45c48101e3eb7e43ed101:12e18e7b8abe65aa0af46423b474cfb8bde92dd19995a3e409784a6308aab3c0'),
('Lucía Romero', 'lucia.romero@ejemplo.com', 'a8b7366384dc88f3825d6ada5b5d7a17:51557826fd22e144c19d0446c591541999d8b4d28f6fe7ea316a45f90b7f72b8'),
('Daniel Navarro', 'daniel.n@ejemplo.com', 'bb36adec83beb9d7e18c51030812605e:eae00b765f8a221bac79dcd053c20b5ff707a7aaed180d99499521c8f96fdff9'),
('Mariana Delgado', 'mariana.d@ejemplo.com', 'd24351a059f2f714e768e2f63a8659e8:122b91e0329eb676bc21298e234f0e561a019977a8c1fcb54a136d78edac4c67'),
('Andrés Gil', 'andres.gil@ejemplo.com', 'e2e0c1e783f6cae67a337ceb8c7ae1ce:9cb581efab344e17568a96cdfc42552376ea4059b78277628af5d2e0d8b1e390'),
('Paula Reyes', 'paula.reyes@ejemplo.com', '17572c6a6d5ddcbba8744c48c939122a:f4252b9829fe47db8313a1512e72fe4220f02e668f602087d90d1b9041703912');

-- Insertar 20 productos
-- Los precios y stocks estan protegidos en la BD por restricciones

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop Gamer', 'Laptop procesador Intel i7, 16GB RAM y GPU RTX 4060', 1450.00, 15),
('Teclado Mecánico', 'Teclado RGB switch azul distribución en español', 65.50, 35),
('Monitor 27"', 'Monitor IPS 144Hz 1ms Full HD con tecnología FreeSync', 220.00, 12),
('Auriculares Bluetooth', 'Auriculares circumaurales con cancelación activa de ruido', 85.00, 40),
('Disco Duro Externo 2TB', 'Almacenamiento portátil USB 3.0 para respaldo', 75.99, 25),
('Memoria RAM 16GB', 'Módulo DDR4 3200MHz para computadora de escritorio', 45.00, 50),
('Silla Ergonómica', 'Silla de escritorio transpirable con soporte lumbar', 180.00, 8),
('Cámara Web HD', 'Webcam 1080p con micrófono estéreo integrado', 35.00, 30),
('Impresora Multifuncional', 'Impresora a color con conexión Wi-Fi y escáner', 130.00, 10),
('Tablet 10 pulgadas', 'Tablet Android con pantalla FHD y 64GB almacenamiento', 190.00, 18),
('Cargador Carga Rápida', 'Cargador USB-C de 65W para laptop y smartphones', 25.00, 60),
('Mando de Juego', 'Gamepad inalámbrico compatible con PC y consola', 50.00, 22),
('Tarjeta de Video', 'GPU RTX 3060 12GB GDDR6', 380.00, 7),
('Micrófono USB', 'Micrófono de condensador ideal para podcast y streaming', 55.00, 15),
('Router Wi-Fi 6', 'Enrutador Gigabit de alta velocidad para juegos', 95.00, 20),
('Pendrive 128GB', 'Memoria USB 3.2 metálica de alta velocidad', 18.50, 100),
('Base Enfriadora Laptop', 'Soporte con 5 ventiladores silenciosos y luces LED', 28.00, 30),
('Altavoces de Escritorio', 'Parlantes estéreo 2.0 con alimentación por USB', 22.00, 40),
('Disco SSD NVMe 1TB', 'Unidad de estado sólido M.2 PCIe 4.0 ultra rápida', 90.00, 28),
('Hub USB-C 7 en 1', 'Adaptador con HDMI 4K, lector SD y 3 puertos USB 3.0', 32.50, 45);

COMMIT;