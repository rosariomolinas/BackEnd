import { Schema, model } from 'mongoose';

export type Perfil = 'admin' | 'user';

export interface IUsuario {
  user: string;
  password: string;
  profile: Perfil;
  token?: string;
}

const usuarioSchema = new Schema<IUsuario>({
  user: { type: String, required: true },
  password: { type: String, required: true },
  profile: { type: String, enum: ['admin', 'user'], required: true },
  token: String,
});

export const Usuario = model<IUsuario>('usuarios', usuarioSchema);
