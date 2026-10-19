const { ApiError } = require('../middlewares/errors');

// Los registros dados de baja quedan con activo = false (baja lógica).
// Se usa $ne para incluir también documentos viejos que no tienen el campo.
const ACTIVOS = { activo: { $ne: false } };

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pick = (data, fields) => fields.reduce((acc, f) => {
  if (data[f] !== undefined) acc[f] = data[f];
  return acc;
}, {});

// Capa de servicio genérica para las entidades con código numérico correlativo.
// fields: campos que el cliente puede escribir. searchFields: campos donde busca findByName.
const crudService = (Model, { label, fields, searchFields = ['nombre'] }) => {
  const filtro = (extra, soloActivos) => (soloActivos ? { ...extra, ...ACTIVOS } : extra);

  return {
    label,

    async create(data) {
      const ultimo = await Model.findOne({}).sort({ code: -1 });
      const code = ultimo ? ultimo.code + 1 : 1;
      return Model.create({ ...pick(data, fields), code, activo: true });
    },

    findByCode(code, soloActivos = false) {
      return Model.findOne(filtro({ code: Number(code) }, soloActivos));
    },

    findByName(nombre, soloActivos = false) {
      const regex = new RegExp(escapeRegex(nombre), 'i');
      const or = searchFields.map((f) => ({ [f]: regex }));
      return Model.find(filtro({ $or: or }, soloActivos)).sort({ code: 1 });
    },

    findAll(soloActivos = false) {
      return Model.find(filtro({}, soloActivos)).sort({ code: 1 });
    },

    async update(code, data) {
      const doc = await Model.findOneAndUpdate(
        { code: Number(code), ...ACTIVOS },
        pick(data, fields),
        { new: true, runValidators: true },
      );
      if (!doc) throw new ApiError(404, `${label} no encontrado o dado de baja`);
      return doc;
    },

    async remove(code) {
      const doc = await Model.findOneAndUpdate({ code: Number(code) }, { activo: false }, { new: true });
      if (!doc) throw new ApiError(404, `${label} no encontrado`);
      return doc;
    },

    next(code) {
      return Model.find({ code: { $gt: Number(code) }, ...ACTIVOS }).sort({ code: 1 }).limit(1);
    },

    previous(code) {
      return Model.find({ code: { $lt: Number(code) }, ...ACTIVOS }).sort({ code: -1 }).limit(1);
    },
  };
};

module.exports = { crudService, ACTIVOS };
