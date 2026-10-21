# Robiotics – Backend

API de Robiotics, un sistema para gestionar intervenciones quirúrgicas robóticas: pacientes, doctores, órganos, medicamentos e intervenciones. Es el backend del TP de Desarrollo de Software (UTN FRRO).

- Frontend: https://github.com/rosariomolinas/FrontEnd
- Documentación del TP (propuesta, minutas, API): [docs/README.md](docs/README.md)

## Tecnologías

Node.js (18 o superior), TypeScript, Express, MongoDB Atlas y Mongoose.

## Instalación

```bash
git clone https://github.com/rosariomolinas/BackEnd.git
cd BackEnd
npm install
cp .env.example .env
```

Completá el `.env` con los datos de tu cluster de MongoDB Atlas (`mongo_url`, `db_user`, `db_password`) y un `SESSION_SECRET`. Las variables están explicadas en [.env.example](.env.example).

## Ejecución

| Comando | Qué hace |
|:-|:-|
| `npm run dev` | Levanta la API con recarga automática (tsx) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Levanta la versión compilada (correr antes `npm run build`) |
| `npm run typecheck` | Verifica los tipos sin compilar |
| `npm test` | Corre los tests |

La API queda en `http://localhost:8080/robiotics` (o el `PORT` del `.env`). `GET /health` responde `{"status":"ok"}` para verificar que está arriba.

## Usuario inicial

El login valida contra la colección `usuarios`. Para crear un administrador, insertá en esa colección un documento como:

```json
{ "user": "admin", "password": "admin", "profile": "admin" }
```

Los perfiles válidos son `admin` y `user`.

## Estructura

El código está organizado por entidad: cada carpeta tiene su modelo, sus validaciones y sus rutas.

```
src/server.ts            arranque: carga .env, conecta la base y levanta el servidor
src/app.ts               configuración de Express (CORS, JSON, rutas, errores)
src/routes.ts            monta las rutas de cada entidad bajo /robiotics
src/paciente/            paciente.model.ts, paciente.validator.ts, paciente.routes.ts
src/doctor/              ídem para doctores
src/organo/              ídem para órganos (+ /traertodos con costos)
src/medicamento/         modelo y listado de medicamentos
src/intervencion/        modelo, validaciones, servicio, controller y rutas de intervenciones
src/usuario/             login, cambio de contraseña y logout
src/shared/              piezas comunes: errores, validación, auth, conexión a la base
src/shared/crud/         servicio, controller y router genéricos que usan pacientes, doctores y órganos
```

## Errores

Todas las respuestas tienen la forma `{ "data": [...], "message": "..." }`. Ante un error se devuelve el código HTTP que corresponde (400 datos inválidos, 401 sin sesión, 404 no encontrado, 500 error interno) y, en las validaciones, un array `errors` con el detalle.
