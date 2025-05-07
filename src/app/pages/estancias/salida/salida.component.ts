import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { EstanciaService } from '../../../core/services/estancia.service';
import { Estancia } from '../../../interfaces/estancia.interface';

@Component({
  selector: 'app-salida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salida.component.html',
})
export class SalidaComponent implements OnInit {
  private estanciaService = inject(EstanciaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  estanciasActivas: Estancia[] = [];
  estanciaSeleccionadaId?: string;
  resultado?: Estancia;

  usarHoraActual: boolean = true;
  horaCustom?: string;

  ngOnInit(): void {
    this.estanciaService.obtenerEstancias().subscribe((data) => {
      this.estanciasActivas = data.filter(e => !e.horaSalida);

      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const idNum = parseInt(idParam, 10);
        const match = this.estanciasActivas.find(e => e.id === idNum);
        if (match) {
          this.estanciaSeleccionadaId = String(match.id);
        }
      }
    });
  }

  cerrarEstancia(): void {
    if (!this.estanciaSeleccionadaId) {
      Swal.fire('Selecciona una estancia', '', 'warning');
      return;
    }

    const estancia = this.estanciasActivas.find(e => e.id == this.estanciaSeleccionadaId);
    if (!estancia) return;

    const entrada = new Date(estancia.horaEntrada);
    let horaSalidaFinal: Date;

    if (this.usarHoraActual) {
      horaSalidaFinal = new Date();
    } else {
      if (!this.horaCustom) {
        Swal.fire('Falta hora personalizada', '', 'warning');
        return;
      }

      horaSalidaFinal = new Date(this.horaCustom);
    }

    // Validaciones locales
    if (horaSalidaFinal < entrada) {
      Swal.fire('Hora inválida', 'La hora de salida no puede ser menor a la de entrada.', 'error');
      return;
    }

    if (horaSalidaFinal > new Date()) {
      Swal.fire('Hora inválida', 'La hora de salida no puede estar en el futuro.', 'error');
      return;
    }

    // Confirmación
    Swal.fire({
      title: '¿Confirmar salida?',
      html: `
        <p><strong>Placa:</strong> ${estancia.vehiculo?.placa}</p>
        <p><strong>Hora salida:</strong> ${horaSalidaFinal.toLocaleString()}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Registrar salida',
      cancelButtonText: 'Cancelar'
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.estanciaService.registrarSalida(estancia.vehiculo!.placa, horaSalidaFinal).subscribe({
          next: (res) => {
            this.resultado = res;
            this.estanciasActivas = this.estanciasActivas.filter(e => e.id !== estancia.id);

            Swal.fire({
              icon: 'success',
              title: 'Salida registrada',
              html: `
                <p><strong>Placa:</strong> ${res.placa}</p>
                <p><strong>Tipo:</strong> ${res.tipo}</p>
                <p><strong>Tiempo:</strong> ${res.tiempoMin} min</p>
                <p><strong>Total:</strong> $${res.total.toFixed(2)}</p>
              `
            });
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Error al cerrar la estancia', 'error');
          }
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/estancias']);
  }
}
