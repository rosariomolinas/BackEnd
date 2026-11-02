import type { Costos } from '../shared/costos';
import type { Estado, IPasoRuta } from './intervencion.model';

// Reglas de negocio de las intervenciones, sin acceso a la base (se prueban con tests unitarios).

export const MAX_MEDICACIONES = 2;

export interface OrganoRuta {
  code: number;
  nombre: string;
  mtejido: boolean;
  msangre: boolean;
  tomo3d: boolean;
  medica: boolean;
}

const MUESTRAS = [
  ['mtejido', 'tejido'],
  ['msangre', 'sangre'],
  ['tomo3d', 'tomografía 3D'],
] as const;

// Normaliza un paso de la ruta que viene del cliente.
export const pasoDe = (p: Record<string, unknown>): IPasoRuta => ({
  organo: Number(p.organo),
  mtejido: p.mtejido === true,
  msangre: p.msangre === true,
  tomo3d: p.tomo3d === true,
  medica: Number(p.medica) || 0,
});

export const validarFechaFutura = (fecint: Date, hoy: Date): string[] => (
  fecint > hoy ? [] : ['La fecha de la intervención debe ser futura']
);

// organos: órganos activos indexados por code. medicamentos: codes de medicamentos activos.
export const validarRuta = (
  ruta: IPasoRuta[],
  organos: Map<number, OrganoRuta>,
  medicamentos: Set<number>,
): string[] => {
  const errores: string[] = [];
  if (ruta.length === 0) return ['La intervención debe tener al menos un órgano'];

  const codes = ruta.map((p) => p.organo);
  if (new Set(codes).size !== codes.length) errores.push('Hay órganos repetidos en la ruta');

  ruta.forEach((p) => {
    const organo = organos.get(p.organo);
    if (!organo) {
      errores.push(`El órgano ${p.organo} no existe o está dado de baja`);
      return;
    }
    if (!p.mtejido && !p.msangre && !p.tomo3d) errores.push(`${organo.nombre}: elegí al menos una muestra`);
    MUESTRAS.forEach(([campo, nombre]) => {
      if (p[campo] && !organo[campo]) errores.push(`${organo.nombre} no admite muestra de ${nombre}`);
    });
    if (p.medica) {
      if (!organo.medica) errores.push(`${organo.nombre} no admite medicación`);
      else if (!medicamentos.has(p.medica)) errores.push(`El medicamento ${p.medica} no existe o está dado de baja`);
    }
  });

  if (ruta.filter((p) => p.medica).length > MAX_MEDICACIONES) {
    errores.push(`No se pueden indicar más de ${MAX_MEDICACIONES} medicaciones`);
  }
  return errores;
};

// Costo y tiempo estimados: suma de lo configurado para cada muestra tomada.
export const calcularPresupuesto = (ruta: IPasoRuta[], valores: Costos) => ruta.reduce((acc, p) => {
  if (p.mtejido) { acc.costo += valores.tejido_costo; acc.tiempo += valores.tejido_tiempo; }
  if (p.msangre) { acc.costo += valores.sangre_costo; acc.tiempo += valores.sangre_tiempo; }
  if (p.tomo3d) { acc.costo += valores.tomo3d_costo; acc.tiempo += valores.tomo3d_tiempo; }
  return acc;
}, { costo: 0, tiempo: 0 });

export interface DatosResultado {
  estado?: unknown;
  fecha?: unknown;
  tiempoReal?: unknown;
  observaciones?: unknown;
}

// Caso de uso 2: solo una intervención planificada puede cerrarse como realizada o cancelada.
export const validarResultado = (estadoActual: Estado, datos: DatosResultado, hoy: Date): string[] => {
  if (estadoActual !== 'planificada') return [`La intervención ya está ${estadoActual}`];
  const errores: string[] = [];
  const observaciones = typeof datos.observaciones === 'string' ? datos.observaciones.trim() : '';
  const fecha = datos.fecha ? new Date(String(datos.fecha)) : hoy;

  if (Number.isNaN(fecha.getTime())) errores.push('La fecha del resultado no es válida');
  else if (fecha > hoy) errores.push('La fecha del resultado no puede ser futura');

  if (datos.estado === 'realizada') {
    const tiempo = Number(datos.tiempoReal);
    if (!Number.isInteger(tiempo) || tiempo < 1) errores.push('Ingresá el tiempo real en minutos (entero mayor a 0)');
  } else if (datos.estado === 'cancelada') {
    if (!observaciones) errores.push('Indicá el motivo de la cancelación en observaciones');
  } else {
    errores.push('El estado debe ser realizada o cancelada');
  }
  if (observaciones.length > 500) errores.push('Las observaciones no pueden superar los 500 caracteres');
  return errores;
};
