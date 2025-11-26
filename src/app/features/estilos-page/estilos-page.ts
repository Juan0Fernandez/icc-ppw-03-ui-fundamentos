import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalBoxComponent } from '../components/sigal-box-component/sigal-box-component';
import { from } from 'rxjs';
import { Progress } from "../components/barra-progreso/barra-progreso";

@Component({
  selector: 'app-estilos-page',
  standalone: true,
  templateUrl: './estilos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SignalBoxComponent, Progress],
})
export class EstilosPage {}


