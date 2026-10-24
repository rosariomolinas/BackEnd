// Test de integración: levanta la API contra una base MongoDB en memoria y recorre el flujo completo por HTTP.
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/app';
import { Usuario } from '../../src/usuario/usuario.model';
import { Organo } from '../../src/organo/organo.model';
import { Medicamento } from '../../src/medicamento/medicamento.model';
import { Intervencion } from '../../src/intervencion/intervencion.model';
import { hashPassword } from '../../src/usuario/usuario.service';

const API = '/robiotics';
let mongo: MongoMemoryServer;
let tokenAdmin: string;
let tokenUser: string;

const login = async (user: string, password: string) => {
  const res = await request(app).post(`${API}/auth/login`).send({ user, password });
  return res.body.data.token as string;
};

beforeAll(async () => {
  Object.assign(process.env, {
    JWT_SECRET: 'test',
    tejido_costo: '100',
    sangre_costo: '50',
    tomo3d_costo: '200',
    tejido_tiempo: '10',
    sangre_tiempo: '5',
    tomo3d_tiempo: '20',
  });
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  await Usuario.create([
    { user: 'admin', password: await hashPassword('admin'), profile: 'admin' },
    // Usuario cargado antes de bcrypt: la contraseña está en texto plano y se migra al loguearse.
    { user: 'user', password: 'user', profile: 'user' },
  ]);
  await Organo.create({
    code: 1, nombre: 'Corazón', mtejido: true, msangre: true, tomo3d: false, medica: true, activo: true,
  });
  await Medicamento.create({ code: 1, nombre: 'Heparina', activo: true });

  tokenAdmin = await login('admin', 'admin');
  tokenUser = await login('user', 'user');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('autenticación y permisos', () => {
  it('rechaza credenciales incorrectas', async () => {
    const res = await request(app).post(`${API}/auth/login`).send({ user: 'admin', password: 'mal' });
    expect(res.status).toBe(401);
  });

  it('guarda las contraseñas con bcrypt (migra las viejas en texto plano)', async () => {
    const user = await Usuario.findOne({ user: 'user' });
    expect(user!.password).toMatch(/^\$2[aby]\$/);
  });

  it('sin token responde 401', async () => {
    const res = await request(app).get(`${API}/pacientes`);
    expect(res.status).toBe(401);
  });

  it('GET /auth/me devuelve el perfil del token', async () => {
    const res = await request(app).get(`${API}/auth/me`).set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.body.data).toMatchObject({ user: 'admin', profile: 'admin' });
  });

  it('un perfil sin permiso recibe 403', async () => {
    const doctor = await request(app).post(`${API}/doctores`).set('Authorization', `Bearer ${tokenUser}`)
      .send({ nombre: 'Juan', apellido: 'Gómez', matricula: 123 });
    expect(doctor.status).toBe(403);
    const usuarios = await request(app).get(`${API}/usuarios`).set('Authorization', `Bearer ${tokenUser}`);
    expect(usuarios.status).toBe(403);
  });

  it('el administrador crea usuarios sin exponer el hash', async () => {
    const res = await request(app).post(`${API}/usuarios`).set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ user: 'enfermera', password: 'clave', profile: 'user' });
    expect(res.status).toBe(201);
    expect(res.body.data.password).toBeUndefined();
  });
});

