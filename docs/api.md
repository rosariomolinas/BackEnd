# API Robiotics

Base: `http://localhost:8080/robiotics`. Todos los endpoints son `POST` con body JSON y responden JSON.

Formato de respuesta: `{ "data": [...], "message": "..." }`. Errores: `400` datos inválidos (incluye `errors: [...]`), `401` sin sesión o token inválido, `404` no encontrado, `500` error interno.

## Usuarios – `/usuarios`

| Endpoint | Body | Respuesta |
|:-|:-|:-|
| `/validar` | `{ user, password }` | `{ data: true, token, user, profile }` o 401 |
| `/validToken` | `{ token }` o header `Authorization: Bearer <token>` | `{ data: true, user, profile }` o 401 |
| `/pwdUpdate` | `{ user, passwordold, passwordnew }` | `{ data: true, message }` o 400 |
| `/logout` | `{ token }` o header `Authorization` | `{ data: true, message }` |

## CRUD de Pacientes (`/pac`), Doctores (`/doctor`) y Órganos (`/org`)

Los tres recursos exponen los mismos endpoints. La baja es lógica (`activo: false`). En las búsquedas, `activo: true` trae solo los activos y `activo: false` trae todos.

| Endpoint | Body | Respuesta |
|:-|:-|:-|
| `/addnew` | campos de la entidad | 201 `{ data: [nuevo] }` |
| `/findcode` | `{ code, activo? }` | `{ data: [registro] }` o 404 |
| `/findname` | `{ nombre, activo? }` | `{ data: [...] }` (busca en nombre y apellido, sin distinguir mayúsculas) |
| `/findall` | `{ activo? }` | `{ data: [...] }` |
| `/update` | `{ code, ...campos }` | `{ data: [actualizado] }` o 404 |
| `/remove` | `{ code }` | `{ data: [dado de baja] }` o 404 |
| `/next` | `{ code }` | `{ data: [siguiente activo] }` o `data: []` |
| `/previous` | `{ code }` | `{ data: [anterior activo] }` o `data: []` |

`/pac/findcode` requiere token (en el body como `token` o en el header `Authorization`).

Campos:
- Paciente: `nombre` (texto, obligatorio), `apellido` (texto, obligatorio), `edad` (entero 0 a 130).
- Doctor: `nombre`, `apellido` (texto, obligatorios), `matricula` (entero positivo, obligatorio).
- Órgano: `nombre` (texto, obligatorio), `mtejido`, `msangre`, `tomo3d`, `medica` (booleanos: qué muestras admite), `orden` (entero).

Además, `/org/traertodos` (body `{}`) devuelve `{ lista: [órganos activos], valores: { tejido_costo, sangre_costo, tomo3d_costo, tejido_tiempo, sangre_tiempo, tomo3d_tiempo } }`.

## Medicamentos – `/medica`

| Endpoint | Body | Respuesta |
|:-|:-|:-|
| `/traertodos` | `{}` | array de `{ code, nombre }` |

## Intervenciones – `/interv`

| Endpoint | Body | Respuesta |
|:-|:-|:-|
| `/addnew` | `{ paciente, doctor, fecint, costo, tiempo, ruta: [{ organo, mtejido, msangre, tomo3d, medica }] }` | 201 `{ data: [nueva] }` |
| `/traeralgunos` | `{ paciente?, doctor?, fecdes?, fechas? }` | `{ data: [...] }` filtradas, más recientes primero |
| `/traertodos` | `{}` | `{ lista: [...], valores: {...} }` |
| `/findcode` | `{ id }` | `{ data: [intervención] }` o 404 |

`paciente`, `doctor` y `ruta[].organo` son los `code` de cada entidad. `fecdes` y `fechas` son fechas ISO (`2026-10-01`).
