import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EstanciaService } from '../../../core/services/estancia.service';
import { Estancia } from '../../../interfaces/estancia.interface';


@Component({
  selector: 'app-estancia-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private estanciaService = inject(EstanciaService);
  private router = inject(Router);

  estancia?: Estancia;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.estanciaService.obtenerPorId(id).subscribe({
      next: (data) => this.estancia = data,
      error: () => this.router.navigate(['/estancias']) // fallback
    });
  }

  volver(): void {
    this.router.navigate(['/estancias']);
  }
}