describe('CRUD de pacientes', () => {
  const auth = () => ({ Authorization: `Bearer ${tokenUser}` });

  it('alta, consulta, modificación y baja lógica', async () => {
    const alta = await request(app).post(`${API}/pacientes`).set(auth()).send({ nombre: 'Ana', apellido: 'Pérez', edad: 40 });
    expect(alta.status).toBe(201);
    const { code } = alta.body.data;

    const mod = await request(app).put(`${API}/pacientes/${code}`).set(auth()).send({ edad: 41 });
    expect(mod.body.data.edad).toBe(41);

    const busqueda = await request(app).get(`${API}/pacientes?nombre=pér`).set(auth());
    expect(busqueda.body.data).toHaveLength(1);

    const baja = await request(app).delete(`${API}/pacientes/${code}`).set(auth());
    expect(baja.body.data.activo).toBe(false);

    expect((await request(app).get(`${API}/pacientes/${code}`).set(auth())).status).toBe(404);
    expect((await request(app).get(`${API}/pacientes/${code}?todos=true`).set(auth())).status).toBe(200);
  });

  it('valida los datos', async () => {
    const res = await request(app).post(`${API}/pacientes`).set(auth()).send({ nombre: 'Sin apellido' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('El apellido es obligatorio');
  });
});

describe('intervenciones: planificar (CU1) y registrar resultado (CU2)', () => {
  const auth = () => ({ Authorization: `Bearer ${tokenUser}` });
  let paciente: number;
  let doctor: number;
  const manana = () => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  beforeAll(async () => {
    paciente = (await request(app).post(`${API}/pacientes`).set(auth()).send({ nombre: 'Luis', apellido: 'Díaz', edad: 60 }))
      .body.data.code;
    doctor = (await request(app).post(`${API}/doctores`).set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: 'Marta', apellido: 'Ruiz', matricula: 555 })).body.data.code;
  });

  it('planifica recalculando el costo en el servidor y valida las reglas', async () => {
    const ok = await request(app).post(`${API}/intervenciones`).set(auth()).send({
      paciente, doctor, fecint: manana(), costo: 1, ruta: [{ organo: 1, mtejido: true, msangre: true, medica: 1 }],
    });
    expect(ok.status).toBe(201);
    expect(ok.body.data).toMatchObject({ costo: 150, tiempo: 15, estado: 'planificada' });

    const mal = await request(app).post(`${API}/intervenciones`).set(auth()).send({
      paciente, doctor, fecint: '2020-01-01', ruta: [{ organo: 1, tomo3d: true }],
    });
    expect(mal.status).toBe(400);
    expect(mal.body.errors).toEqual(['La fecha de la intervención debe ser futura', 'Corazón no admite muestra de tomografía 3D']);
  });

  it('registra el resultado de una intervención y después no permite modificarla', async () => {
    const plan = await Intervencion.create({
      paciente, doctor, fecint: new Date(Date.now() - 60 * 60 * 1000), ruta: [{ organo: 1, mtejido: true }],
    });
    const url = `${API}/intervenciones/${plan.id}`;

    const sinTiempo = await request(app).patch(`${url}/resultado`).set(auth()).send({ estado: 'realizada' });
    expect(sinTiempo.status).toBe(400);

    const res = await request(app).patch(`${url}/resultado`).set(auth())
      .send({ estado: 'realizada', tiempoReal: 50, observaciones: 'Sin complicaciones' });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ estado: 'realizada', resultado: { tiempoReal: 50, usuario: 'user' } });

    expect((await request(app).patch(`${url}/resultado`).set(auth()).send({ estado: 'cancelada', observaciones: 'x' })).status)
      .toBe(409);
    expect((await request(app).delete(url).set(auth())).status).toBe(409);

    const realizadas = await request(app).get(`${API}/intervenciones?estado=realizada`).set(auth());
    expect(realizadas.body.data).toHaveLength(1);
  });

  it('modifica y elimina una intervención planificada', async () => {
    const alta = await request(app).post(`${API}/intervenciones`).set(auth()).send({
      paciente, doctor, fecint: manana(), ruta: [{ organo: 1, msangre: true }],
    });
    const url = `${API}/intervenciones/${alta.body.data._id}`;
    const mod = await request(app).put(url).set(auth()).send({
      paciente, doctor, fecint: manana(), ruta: [{ organo: 1, msangre: true, mtejido: true }],
    });
    expect(mod.body.data.costo).toBe(150);
    expect((await request(app).delete(url).set(auth())).status).toBe(200);
    expect((await request(app).get(url).set(auth())).status).toBe(404);
  });
});
