// Test unitario (integrante 1): validaciones de datos de entrada de las entidades.
import { validarPaciente, validarPacienteUpdate } from '../../src/paciente/paciente.validator';
import { validarDoctor } from '../../src/doctor/doctor.validator';
import { validarUsuario, validarCambioPassword, validarLogin } from '../../src/usuario/usuario.validator';
import { validarCodigo } from '../../src/shared/validation';

describe('validarPaciente', () => {
  it('acepta un paciente completo', () => {
    expect(validarPaciente({ nombre: 'Ana', apellido: 'Pérez', edad: 40 })).toEqual([]);
  });

  it('exige nombre y apellido y una edad entre 0 y 130', () => {
    expect(validarPaciente({ nombre: ' ', edad: 200 })).toEqual([
      'El nombre es obligatorio',
      'El apellido es obligatorio',
      'La edad debe ser un número entre 0 y 130',
    ]);
  });

  it('en una modificación solo valida los campos que vienen', () => {
    expect(validarPacienteUpdate({ edad: 30 })).toEqual([]);
    expect(validarPacienteUpdate({ edad: -1 })).toEqual(['La edad debe ser un número entre 0 y 130']);
  });
});

describe('validarDoctor', () => {
  it('rechaza una matrícula que no es un entero positivo', () => {
    expect(validarDoctor({ nombre: 'Juan', apellido: 'Gómez', matricula: 'abc' }))
      .toEqual(['La matrícula debe ser un número entero positivo']);
  });
});

describe('validarCodigo', () => {
  it.each([[1, []], ['7', []], [0, ['El código debe ser un número entero positivo']], ['x', ['El código debe ser un número entero positivo']]])(
    'código %p',
    (code, esperado) => {
      expect(validarCodigo({ code })).toEqual(esperado);
    },
  );
});

describe('usuarios', () => {
  it('el login no acepta objetos en lugar de texto (inyección NoSQL)', () => {
    expect(validarLogin({ user: { $ne: null }, password: 'x' })).toEqual(['Ingresá el usuario']);
  });

  it('un usuario nuevo necesita nombre válido, contraseña de 4 caracteres y perfil admin o user', () => {
    expect(validarUsuario({ user: 'lu', password: '123', profile: 'jefe' })).toHaveLength(3);
    expect(validarUsuario({ user: 'lucho', password: '1234', profile: 'user' })).toEqual([]);
  });

  it('la contraseña nueva tiene que ser distinta de la actual', () => {
    expect(validarCambioPassword({ passwordActual: 'abcd', passwordNueva: 'abcd' }))
      .toEqual(['La contraseña nueva debe ser distinta de la actual']);
  });
});
