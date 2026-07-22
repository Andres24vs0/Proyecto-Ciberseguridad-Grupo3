//Generador manual de inserts SQL para la tabla de 'usuarios' 
// almacenamiento seguro de contraseñas con salting y key stretching

// Se utiliza el modulo nativo de Node.js de criptografía 
import crypto from 'crypto';

// Al aplicar 10000 iteraciones se ralentiza el cómputo del hash. 
// Mitiga ataques de fuerza bruta o de diccionario
const INTERACCIONES = 10000;
// Función de hashing de contraseñas mediante lógica manual
// Se implementa salting y estiramiento de clave
function hashContraManual(contra){
    //Se generan 16 bytes de entropía criptográficamente segura
    // convertidos a una cadena de 32 caracteres hexadecimales
    // 2 usuarios con la misma contraseña tendrán hashes distintos evitando ataques exitosos de Rainbow tables
    const salt = crypto.randomBytes(16).toString('hex');
    // Concatenación inicial de la contraseña con el valor aleatorio del salt
    let hash = contra + salt;
    //Bucle manual de Key stretching (SHA-256 Iterativo)
    for (let i=0; i < INTERACCIONES; i++){
        hash = crypto.createHash('sha256').update(hash).digest('hex');
    }

    // Formato de almacenamiento unificaso salt:hash
    // Devuelve el salt y hash concatenados por dos puntos
    // En el login el backend extrae el salt original para recomputar la verificación sin crear columnas adicionales
    // en la tabla de usuarios
    return `${salt}:${hash}`;
}

//Conjunto de usuarios iniciales
const usuarios = [
    ['Carlos Gómez', 'carlos.gomez@ejemplo.com', 'pass1234'],
    ['Ana Martínez', 'ana.martinez@ejemplo.com', 'anaPass2024'],
    ['Luis Rodríguez', 'luis.rodriguez@ejemplo.com', 'luis_secure'],
    ['Sofia López', 'sofia.lopez@ejemplo.com', 'sofia789'],
    ['Javier Hernández', 'javier.h@ejemplo.com', 'javierPass'],
    ['Elena Torres', 'elena.torres@ejemplo.com', 'elena2024!'],
    ['Alejandro Díaz', 'alejandro.d@ejemplo.com', 'alex_clave'],
    ['Carmen Ruiz', 'carmen.ruiz@ejemplo.com', 'carmen_db'],
    ['Fernando Morales', 'fernando.m@ejemplo.com', 'fer12345'],
    ['Valentina Castro', 'valentina.c@ejemplo.com', 'valen_secret'],
    ['Ricardo Vargas', 'ricardo.vargas@ejemplo.com', 'rick_pass'],
    ['Camila Mendoza', 'camila.m@ejemplo.com', 'cami_99'],
    ['Gabriel Ortiz', 'gabriel.ortiz@ejemplo.com', 'gabo_key'],
    ['Isabella Silva', 'isabella.s@ejemplo.com', 'isa_2024'],
    ['Mateo Ramos', 'mateo.ramos@ejemplo.com', 'mateo_00'],
    ['Lucía Romero', 'lucia.romero@ejemplo.com', 'lucia_pass'],
    ['Daniel Navarro', 'daniel.n@ejemplo.com', 'dani_clave'],
    ['Mariana Delgado', 'mariana.d@ejemplo.com', 'mariana_123'],
    ['Andrés Gil', 'andres.gil@ejemplo.com', 'andres_pwd'],
    ['Paula Reyes', 'paula.reyes@ejemplo.com', 'paula_safe'],
];

// Generación del script de Insert
console.log('INSERT INTO usuarios (nombre, email, contra) VALUES');

usuarios.forEach(([nombre, email, contra], i) => {
    // Generación del hash manual para la contraseña del usuario actual
    const hash = hashContraManual(contra);
    // Formateo de puntuación SQL (, para elementos intermedios, ; al final)
    const coma = i < usuarios.length - 1 ? ',' : ';';
    // Escape manual de comillas simples
    // Previene errores de sintaxis en el script SQL
    console.log(`('${nombre.replace(/'/g, "''")}', '${email}', '${hash}')${coma}`);
});