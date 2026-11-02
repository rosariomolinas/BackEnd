// Test unitario (integrante 2): reglas de negocio de las intervenciones (CU1 planificar y CU2 registrar resultado).
import {
  calcularPresupuesto, pasoDe, validarFechaFutura, validarResultado, validarRuta, type OrganoRuta,
} from '../../src/intervencion/intervencion.reglas';
import type { Costos } from '../../src/shared/costos';

const valores: Costos = {
  tejido_costo: 100, sangre_costo: 50, tomo3d_costo: 200, tejido_tiempo: 10, sangre_tiempo: 5, tomo3d_tiempo: 20,
};

const corazon: OrganoRuta = {
  code: 1, nombre: 'Corazón', mtejido: true, msangre: true, tomo3d: false, medica: true,
};
const rinon: OrganoRuta = {
  code: 2, nombre: 'Riñón', mtejido: true, msangre: false, tomo3d: true, medica: false,
};
const organos = new Map([[1, corazon], [2, rinon]]);
const medicamentos = new Set([10, 11, 12]);

const hoy = new Date('2026-06-15T12:00:00Z');

describe('planificación (CU1)', () => {
  it('calcula costo y tiempo sumando las muestras de cada órgano', () => {
    const ruta = [
      pasoDe({ organo: 1, mtejido: true, msangre: true }),
      pasoDe({ organo: 2, tomo3d: true }),
    ];
    expect(calcularPresupuesto(ruta, valores)).toEqual({ costo: 350, tiempo: 35 });
  });

  it('acepta una ruta válida', () => {
    const ruta = [pasoDe({ organo: 1, msangre: true, medica: 10 }), pasoDe({ organo: 2, mtejido: true })];
    expect(validarRuta(ruta, organos, medicamentos)).toEqual([]);
  });

  it('rechaza órganos repetidos, muestras que el órgano no admite y medicación no permitida', () => {
    const ruta = [
      pasoDe({ organo: 1, tomo3d: true }),
      pasoDe({ organo: 1, mtejido: true }),
      pasoDe({ organo: 2, mtejido: true, medica: 10 }),
    ];
    expect(validarRuta(ruta, organos, medicamentos)).toEqual([
      'Hay órganos repetidos en la ruta',
      'Corazón no admite muestra de tomografía 3D',
      'Riñón no admite medicación',
    ]);
  });

  it('exige al menos una muestra por órgano y no más de 2 medicaciones', () => {
    const otro: OrganoRuta = { ...corazon, code: 3, nombre: 'Hígado' };
    const ruta = [
      pasoDe({ organo: 1, mtejido: true, medica: 10 }),
      pasoDe({ organo: 3, mtejido: true, medica: 11 }),
      pasoDe({ organo: 4, msangre: true, medica: 12 }),
    ];
    const mapa = new Map([[1, corazon], [3, otro], [4, { ...corazon, code: 4, nombre: 'Pulmón' }]]);
    expect(validarRuta(ruta, mapa, medicamentos)).toEqual(['No se pueden indicar más de 2 medicaciones']);
    expect(validarRuta([pasoDe({ organo: 1 })], organos, medicamentos)).toEqual(['Corazón: elegí al menos una muestra']);
  });

  it('la fecha tiene que ser futura', () => {
    expect(validarFechaFutura(new Date('2026-06-16'), hoy)).toEqual([]);
    expect(validarFechaFutura(new Date('2026-06-01'), hoy)).toEqual(['La fecha de la intervención debe ser futura']);
  });
});

describe('registrar resultado (CU2)', () => {
  it('una intervención realizada necesita el tiempo real', () => {
    expect(validarResultado('planificada', { estado: 'realizada', tiempoReal: 45 }, hoy)).toEqual([]);
    expect(validarResultado('planificada', { estado: 'realizada' }, hoy))
      .toEqual(['Ingresá el tiempo real en minutos (entero mayor a 0)']);
  });

  it('una cancelación necesita el motivo', () => {
    expect(validarResultado('planificada', { estado: 'cancelada', observaciones: '  ' }, hoy))
      .toEqual(['Indicá el motivo de la cancelación en observaciones']);
    expect(validarResultado('planificada', { estado: 'cancelada', observaciones: 'Paciente con fiebre' }, hoy))
      .toEqual([]);
  });

  it('no acepta fechas futuras ni estados inválidos', () => {
    expect(validarResultado('planificada', { estado: 'realizada', tiempoReal: 30, fecha: '2026-07-01' }, hoy))
      .toEqual(['La fecha del resultado no puede ser futura']);
    expect(validarResultado('planificada', { estado: 'planificada' }, hoy))
      .toEqual(['El estado debe ser realizada o cancelada']);
  });

  it('una intervención ya cerrada no se puede volver a cerrar', () => {
    expect(validarResultado('realizada', { estado: 'cancelada', observaciones: 'x' }, hoy))
      .toEqual(['La intervención ya está realizada']);
  });
});
