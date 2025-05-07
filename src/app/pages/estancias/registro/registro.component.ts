import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EstanciaService } from '../../../core/services/estancia.service';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { Vehiculo } from '../../../interfaces/vehiculos.interfaces';

@Component({
  selector: 'app-estancia-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
})
export class RegistroEstanciaComponent implements OnInit {
  private estanciaService = inject(EstanciaService);
  private vehiculoService = inject(VehiculoService);
  private router = inject(Router);

  vehiculos: Vehiculo[] = [];
  vehiculoIdSeleccionado?: string;
  filtro: string = '';

  ngOnInit(): void {
    this.vehiculoService.obtenerTodos().subscribe((data) => {
      this.vehiculos = data;
    });
  }

  get vehiculosFiltrados(): Vehiculo[] {
    return this.vehiculos.filter(v =>
      v.placa.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  registrar(): void {
    if (!this.vehiculoIdSeleccionado) {
      Swal.fire('Advertencia', 'Debes seleccionar un vehículo', 'warning');
      return;
    }

    this.estanciaService.registrarEntrada(this.vehiculoIdSeleccionado).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Entrada registrada correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/estancias']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message || 'Error al registrar entrada',
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
