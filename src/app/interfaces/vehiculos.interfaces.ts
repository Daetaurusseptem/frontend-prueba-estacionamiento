export interface Vehiculo {
    id?: number;
    placa: string;
    tipo: 'oficial' | 'residente' | 'no_residente';
  }