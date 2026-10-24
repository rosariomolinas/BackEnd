import { Router } from 'express';
import { requireAuth } from './shared/auth';
import { pacienteRouter } from './paciente/paciente.routes';
import { doctorRouter } from './doctor/doctor.routes';
import { organoRouter } from './organo/organo.routes';
import { medicamentoRouter } from './medicamento/medicamento.routes';
import { intervencionRouter } from './intervencion/intervencion.routes';
import { authRouter, usuarioRouter } from './usuario/usuario.routes';

export const routes = Router();

// Público: solo el login. Todo lo demás exige un JWT válido.
routes.use('/auth', authRouter);

routes.use(requireAuth);
routes.use('/pacientes', pacienteRouter);
routes.use('/doctores', doctorRouter);
routes.use('/organos', organoRouter);
routes.use('/medicamentos', medicamentoRouter);
routes.use('/intervenciones', intervencionRouter);
routes.use('/usuarios', usuarioRouter);
