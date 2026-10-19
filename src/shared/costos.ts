// Costos y tiempos por tipo de muestra, definidos por ambiente en el .env
export interface Costos {
  tejido_costo: number;
  sangre_costo: number;
  tomo3d_costo: number;
  tejido_tiempo: number;
  sangre_tiempo: number;
  tomo3d_tiempo: number;
}

export const costos = (): Costos => ({
  tejido_costo: Number(process.env.tejido_costo) || 0,
  sangre_costo: Number(process.env.sangre_costo) || 0,
  tomo3d_costo: Number(process.env.tomo3d_costo) || 0,
  tejido_tiempo: Number(process.env.tejido_tiempo) || 0,
  sangre_tiempo: Number(process.env.sangre_tiempo) || 0,
  tomo3d_tiempo: Number(process.env.tomo3d_tiempo) || 0,
});
