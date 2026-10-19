// Costos y tiempos por tipo de muestra, definidos por ambiente en el .env
module.exports = () => ({
  tejido_costo: Number(process.env.tejido_costo) || 0,
  sangre_costo: Number(process.env.sangre_costo) || 0,
  tomo3d_costo: Number(process.env.tomo3d_costo) || 0,
  tejido_tiempo: Number(process.env.tejido_tiempo) || 0,
  sangre_tiempo: Number(process.env.sangre_tiempo) || 0,
  tomo3d_tiempo: Number(process.env.tomo3d_tiempo) || 0,
});
