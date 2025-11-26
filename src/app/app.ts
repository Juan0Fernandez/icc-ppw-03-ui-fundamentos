import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Drawer } from "./features/daisyui-page/components/drawer/drawer";
import { Footer } from "./features/daisyui-page/components/footer/footer";
import { BackToTop } from "./share/components/back-to-top/back-to-top";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Drawer, Footer, BackToTop],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('03-ui-componentes-estilos');
}
