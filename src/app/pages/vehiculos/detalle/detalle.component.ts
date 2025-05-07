import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { Vehiculo } from '../../../interfaces/vehiculos.interfaces';


@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle.component.html',
})
export class DetalleEstanciaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehiculoService = inject(VehiculoService);

  vehiculo?: Vehiculo;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehiculoService.obtenerPorId(+id).subscribe({
        next: (data) => (this.vehiculo = data),
        error: () => this.router.navigate(['/vehiculos'])
      });
    } else {
      this.router.navigate(['/vehiculos']);
    }
  }

  volver(): void {
    this.router.navigate(['/vehiculos']);
  }

  editar(): void {
    if (this.vehiculo?.id) {
      this.router.navigate(['/vehiculos', this.vehiculo.id, 'editar']);
    }
  }
}
