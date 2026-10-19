import 'dotenv/config';
import { app } from './app';
import { connectDB } from './shared/db';

const PORT = process.env.PORT || process.env.port || 8080;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}/robiotics`));
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', (err as Error).message);
    process.exit(1);
  }
};

start();
