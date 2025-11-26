import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-componente-simulado',
  imports: [],
  templateUrl: './componenteSimulado.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponenteSimulado { }
