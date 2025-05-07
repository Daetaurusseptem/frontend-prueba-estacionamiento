export interface Estancia {
    id?: number;
    vehiculoId: string;
    horaEntrada: Date;
    horaSalida?: Date;
    tiempoTotalMin?: number;
    totalPagar?: number;
    vehiculo?: {
      id: number;
      placa: string;
      tipo: 'oficial' | 'residente' | 'no_residente';
    };
  }




