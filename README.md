# ERGOSEATING

Tienda de butacas ergonómicas. React (empresa-app) + Node/Express (backend) + PostgreSQL.

## Correrlo en tu computadora

1. **Backend** (carpeta `backend`)
   ```
   npm install
   copy .env.example .env      (llena tus datos en .env)
   npm run db:init             (crea/actualiza las tablas)
   npm run admin -- correo@ejemplo.com Clave12345 "Nombre" "Apellido"
   npm start
   ```
2. **Frontend** (carpeta `empresa-app`)
   ```
   npm install
   npm start
   ```
   Se abre en http://localhost:3000

## Estructura de la base de datos

`roles` → `usuarios` → `clientes` / `administradores`
`productos` (inventario) · `carrito_items` · `pedidos` → `pedido_detalle`

El esquema completo está en `backend/schema.sql`.

## Publicarlo en internet

Base de datos en **Neon**, backend en **Render**, frontend en **Vercel**. Las variables que necesita cada servicio están en `backend/.env.example` y `empresa-app/.env.example`.
