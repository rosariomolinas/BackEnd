import type { FilterQuery, Model } from 'mongoose';
import { ApiError } from '../errors';

// Toda entidad con CRUD tiene un código correlativo y baja lógica.
export interface EntidadBase {
  code: number;
  activo: boolean;
}

// Los registros dados de baja quedan con activo = false.
// Se usa $ne para incluir también documentos viejos que no tienen el campo.
export const ACTIVOS = { activo: { $ne: false } };

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pick = <T>(data: Record<string, unknown>, fields: (keyof T)[]): Partial<T> => fields.reduce((acc, f) => {
  if (data[f as string] !== undefined) acc[f] = data[f as string] as T[keyof T];
  return acc;
}, {} as Partial<T>);

export interface CrudOptions<T> {
  label: string;
  fields: (keyof T)[]; // campos que el cliente puede escribir
  searchFields?: (keyof T)[]; // campos donde busca findByName
}

// Capa de servicio genérica: lógica de negocio y acceso a datos de una entidad.
export class CrudService<T extends EntidadBase> {
  readonly label: string;

  private readonly fields: (keyof T)[];

  private readonly searchFields: (keyof T)[];

  constructor(private readonly model: Model<T>, options: CrudOptions<T>) {
    this.label = options.label;
    this.fields = options.fields;
    this.searchFields = options.searchFields || (['nombre'] as (keyof T)[]);
  }

  private filtro(extra: FilterQuery<T>, soloActivos: boolean): FilterQuery<T> {
    return soloActivos ? { ...extra, ...ACTIVOS } : extra;
  }

  async create(data: Record<string, unknown>) {
    const ultimo = await this.model.findOne({}).sort({ code: -1 });
    const code = ultimo ? ultimo.code + 1 : 1;
    return this.model.create({ ...pick<T>(data, this.fields), code, activo: true });
  }

  findByCode(code: number | string, soloActivos = false) {
    return this.model.findOne(this.filtro({ code: Number(code) } as FilterQuery<T>, soloActivos));
  }

  findByName(nombre: string, soloActivos = false) {
    const regex = new RegExp(escapeRegex(String(nombre)), 'i');
    const or = this.searchFields.map((f) => ({ [f]: regex }));
    return this.model.find(this.filtro({ $or: or } as FilterQuery<T>, soloActivos)).sort({ code: 1 });
  }

  findAll(soloActivos = false) {
    return this.model.find(this.filtro({}, soloActivos)).sort({ code: 1 });
  }

  async update(code: number | string, data: Record<string, unknown>) {
    const doc = await this.model.findOneAndUpdate(
      { code: Number(code), ...ACTIVOS } as FilterQuery<T>,
      pick<T>(data, this.fields),
      { new: true, runValidators: true },
    );
    if (!doc) throw new ApiError(404, `${this.label} no encontrado o dado de baja`);
    return doc;
  }

  async remove(code: number | string) {
    const doc = await this.model.findOneAndUpdate(
      { code: Number(code), ...ACTIVOS } as FilterQuery<T>,
      { activo: false },
      { new: true },
    );
    if (!doc) throw new ApiError(404, `${this.label} no encontrado o ya dado de baja`);
    return doc;
  }

  next(code: number | string) {
    return this.model.findOne({ code: { $gt: Number(code) }, ...ACTIVOS } as FilterQuery<T>).sort({ code: 1 });
  }

  previous(code: number | string) {
    return this.model.findOne({ code: { $lt: Number(code) }, ...ACTIVOS } as FilterQuery<T>).sort({ code: -1 });
  }
}
