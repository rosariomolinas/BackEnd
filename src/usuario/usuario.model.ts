import { Schema, model } from 'mongoose';

export const PERFILES = ['admin', 'user'] as const;
export type Perfil = typeof PERFILES[number];

// password guarda el hash de bcrypt, nunca la contraseña en texto plano.
export interface IUsuario {
  user: string;
  password: string;
  profile: Perfil;
}

const usuarioSchema = new Schema<IUsuario>({
  user: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  profile: { type: String, enum: PERFILES, required: true },
}, {
  // El hash nunca sale en las respuestas de la API.
  toJSON: { transform: (doc, ret) => { delete (ret as Partial<IUsuario>).password; return ret; } },
});

export const Usuario = model<IUsuario>('usuarios', usuarioSchema);
