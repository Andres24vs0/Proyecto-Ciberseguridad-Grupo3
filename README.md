# Proyecto de Ciberseguridad - Grupo 3
Este proyecto se centra en el análisis, explotación y remediación de los siguientes riesgos principales (Aunque se ataquen algunos otros también):
*   **OWASP A01:2025 Broken Access Control**
*   **OWASP A10:2025 Mishandling of exceptional conditions**

## Stack Tecnológico

El ecosistema debe ser desplegado de forma local utilizando el hipervisor **VirtualBox (Versión 7.2.4)**. Las máquinas virtuales deben estar comunicadas a través de una Red NAT la cual cuente con un servicio DHCP integrado.

### Máquina Servidor (Aplicación y Base de Datos)
*   **Sistema Operativo:** Ubuntu Server 26.04 LTS (64 bits).
*   **Recursos:** 2048 MB de memoria RAM y Disco virtual dinámico de 25.00 GB.
*   **Entorno de Ejecución:** Node.js (Versión 22.22.1) - Puerto 3000.
*   **Motor de Base de Datos:** PostgreSQL (Versión 18.4) - Puerto 5432.
*   **Repositorio:** El código es descargado directamente desde Github (https://github.com/Andres24vs0/Proyecto-Ciberseguridad-Grupo3).

### Máquina Atacante
*   **Sistema Operativo:** Kali Linux (Versión 2026.1).
*   **Recursos:** 4096 MB de memoria RAM, 2 Procesadores Lógicos y Disco virtual de ~80 GB.
*   **Herramientas de Explotación Recomendadas:** 
    *   Burp Suite Community Edition (Versión 2026.3.2).
    *   Script malicioso automatizado en Python.

---

## Manual de Despliegue

### Paso Inicial: Clonar el Repositorio
```bash
git clone https://github.com/Andres24vs0/Proyecto-Ciberseguridad-Grupo3.git
cd Proyecto-Ciberseguridad-Grupo3
```

### 1. Despliegue de la Versión Vulnerable

**Instalar dependencias:**
```bash
npm install
```
**Resetear y crear la base de datos no segura:**
```bash
sudo -u postgres psql -d proyecto_grupo3 -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
sudo -u postgres psql -d proyecto_grupo3 -f tablas.sql
sudo -u postgres psql -d proyecto_grupo3 -f inserts.sql
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'clavada123';"
```
**Ejecutar el servidor:**
```bash
node src/app.js
```

### 2. Despliegue de la Versión Asegurada

**Cambiar a la rama Versión-Asegurada e instalar dependencias:**
```bash
git switch Versión-Asegurada
npm install
```
**Configurar variables de entorno:**
Crea un archivo llamado `.env` en la raíz del proyecto:
```bash
nano .env
```
Y llénalo con la siguiente información:
```env
DB_USER=app_grupo3
DB_HOST=localhost
DB_NAME=proyecto_grupo3
DB_PASSWORD=ClaveAppGrupo3_2026
DB_PORT=5432
PORT=3000
```
**Resetear y aplicar la base de datos segura:**
```bash
sudo -u postgres psql -d proyecto_grupo3 -f tablas.sql
sudo -u postgres psql -d proyecto_grupo3 -f inserts.sql
```
**Ejecutar el servidor de forma segura:**
Utilizando la bandera nativa de Node.js para las credenciales:
```bash
node --env-file=.env src/app.js
```


## Autores
*   Daniel Castaldo
*   Mariadelia Finizola
*   Violeta Semprúm
*   Andrea Torres
*   Andrés Valdivieso
