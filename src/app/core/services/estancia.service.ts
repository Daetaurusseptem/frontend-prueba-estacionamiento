import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Estancia } from '../../interfaces/estancia.interface';

@Injectable({ providedIn: 'root' })
export class EstanciaService {
  private baseUrl = environment.apiUrl + '/estancias';

  constructor(private http: HttpClient) {}

  registrarEntrada(placa: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/entrada`, { placa });
  }

  registrarSalida(placa: string | number, horaSalida: Date): Observable<any> {
    return this.http.post(`${this.baseUrl}/salida`, {
      placa,
      horaSalida
    });
  }

  getReporte(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/reportes`, {
      params: { fechaInicio, fechaFin }
    });
  }

  obtenerEstancias(): Observable<Estancia[]> {
    return this.http.get<Estancia[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Estancia> {
    return this.http.get<Estancia>(`${this.baseUrl}/${id}`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}