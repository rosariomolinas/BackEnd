import mongoose from 'mongoose';

const buildUrl = () => {
  const { db_user: user, db_password: password, mongo_url: host } = process.env;
  if (!user || !password || !host) {
    throw new Error('Faltan variables de entorno de la base (db_user, db_password, mongo_url). Revisá el archivo .env');
  }
  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}`;
};

export const connectDB = async () => {
  await mongoose.connect(buildUrl());
  console.log('Base de datos conectada');
};
