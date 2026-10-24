import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './shared/db';
import { Usuario } from './usuario/usuario.model';
import { hashPassword } from './usuario/usuario.service';
import { Organo } from './organo/organo.model';
import { Medicamento } from './medicamento/medicamento.model';
import { Doctor } from './doctor/doctor.model';

// Carga datos iniciales solo en las colecciones vacías: no pisa nada existente.
// Los usa también el test end-to-end del frontend.
// Uso: npm run seed
const seed = async () => {
  await connectDB();

  if (!(await Usuario.countDocuments())) {
    await Usuario.create([
      { user: 'admin', password: await hashPassword('admin'), profile: 'admin' },
      { user: 'user', password: await hashPassword('user'), profile: 'user' },
    ]);
    console.log('Usuarios creados: admin/admin (admin) y user/user (user). Cambiá las contraseñas después de entrar.');
  }

  if (!(await Doctor.countDocuments())) {
    await Doctor.create({ code: 1, nombre: 'Marta', apellido: 'Ruiz', matricula: 1001, activo: true });
    console.log('Doctor de ejemplo creado');
  }

  if (!(await Organo.countDocuments())) {
    await Organo.create([
      { code: 1, nombre: 'Corazón', mtejido: true, msangre: true, tomo3d: true, medica: true, orden: 1, activo: true },
      { code: 2, nombre: 'Hígado', mtejido: true, msangre: true, tomo3d: false, medica: true, orden: 2, activo: true },
      { code: 3, nombre: 'Riñón', mtejido: true, msangre: false, tomo3d: true, medica: false, orden: 3, activo: true },
    ]);
    console.log('Órganos de ejemplo creados');
  }

  if (!(await Medicamento.countDocuments())) {
    await Medicamento.create([
      { code: 1, nombre: 'Heparina', activo: true },
      { code: 2, nombre: 'Cefazolina', activo: true },
    ]);
    console.log('Medicamentos de ejemplo creados');
  }

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('No se pudo cargar los datos iniciales:', (err as Error).message);
  process.exit(1);
});
