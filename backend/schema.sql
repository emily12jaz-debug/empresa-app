-- Esquema completo de ERGOSEATING (se puede ejecutar varias veces sin romper nada)

CREATE TABLE IF NOT EXISTS roles (
  id_rol  SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre  VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO roles (nombre) VALUES ('Cliente'), ('Administrador') ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_rol          SMALLINT NOT NULL REFERENCES roles(id_rol),
  correo          VARCHAR(150) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_acceso   TIMESTAMP NULL,
  fecha_registro  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_correo_unico ON usuarios (LOWER(correo));

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario        INTEGER NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  nombres           VARCHAR(80) NOT NULL,
  apellido_paterno  VARCHAR(60) NOT NULL,
  apellido_materno  VARCHAR(60) NULL,
  fecha_nacimiento  DATE NOT NULL,
  telefono          VARCHAR(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS administradores (
  id_admin          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario        INTEGER NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  nombres           VARCHAR(80) NOT NULL,
  apellido_paterno  VARCHAR(60) NOT NULL,
  apellido_materno  VARCHAR(60) NULL,
  telefono          VARCHAR(15) NULL
);

-- ===== Inventario =====
CREATE TABLE IF NOT EXISTS productos (
  id_producto  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo       VARCHAR(120) NOT NULL,
  modelo       VARCHAR(60)  NOT NULL,
  precio       NUMERIC(10,2) NOT NULL CHECK (precio > 0),
  descripcion  TEXT NOT NULL DEFAULT '',
  imagen       VARCHAR(20) NOT NULL DEFAULT 'silla1',   -- silla1 | silla2 | silla3
  activo       BOOLEAN NOT NULL DEFAULT TRUE,           -- FALSE = "eliminado" (se conserva el historial)
  actualizado  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== Carrito (una fila por producto y cliente) =====
CREATE TABLE IF NOT EXISTS carrito_items (
  id_usuario   INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_producto  INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
  cantidad     INTEGER NOT NULL CHECK (cantidad > 0),
  agregado     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario, id_producto)
);

-- ===== Pedidos =====
CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario  INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  estado      VARCHAR(15) NOT NULL DEFAULT 'Pedido'
              CHECK (estado IN ('Pedido','Pendiente','Enviado','Finalizado','Cancelado')),
  total       NUMERIC(12,2) NOT NULL,
  fecha       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS pedidos_usuario_idx ON pedidos (id_usuario);

-- Se guarda una "foto" del producto al comprar: si luego cambia el precio o se elimina, el pedido no se altera
CREATE TABLE IF NOT EXISTS pedido_detalle (
  id_detalle       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_pedido        INTEGER NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  id_producto      INTEGER REFERENCES productos(id_producto) ON DELETE SET NULL,
  titulo           VARCHAR(120) NOT NULL,
  modelo           VARCHAR(60)  NOT NULL,
  precio_unitario  NUMERIC(10,2) NOT NULL,
  cantidad         INTEGER NOT NULL CHECK (cantidad > 0)
);

-- Productos iniciales (solo si la tabla está vacía)
INSERT INTO productos (titulo, modelo, precio, descripcion, imagen)
SELECT * FROM (VALUES
  ('Butac Ergo. 1', 'ERGO-E100', 1000.00, 'Silla escolar ergonómica ideal para primaria.', 'silla1'),
  ('Butac Ergo. 2', 'ERGO-E200', 2000.00, 'Estructura reforzada para secundaria y preparatoria.', 'silla2'),
  ('Butac Ergo. 3', 'ERGO-E300', 3000.00, 'Butaca ejecutiva ajustable con paleta amplia.', 'silla3')
) AS v(titulo, modelo, precio, descripcion, imagen)
WHERE NOT EXISTS (SELECT 1 FROM productos);
