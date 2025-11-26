import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-progress',
  imports: [],
  templateUrl: './barra-progreso.html',
})
export class Progress {
  progreso = signal(0)

  
  actualizarProgreso($event: Event) {
    const valor = ($event.target as HTMLInputElement).value;
    this.progreso.set(Number(valor));
  }

}
