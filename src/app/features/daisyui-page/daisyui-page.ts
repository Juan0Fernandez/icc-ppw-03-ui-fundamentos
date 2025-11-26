import { Component } from '@angular/core';
import { ComponenteSimulado } from "./components/componenteSimulado/componenteSimulado";
import { Tabla } from "./components/tabla/tabla";
import { Card } from "./components/card/card";
import { Condicional } from "./components/condicional/condicional";
import { Menu } from "./components/menu/menu";

@Component({
  selector: 'app-daisyui-page',
  imports: [ComponenteSimulado, Tabla, Card, Condicional, Menu],
  templateUrl: './daisyui-page.html',
  styleUrls: ['./daisyui-page.css'],
})
export class DaisyuiPage {

}
