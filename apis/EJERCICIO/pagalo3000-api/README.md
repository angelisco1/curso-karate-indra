# 💳 Pagalo 3000 - API de Gateway de Pagos

API de procesamiento de pagos con simulación de errores aleatorios para testing.

## 🏗️ Arquitectura

```
pagalo3000-api/
├── config/
│   └── database.js           # Configuración SQLite3
├── controllers/
│   └── pagos.controller.js   # Controladores HTTP
├── services/
│   └── pagos.service.js      # Lógica de negocio
├── repositories/
│   └── transacciones.repository.js  # Acceso a datos
├── validators/
│   └── pagos.validators.js   # Validaciones
├── utils/
│   └── helpers.js            # Funciones auxiliares
├── routes/
│   └── pagos.js              # Definición de rutas
└── data/
    └── pagalo3000.db         # Base de datos SQLite3
```

## 🚀 Instalación y Ejecución

```bash
cd pagalo3000-api
npm install
npm start
```

La API estará disponible en `http://localhost:3006`

---

## 📊 Endpoints

### 1. Listar Transacciones

**GET** `/api/pagos`

Lista todas las transacciones ordenadas por fecha (más recientes primero).

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "transaccionId": "TXN-ABC123",
    "estado": "aprobado",
    "cantidad": 99.99,
    "moneda": "EUR",
    "fechaTransaccion": "2025-12-15T11:04:15.123Z",
    "ultimosDigitos": "1111",
    "autorizacion": "AUTH-XYZ789",
    "referencia": "TEST-001",
    "reembolsado": false,
    "cantidadReembolsado": null
  }
]
```

---

### 2. Procesar Pago

**POST** `/api/pagos`

Procesa un pago con tarjeta. **25% de probabilidad de rechazo aleatorio**.

**Request Body:**
```json
{
  "cantidad": 99.99,
  "moneda": "EUR",
  "tarjeta": {
    "numero": "4111111111111111",
    "cvv": "123",
    "expiracion": "12/26",
    "titular": "JUAN PEREZ"
  },
  "referencia": "CURSO-456-EST-123"
}
```

**Respuesta aprobada (200):**
```json
{
  "transaccionId": "TXN-ABC123",
  "estado": "aprobado",
  "cantidad": 99.99,
  "moneda": "EUR",
  "fechaTransaccion": "2025-12-15T11:04:15.123Z",
  "ultimosDigitos": "1111",
  "autorizacion": "AUTH-XYZ789",
  "referencia": "CURSO-456-EST-123"
}
```

**Respuesta rechazada (200):**
```json
{
  "transaccionId": "TXN-DEF456",
  "estado": "rechazado",
  "codigoError": "FONDOS_INSUFICIENTES",
  "mensaje": "No hay fondos suficientes en la cuenta",
  "cantidad": 99.99,
  "moneda": "EUR",
  "fechaTransaccion": "2025-12-15T11:05:20.456Z",
  "ultimosDigitos": "1111",
  "referencia": "CURSO-456-EST-123"
}
```

**Errores posibles (400):**
- `El campo cantidad es requerido`
- `La cantidad debe ser mayor a 0`
- `El campo tarjeta es requerido`
- `El número de tarjeta es requerido`
- `El número de tarjeta debe tener entre 13 y 19 dígitos`
- `El CVV es requerido`
- `El CVV debe ser un número de 3 o 4 dígitos`
- `La fecha de expiración es requerida`
- `El formato de expiración debe ser MM/YY o MM/YYYY`
- `La tarjeta ha caducado`
- `El mes de expiración debe estar entre 01 y 12`

---

### 3. Consultar Transacción

**GET** `/api/pagos/:transaccionId`

Consulta los detalles de una transacción específica.

**Ejemplo:** `GET /api/pagos/TXN-ABC123`

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "transaccionId": "TXN-ABC123",
  "estado": "aprobado",
  "cantidad": 99.99,
  "moneda": "EUR",
  "fechaTransaccion": "2025-12-15T11:04:15.123Z",
  "ultimosDigitos": "1111",
  "autorizacion": "AUTH-XYZ789",
  "referencia": "CURSO-456-EST-123",
  "reembolsado": false,
  "cantidadReembolsado": null,
  "createdAt": "2025-12-15 11:04:15"
}
```

**Error (404):**
```json
{
  "error": "Transacción no encontrada"
}
```

---

### 4. Procesar Reembolso

**POST** `/api/pagos/:transaccionId/reembolso`

Reembolsa una transacción aprobada (total o parcialmente).

**Ejemplo:** `POST /api/pagos/TXN-ABC123/reembolso`

