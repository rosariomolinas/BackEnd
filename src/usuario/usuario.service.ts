import bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';
import { ApiError } from '../shared/errors';
import { firmarToken, type Sesion } from '../shared/auth';
import { Usuario, type Perfil } from './usuario.model';

const ROUNDS = 10;

export const hashPassword = (password: string) => bcrypt.hash(password, ROUNDS);

const esHash = (password: string) => /^\$2[aby]\$/.test(password);

const buscarPorId = async (id: string) => {
  const usuario = isValidObjectId(id) ? await Usuario.findById(id) : null;
  if (!usuario) throw new ApiError(404, 'Usuario no encontrado');
  return usuario;
};

export const usuarioService = {
  // Valida usuario y contraseña y devuelve un JWT.
  // Si la contraseña guardada todavía está en texto plano (datos viejos) y coincide, la reemplaza por su hash.
  async login(user: string, password: string) {
    const usuario = await Usuario.findOne({ user });
    let valido = false;
    if (usuario && esHash(usuario.password)) {
      valido = await bcrypt.compare(password, usuario.password);
    } else if (usuario && usuario.password === password) {
      valido = true;
      usuario.password = await hashPassword(password);
      await usuario.save();
    }
    if (!usuario || !valido) throw new ApiError(401, 'Usuario o contraseña incorrectos');

    const sesion: Sesion = { id: usuario.id, user: usuario.user, profile: usuario.profile };
    return { token: firmarToken(sesion), ...sesion };
  },

  async cambiarPassword(id: string, actual: string, nueva: string) {
    const usuario = await buscarPorId(id);
    const ok = esHash(usuario.password) ? await bcrypt.compare(actual, usuario.password) : usuario.password === actual;
    if (!ok) throw new ApiError(400, 'La contraseña actual es incorrecta');
    usuario.password = await hashPassword(nueva);
    await usuario.save();
  },

  findAll: () => Usuario.find({}).sort({ user: 1 }),

  async create(data: { user: string; password: string; profile: Perfil }) {
    if (await Usuario.exists({ user: data.user })) throw new ApiError(409, `Ya existe el usuario ${data.user}`);
    return Usuario.create({ user: data.user, profile: data.profile, password: await hashPassword(data.password) });
  },

  async update(id: string, data: { profile?: Perfil; password?: string }, sesion: Sesion) {
    const usuario = await buscarPorId(id);
    if (data.profile && data.profile !== usuario.profile && usuario.id === sesion.id) {
      throw new ApiError(400, 'No podés cambiar tu propio perfil');
    }
    if (data.profile) usuario.profile = data.profile;
    if (data.password) usuario.password = await hashPassword(data.password);
    return usuario.save();
  },

  async remove(id: string, sesion: Sesion) {
    const usuario = await buscarPorId(id);
    if (usuario.id === sesion.id) throw new ApiError(400, 'No podés eliminar tu propio usuario');
    await usuario.deleteOne();
    return usuario;
  },
};
