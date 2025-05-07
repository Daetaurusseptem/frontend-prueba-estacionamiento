import { Routes } from '@angular/router';
import { ListaComponent } from './pages/vehiculos/lista/lista.component';
import { FormularioComponent } from './pages/vehiculos/formulario/formulario.component';
import {  DetalleEstanciaComponent } from './pages/vehiculos/detalle/detalle.component';

import {  RegistroEstanciaComponent } from './pages/estancias/registro/registro.component';
import { SalidaComponent } from './pages/estancias/salida/salida.component';
import { ListaEstanciaComponent } from './pages/estancias/lista/lista.component';
import { DetalleComponent } from './pages/estancias/detalle/detalle.component';

export const routes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./pages/dashboard.component').then(m => m.DashboardComponent)
    },

     // Vehículos
  { path: 'vehiculos', component: ListaComponent },
  { path: 'vehiculos/nuevo', component: FormularioComponent },
  { path: 'vehiculos/:id', component: DetalleComponent },
  { path: 'vehiculos/:id/editar', component: FormularioComponent },

  // Estancias
  { path: 'estancias', component: ListaEstanciaComponent },
  { path: 'estancias/registro', component: RegistroEstanciaComponent },
  { path: 'estancias/salida', component: SalidaComponent },
  { path: 'estancias/:id', component: DetalleEstanciaComponent },
  { path: 'estancias/:id/salida', component: SalidaComponent },
  ];
   