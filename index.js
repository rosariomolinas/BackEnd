require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/db/dbconnect');

const PORT = process.env.PORT || process.env.port || 8080;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}/robiotics`));
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
};

start();