**Request Body:**
```json
{
  "cantidad": 50.00,
  "motivo": "Cliente insatisfecho"
}
```

**Respuesta exitosa (201):**
```json
{
  "reembolsoId": "REF-GHI789",
  "transaccionId": "TXN-ABC123",
  "cantidad": 50.00,
  "motivo": "Cliente insatisfecho",
  "estado": "procesado",
  "fechaReembolso": "2025-12-15T11:10:00.000Z"
}
```

**Errores posibles:**
- `404` - Transacción no encontrada
- `400` - Solo se pueden reembolsar transacciones aprobadas
- `400` - La cantidad del reembolso no puede ser mayor a la cantidad de la transacción

---

### 5. Health Check

**GET** `/api/health`

Verifica que la API está funcionando.

**Respuesta (200):**
```json
{
  "status": "OK",
  "servicio": "Pagalo 3000"
}
```

---

## 🎲 Simulación de Errores

La API simula un gateway de pagos real con **25% de probabilidad de rechazo**.

**Códigos de error posibles:**
- `TARJETA_CADUCADA` - La tarjeta ha caducado
- `FONDOS_INSUFICIENTES` - No hay fondos suficientes
- `TARJETA_BLOQUEADA` - Tarjeta bloqueada por el banco
- `CVV_INVALIDO` - CVV incorrecto

---

## ✅ Validaciones Implementadas

### Cantidad
1. Campo requerido
2. Debe ser mayor a 0

### Número de Tarjeta
3. Campo requerido
4. Formato válido (13-19 dígitos)
5. Acepta espacios (se eliminan automáticamente)

### CVV
6. Campo requerido
7. Solo dígitos numéricos
8. 3 o 4 dígitos (Amex usa 4)

### Fecha de Expiración
9. Campo requerido
10. Formato MM/YY o MM/YYYY
11. No puede estar caducada
12. Mes entre 01 y 12

---

## 💾 Base de Datos

La API usa **SQLite3** para persistencia de datos.

**Ubicación:** `data/pagalo3000.db`

**Tabla transacciones:**
```sql
CREATE TABLE transacciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaccionId TEXT UNIQUE NOT NULL,
  estado TEXT NOT NULL,
  cantidad REAL NOT NULL,
  moneda TEXT DEFAULT 'EUR',
  fechaTransaccion TEXT NOT NULL,
  ultimosDigitos TEXT NOT NULL,
  referencia TEXT,
  autorizacion TEXT,
  codigoError TEXT,
  mensaje TEXT,
  reembolsado INTEGER DEFAULT 0,
  cantidadReembolsado REAL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🧪 Ejemplos de Uso

### Tarjetas de Prueba

```
Visa: 4111111111111111
Mastercard: 5555555555554444
Amex: 378282246310005

CVV: cualquiera (123, 456, etc.)
Expiración: cualquier fecha futura (12/26, 01/27, etc.)
```

### Ejemplo con cURL

```bash
# Procesar pago
curl -X POST http://localhost:3006/api/pagos \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 99.99,
    "tarjeta": {
      "numero": "4111111111111111",
      "cvv": "123",
      "expiracion": "12/26"
    }
  }'

# Listar todas las transacciones
curl http://localhost:3006/api/pagos

# Consultar transacción específica
curl http://localhost:3006/api/pagos/TXN-ABC123

# Reembolsar
curl -X POST http://localhost:3006/api/pagos/TXN-ABC123/reembolso \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 50,
    "motivo": "Cancelación de servicio"
  }'
```

---

## 🔒 Campos de Respuesta

### transaccionId
ID único generado por Pagalo 3000 (formato: `TXN-XXXXXXX`)

### autorizacion
Código de autorización del banco (solo en pagos aprobados, formato: `AUTH-XXXXX`)

### ultimosDigitos
Últimos 4 dígitos de la tarjeta (para seguridad)

### reembolsado
Boolean que indica si la transacción ha sido reembolsada

### cantidadReembolsada
Cantidad total reembolsada (puede ser parcial)

---

## 🛠️ Tecnologías

- **Node.js** + **Express** - Framework web
- **SQLite3** - Base de datos
- **Arquitectura en capas:**
  - Controllers (HTTP)
  - Services (Lógica de negocio)
  - Repositories (Acceso a datos)
  - Validators (Validaciones)
  - Utils (Helpers)

---

## 📝 Notas

- Los pagos se procesan de forma síncrona
- La moneda por defecto es EUR
- Las transacciones se almacenan indefinidamente
- Los reembolsos pueden ser parciales o totales
- El campo `referencia` es opcional pero recomendado para tracking

---

**API creada para pruebas de Karate DSL** 🥋
