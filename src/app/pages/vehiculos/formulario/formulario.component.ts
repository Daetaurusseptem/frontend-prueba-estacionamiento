import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { Vehiculo } from '../../../interfaces/vehiculos.interfaces';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vehiculo: Vehiculo = { placa: '', tipo: 'residente' };
  editMode = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.vehiculoService.obtenerPorId(+id).subscribe((v) => {
        this.vehiculo = v;
      });
    }
  }

  guardar(): void {
    const op = this.editMode
      ? this.vehiculoService.actualizar(this.vehiculo.id!, this.vehiculo)
      : this.vehiculoService.crear(this.vehiculo);

    op.subscribe(() => {
      this.router.navigate(['/vehiculos']);
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(['/']);
  }
}
