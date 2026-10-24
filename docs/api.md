# API Robiotics

Base: `http://localhost:8080/robiotics`. API REST con JSON.

Formato de respuesta: `{ "data": ..., "message": "..." }`. `data` es un objeto cuando la respuesta es un solo registro y un array cuando es un listado.

Errores: `400` datos inválidos (incluye `errors: [...]`), `401` sin sesión o token vencido, `403` el perfil no tiene permiso, `404` no encontrado, `409` conflicto (por ejemplo, modificar una intervención ya realizada), `500` error interno.

## Autenticación – `/auth`

Login con usuario y contraseña propios. Las contraseñas se guardan con **bcrypt** y la sesión es un **JWT** que dura `JWT_EXPIRES_IN` (8 h por defecto). Todos los endpoints, salvo `POST /auth/login`, exigen el header `Authorization: Bearer <token>`.

| Método y ruta | Body | Respuesta |
|:-|:-|:-|
| `POST /auth/login` | `{ user, password }` | `{ data: { token, id, user, profile } }` o 401 |
| `GET /auth/me` | | `{ data: { id, user, profile } }` |
| `PUT /auth/password` | `{ passwordActual, passwordNueva }` | `{ message }` o 400 |

## Perfiles y permisos

Hay dos perfiles: `admin` y `user`. Cualquier usuario logueado puede consultar (GET) todo, salvo `/usuarios`.

| Recurso | Alta, modificación y baja |
|:-|:-|
| Pacientes | `user` |
| Doctores, Órganos, Medicamentos | `admin` |
| Intervenciones (planificar, modificar, eliminar, registrar resultado) | `user` |
| Usuarios (también la consulta) | `admin` |

## CRUD de Pacientes, Doctores, Órganos y Medicamentos

Rutas: `/pacientes`, `/doctores`, `/organos`, `/medicamentos`. Los cuatro recursos exponen los mismos endpoints. Se identifican por `code` (correlativo) y la baja es lógica (`activo: false`).

| Método y ruta | Body | Respuesta |
|:-|:-|:-|
| `GET /` | query `nombre?`, `todos?` | `{ data: [...] }`. `nombre` busca sin distinguir mayúsculas (en nombre y apellido). Por defecto trae solo activos; `todos=true` incluye las bajas |
| `GET /:code` | query `todos?` | `{ data: registro }` o 404 |
| `GET /:code/siguiente` | | siguiente activo o 404 |
| `GET /:code/anterior` | | anterior activo o 404 |
| `POST /` | campos | 201 `{ data: nuevo }` |
| `PUT /:code` | campos a modificar | `{ data: actualizado }` o 404 |
| `DELETE /:code` | | `{ data: dado de baja }` o 404 |

Campos:
- Paciente: `nombre` (texto, obligatorio), `apellido` (texto, obligatorio), `edad` (entero 0 a 130).
- Doctor: `nombre`, `apellido` (texto, obligatorios), `matricula` (entero positivo, obligatorio).
- Órgano: `nombre` (texto, obligatorio), `mtejido`, `msangre`, `tomo3d`, `medica` (booleanos: qué muestras admite y si admite medicación), `orden` (entero).
- Medicamento: `nombre` (texto, obligatorio).

## Usuarios – `/usuarios` (solo admin)

| Método y ruta | Body | Respuesta |
|:-|:-|:-|
| `GET /` | | `{ data: [{ _id, user, profile }] }` |
| `POST /` | `{ user, password, profile }` | 201 o 409 si el usuario ya existe |
| `PUT /:id` | `{ profile?, password? }` | cambia el perfil o blanquea la contraseña |
| `DELETE /:id` | | elimina el usuario (no se puede eliminar el propio) |

El hash de la contraseña nunca sale en las respuestas.

## Intervenciones – `/intervenciones`

| Método y ruta | Body | Respuesta |
|:-|:-|:-|
| `GET /` | query `paciente?`, `doctor?`, `desde?`, `hasta?`, `estado?` | `{ data: [...] }`, más recientes primero. `desde` y `hasta` son fechas ISO (`2026-10-01`), ambas incluidas |
| `GET /planificacion` | | `{ data: { organos: [activos], valores: { tejido_costo, sangre_costo, tomo3d_costo, tejido_tiempo, sangre_tiempo, tomo3d_tiempo } } }` |
| `GET /:id` | | `{ data: intervención }` o 404 |
| `POST /` | `{ paciente, doctor, fecint, ruta: [{ organo, mtejido, msangre, tomo3d, medica }] }` | 201 `{ data: nueva }` |
| `PUT /:id` | igual que POST | solo si está `planificada`, si no 409 |
| `DELETE /:id` | | solo si está `planificada`, si no 409 |
| `PATCH /:id/resultado` | `{ estado, tiempoReal?, observaciones?, fecha? }` | caso de uso 2, ver abajo |

`paciente`, `doctor`, `ruta[].organo` y `ruta[].medica` son los `code` de cada entidad (`medica: 0` = sin medicación).

### Caso de uso 1: planificar una intervención

El servidor valida y calcula todo, no confía en lo que manda el cliente:
- el paciente y el doctor existen y están activos;
- la fecha es futura;
- la ruta tiene al menos un órgano, sin repetir, todos activos;
- cada órgano tiene al menos una muestra y solo las que admite;
- la medicación solo va en órganos que la admiten, y hay como máximo 2;
- `costo` y `tiempo` se recalculan con los valores del `.env`.

La intervención queda en estado `planificada`.

### Caso de uso 2: registrar el resultado de una intervención

`PATCH /intervenciones/:id/resultado` cierra una intervención `planificada`:
- `estado: "realizada"` exige `tiempoReal` (minutos, entero mayor a 0);
- `estado: "cancelada"` exige `observaciones` con el motivo;
- `fecha` (por defecto, ahora) no puede ser futura.

Se guarda `resultado: { fecha, tiempoReal, observaciones, usuario }`. Una intervención realizada o cancelada ya no se puede modificar, eliminar ni volver a cerrar (409).
