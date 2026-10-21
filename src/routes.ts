import { Router } from 'express';
import { pacienteRouter } from './paciente/paciente.routes';
import { doctorRouter } from './doctor/doctor.routes';
import { organoRouter } from './organo/organo.routes';
import { medicamentoRouter } from './medicamento/medicamento.routes';
import { intervencionRouter } from './intervencion/intervencion.routes';
import { usuarioRouter } from './usuario/usuario.routes';

export const routes = Router();

routes.use('/pac', pacienteRouter);
routes.use('/doctor', doctorRouter);
routes.use('/org', organoRouter);
routes.use('/medica', medicamentoRouter);
routes.use('/interv', intervencionRouter);
routes.use('/usuarios', usuarioRouter);
