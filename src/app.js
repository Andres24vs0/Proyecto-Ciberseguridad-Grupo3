import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Indicar a Express dónde está el frontend
app.use(express.static(join(__dirname, "public")));

// Registro de tráfico (Access Log)
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
    
    // Esto imprimirá CADA petición que reciba el servidor
    console.log(`[ACCESS LOG - ${timestamp}] IP: ${req.ip} | Método: ${req.method} | Ruta solicitada: ${req.originalUrl}`);
    next();
});

// Enrutadores de la API
app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);

// Ruta base que sirve el HTML principal
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
