# Robiotics – Backend

API de Robiotics, un sistema para gestionar intervenciones quirúrgicas robóticas: pacientes, doctores, órganos, medicamentos e intervenciones. Es el backend del TP de Desarrollo de Software (UTN FRRO).

- Frontend: https://github.com/rosariomolinas/FrontEnd
- Documentación del TP (propuesta, minutas, API): [docs/README.md](docs/README.md)

## Tecnologías

Node.js (18 o superior), TypeScript, Express, MongoDB Atlas y Mongoose. Login propio con bcrypt y JWT. Tests con Jest, Supertest y mongodb-memory-server.

## Instalación

```bash
git clone https://github.com/rosariomolinas/BackEnd.git
cd BackEnd
npm install
cp .env.example .env
```

Completá el `.env` con los datos de tu cluster de MongoDB Atlas (`mongo_url`, `db_user`, `db_password`) y un `JWT_SECRET`. Las variables están explicadas en [.env.example](.env.example).

## Ejecución

| Comando | Qué hace |
|:-|:-|
| `npm run dev` | Levanta la API con recarga automática (tsx) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Levanta la versión compilada (correr antes `npm run build`) |
| `npm run typecheck` | Verifica los tipos sin compilar |
| `npm run seed` | Carga usuarios, órganos y medicamentos iniciales si esas colecciones están vacías |
| `npm test` | Corre todos los tests |
| `npm run test:unit` | Solo los tests unitarios |
| `npm run test:integration` | Solo el test de integración |

La API queda en `http://localhost:8080/robiotics` (o el `PORT` del `.env`). `GET /health` responde `{"status":"ok"}` para verificar que está arriba.

## Usuario inicial

`npm run seed` crea los usuarios `admin` (contraseña `admin`, perfil admin) y `user` (contraseña `user`, perfil user) si todavía no hay usuarios. Cambiá esas contraseñas después de entrar.

Las contraseñas se guardan con bcrypt. Si en la base quedó algún usuario viejo con la contraseña en texto plano, se convierte a hash la primera vez que inicia sesión.

## Tests

| Archivo | Tipo | Qué prueba |
|:-|:-|:-|
| [tests/unit/validaciones.test.ts](tests/unit/validaciones.test.ts) | Unitario (integrante 1) | Validaciones de pacientes, doctores, códigos y usuarios |
| [tests/unit/intervencion.reglas.test.ts](tests/unit/intervencion.reglas.test.ts) | Unitario (integrante 2) | Reglas de negocio de los dos casos de uso: ruta, costo, tiempo y resultado |
| [tests/integration/api.test.ts](tests/integration/api.test.ts) | Integración | La API completa por HTTP contra una base MongoDB en memoria: login, 401/403, CRUD de pacientes, planificar y registrar resultado |

El test de integración no usa Atlas: `mongodb-memory-server` levanta un MongoDB temporal (la primera vez lo descarga, puede tardar). La salida de la última corrida está en [docs/tests.md](docs/tests.md).

## Estructura

El código está organizado por entidad: cada carpeta tiene su modelo, sus validaciones y sus rutas.

```
src/server.ts            arranque: carga .env, conecta la base y levanta el servidor
src/app.ts               configuración de Express (CORS, JSON, rutas, errores)
src/routes.ts            monta /auth (público) y el resto de las rutas, protegidas con JWT, bajo /robiotics
src/paciente/            paciente.model.ts, paciente.validator.ts, paciente.routes.ts
src/doctor/              ídem para doctores
src/organo/              ídem para órganos
src/medicamento/         ídem para medicamentos
src/intervencion/        modelo, reglas de negocio, validaciones, servicio, controller y rutas
src/usuario/             login, cambio de contraseña y ABM de usuarios
src/seed.ts              datos iniciales (npm run seed)
tests/                   tests unitarios y de integración
src/shared/              piezas comunes: errores, validación, auth (JWT y perfiles), conexión a la base
src/shared/crud/         servicio, controller y router REST genéricos que usan pacientes, doctores, órganos y medicamentos
```

## API y permisos

La API es REST (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) y todo, salvo el login, exige un JWT. El detalle de endpoints, perfiles y reglas está en [docs/api.md](docs/api.md).

## Errores

Todas las respuestas tienen la forma `{ "data": ..., "message": "..." }`. Ante un error se devuelve el código HTTP que corresponde (400 datos inválidos, 401 sin sesión, 403 sin permiso, 404 no encontrado, 409 conflicto, 500 error interno) y, en las validaciones, un array `errors` con el detalle.
