import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

import { EstanciaService } from '../../../core/services/estancia.service';
import { Estancia } from '../../../interfaces/estancia.interface';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-estancia-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
})
export class ListaEstanciaComponent implements OnInit {
  private estanciaService = inject(EstanciaService);
  private router = inject(Router);

  usarRangoFechas: boolean = false;
  fechaInicio?: string;
  fechaFin?: string;

  estancias: Estancia[] = [];
  filtro: string = '';
  tipoFiltro: string = '';
  filtroDebounced: string = '';

  private filtroSubject = new Subject<string>();

  ngOnInit(): void {
    this.estanciaService.obtenerEstancias().subscribe((data) => {
      this.estancias = Array.isArray(data) ? data : [];
    });

    this.filtroSubject.pipe(debounceTime(300)).subscribe((text) => {
      this.filtroDebounced = text.toLowerCase().trim();
    });
  }

  onFiltroChange(text: string): void {
    this.filtroSubject.next(text);
  }

  get estanciasFiltradas(): Estancia[] {
    if (!this.estancias?.length) return [];
  
    return this.estancias
      .filter(e => e && e.vehiculo)
      .filter(e =>
        (!this.filtroDebounced || e.vehiculo!.placa.toLowerCase().includes(this.filtroDebounced)) &&
        (!this.tipoFiltro || e.vehiculo!.tipo === this.tipoFiltro) &&
        (!this.usarRangoFechas || this.filtrarPorRango(e.horaEntrada))
      );
  }
  
  // función auxiliar
  filtrarPorRango(fecha: string | Date): boolean {
    const entrada = new Date(fecha).getTime();
    const inicio = this.fechaInicio ? new Date(this.fechaInicio).getTime() : -Infinity;
    const fin = this.fechaFin ? new Date(this.fechaFin).getTime() : Infinity;
  
    return entrada >= inicio && entrada <= fin;
  }

  volverAlDashboard(): void {
    this.router.navigate(['/']);
  }

  irARegistrar(): void {
    this.router.navigate(['/estancias/registro']);
  }

  irACerrar(id: number): void {
    this.router.navigate(['/estancias', id, 'salida']);
  }

  irADetalle(id: number): void {
    this.router.navigate(['/estancias', id]);
  }

  formatearTotal(valor: any): string {
    const numero = Number(valor);
    return isNaN(numero) ? '—' : `$${numero.toFixed(2)}`;
  }

  generarReporte(formato: 'excel' | 'pdf'): void {
    const estancias = this.estanciasFiltradas;
    const desde = this.fechaInicio ? new Date(this.fechaInicio).toLocaleString() : 'sin fecha';
    const hasta = this.fechaFin ? new Date(this.fechaFin).toLocaleString() : 'sin fecha';
  
    const encabezado = `Reporte de estancias (${desde} - ${hasta})`;
  
    // Aquí puedes generar el PDF o Excel con alguna librería
    if (formato === 'pdf') {
      this.exportarPDF(estancias, encabezado);
    } else {
      this.exportarExcel(estancias, encabezado);
    }
  }

  exportarExcel(estancias: Estancia[], titulo: string): void {
    const data = estancias.map(e => ({
      Placa: e.vehiculo?.placa ?? '—',
      Tipo: e.vehiculo?.tipo ?? '—',
      Entrada: new Date(e.horaEntrada).toLocaleString(),
      Salida: e.horaSalida ? new Date(e.horaSalida).toLocaleString() : '—',
      Minutos: e.tiempoTotalMin ?? '—',
      Total: this.formatearTotal(e.totalPagar),
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estancias');
  
    XLSX.writeFile(workbook, 'reporte-estancias.xlsx');
  }




exportarPDF(estancias: Estancia[], titulo: string): void {
  const doc = new jsPDF();

  doc.text(titulo, 10, 10);

  autoTable(doc, {
    startY: 20,
    head: [['Placa', 'Tipo', 'Entrada', 'Salida', 'Minutos', 'Total']],
    body: estancias.map(e => [
      e.vehiculo?.placa ?? '—',
      e.vehiculo?.tipo ?? '—',
      new Date(e.horaEntrada).toLocaleString(),
      e.horaSalida ? new Date(e.horaSalida).toLocaleString() : '—',
      e.tiempoTotalMin ?? '—',
      this.formatearTotal(e.totalPagar)
    ])
  });

  doc.save('reporte-estancias.pdf');
}


  


}
