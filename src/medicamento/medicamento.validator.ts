import { paraModificar, requiredText, type EntityValidator } from '../shared/validation';

export const validarMedicamento: EntityValidator = (body, parcial = false) => {
  const errors: string[] = [];
  if (!parcial || body.nombre !== undefined) requiredText(body, 'nombre', 'El nombre', errors);
  return errors;
};

export const validarMedicamentoUpdate = paraModificar(validarMedicamento);
