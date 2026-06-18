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

// 1. Indicar a Express dónde está el frontend
app.use(express.static(join(__dirname, "public")));

// Enrutadores de la API
app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);

// 2. Ruta base que sirve el HTML principal
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
