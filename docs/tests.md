# Evidencia de tests – Backend

Comando: `npm test` (Jest). El test de integración corre contra una base MongoDB en memoria (`mongodb-memory-server`), así que no toca Atlas.

- Unitario, integrante 1: `tests/unit/validaciones.test.ts`
- Unitario, integrante 2: `tests/unit/intervencion.reglas.test.ts`
- Integración: `tests/integration/api.test.ts`

Salida de la última corrida:

```
PASS tests/unit/intervencion.reglas.test.ts
  planificación (CU1)
    ✓ calcula costo y tiempo sumando las muestras de cada órgano
    ✓ acepta una ruta válida
    ✓ rechaza órganos repetidos, muestras que el órgano no admite y medicación no permitida
    ✓ exige al menos una muestra por órgano y no más de 2 medicaciones
    ✓ la fecha tiene que ser futura
  registrar resultado (CU2)
    ✓ una intervención realizada necesita el tiempo real
    ✓ una cancelación necesita el motivo
    ✓ no acepta fechas futuras ni estados inválidos
    ✓ una intervención ya cerrada no se puede volver a cerrar
PASS tests/unit/validaciones.test.ts
  validarPaciente
    ✓ acepta un paciente completo
    ✓ exige nombre y apellido y una edad entre 0 y 130
    ✓ en una modificación solo valida los campos que vienen
  validarDoctor
    ✓ rechaza una matrícula que no es un entero positivo
  validarCodigo
    ✓ código 1
    ✓ código "7"
    ✓ código 0
    ✓ código "x"
  usuarios
    ✓ el login no acepta objetos en lugar de texto (inyección NoSQL)
    ✓ un usuario nuevo necesita nombre válido, contraseña de 4 caracteres y perfil admin o user
    ✓ la contraseña nueva tiene que ser distinta de la actual
PASS tests/integration/api.test.ts
  autenticación y permisos
    ✓ rechaza credenciales incorrectas
    ✓ guarda las contraseñas con bcrypt (migra las viejas en texto plano)
    ✓ sin token responde 401
    ✓ GET /auth/me devuelve el perfil del token
    ✓ un perfil sin permiso recibe 403
    ✓ el administrador crea usuarios sin exponer el hash
  CRUD de pacientes
    ✓ alta, consulta, modificación y baja lógica
    ✓ valida los datos
  intervenciones: planificar (CU1) y registrar resultado (CU2)
    ✓ planifica recalculando el costo en el servidor y valida las reglas
    ✓ registra el resultado de una intervención y después no permite modificarla
    ✓ modifica y elimina una intervención planificada
Test Suites: 3 passed, 3 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        5.715 s, estimated 8 s
Ran all test suites.
```

Para la entrega, reemplazar esta salida por una captura o la salida de una corrida propia.
