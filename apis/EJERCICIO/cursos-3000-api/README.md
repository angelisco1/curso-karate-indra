# 🎓 EduPlatform API

API REST para plataforma de cursos online construida con Node.js y Express.

## 📋 Características

- Gestión de cursos (CRUD completo)
- Gestión de estudiantes (registro, actualización, eliminación)
- Sistema de inscripciones con integración de pagos (Pagalo 3000)
- Arquitectura en capas (Controllers, Services, Repositories)
- Validaciones centralizadas
- Manejo de errores personalizado

## 🏗️ Estructura del Proyecto

```
eduplatform-api/
├── src/
│   ├── config/           # Configuración (DB, variables de entorno)
│   ├── models/           # Modelos de datos
│   ├── repositories/     # Capa de acceso a datos
│   ├── services/         # Lógica de negocio
│   ├── controllers/      # Controladores HTTP
│   ├── validators/       # Validaciones
│   ├── middlewares/      # Middlewares (errores, etc.)
│   ├── utils/            # Utilidades
│   ├── routes/           # Definición de rutas
│   └── app.js            # Configuración de Express
├── server.js             # Punto de entrada
└── package.json
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Iniciar servidor
npm start
```

## 📝 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3005
NODE_ENV=development
PAGALO3000_URL=http://localhost:3006/api/pagos
```

## 📚 Endpoints

### Cursos

- `GET /api/cursos` - Listar cursos (soporta filtros: categoria, nivel, precioMax)
- `GET /api/cursos/:id` - Obtener detalle de un curso
- `POST /api/cursos` - Crear nuevo curso
- `PUT /api/cursos/:id` - Actualizar curso completo
- `PATCH /api/cursos/:id` - Actualizar curso parcialmente
- `DELETE /api/cursos/:id` - Eliminar curso

### Estudiantes

- `GET /api/estudiantes/:id` - Obtener perfil de estudiante
- `GET /api/estudiantes/:id/inscripciones` - Listar inscripciones del estudiante
- `POST /api/estudiantes` - Crear cuenta de estudiante
- `PUT /api/estudiantes/:id` - Actualizar perfil completo
- `PATCH /api/estudiantes/:id` - Actualizar perfil parcialmente
- `DELETE /api/estudiantes/:id` - Eliminar cuenta

### Inscripciones

- `GET /api/inscripciones/:id` - Obtener detalle de inscripción
- `GET /api/inscripciones/cursos/:cursoId/inscripciones` - Listar inscripciones de un curso
- `POST /api/inscripciones` - Crear inscripción (procesa pago)
- `PATCH /api/inscripciones/:id` - Actualizar estado de inscripción
- `DELETE /api/inscripciones/:id` - Cancelar inscripción

### Health Check

- `GET /health` - Verificar estado del servidor

## 🔍 Ejemplos de Uso

### Crear un curso

```bash
curl -X POST http://localhost:3005/api/cursos \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Python para Data Science",
    "descripcion": "Aprende Python aplicado a ciencia de datos",
    "categoria": "programacion",
    "nivel": "intermedio",
    "precio": 129.99,
    "maxEstudiantes": 40,
    "fechaInicio": "2025-03-01",
    "fechaFin": "2025-05-31"
  }'
```

### Listar cursos con filtros

```bash
curl "http://localhost:3005/api/cursos?categoria=programacion&precioMax=150"
```

### Crear estudiante

```bash
curl -X POST http://localhost:3005/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana García",
    "email": "ana@example.com",
    "password": "password123",
    "telefono": "+34612345678"
  }'
```

### Inscribirse en un curso

```bash
curl -X POST http://localhost:3005/api/inscripciones \
  -H "Content-Type: application/json" \
  -d '{
    "estudianteId": 1,
    "cursoId": 1,
    "datosPago": {
      "numero": "4111111111111111",
      "cvv": "123",
      "expiracion": "12/25",
      "titular": "Ana García"
    }
  }'
```

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Axios** - Cliente HTTP para integración con Pagalo 3000
- **dotenv** - Gestión de variables de entorno

## 📦 Base de Datos

Actualmente utiliza una base de datos en memoria. Los datos se reinician al reiniciar el servidor.

## 🔐 Notas de Seguridad

⚠️ **Advertencia**: Esta es una API de demostración. En producción:
- Las contraseñas deben hashearse (bcrypt)
- Implementar autenticación JWT
- Usar una base de datos persistente
- Validar y sanitizar todas las entradas
- Implementar rate limiting
- Usar HTTPS

## 📄 Licencia

ISC
