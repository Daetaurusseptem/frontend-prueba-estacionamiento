import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { Vehiculo } from '../../../interfaces/vehiculos.interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
})
export class ListaComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private router = inject(Router);

  vehiculos: Vehiculo[] = [];
  filtro: string = '';
  tipoFiltro: string = '';

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos(): void {
    this.vehiculoService.obtenerTodos().subscribe((data) => {
      this.vehiculos = data;
    });
  }

  editar(id: number): void {
    this.router.navigate(['/vehiculos', id, 'editar']);
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
    this.vehiculoService.eliminar(id).subscribe(() => {
      this.vehiculos = this.vehiculos.filter(v => v.id !== id);
    });
  }

  irANuevo(): void {
    this.router.navigate(['/vehiculos/nuevo']);
  }

  volverAlDashboard(): void {
    this.router.navigate(['/']);
  }

  get vehiculosFiltrados(): Vehiculo[] {
    const term = this.filtro.toLowerCase();
    return this.vehiculos.filter(v =>
      (!this.filtro || v.placa.toLowerCase().includes(term) || v.tipo.toLowerCase().includes(term)) &&
      (!this.tipoFiltro || v.tipo === this.tipoFiltro)
    );
  }
}
