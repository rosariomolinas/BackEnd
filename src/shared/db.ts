import mongoose from 'mongoose';

// MONGO_URI permite usar una base local (mongodb://localhost:27017/robiotics).
// Si no está, se arma la URL de Atlas con mongo_url, db_user y db_password.
export const buildUrl = () => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const { db_user: user, db_password: password, mongo_url: host } = process.env;
  if (!user || !password || !host) {
    throw new Error('Faltan variables de entorno de la base (MONGO_URI o db_user, db_password, mongo_url). Revisá el archivo .env');
  }
  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}`;
};

export const connectDB = async () => {
  await mongoose.connect(buildUrl());
  console.log('Base de datos conectada');
};
