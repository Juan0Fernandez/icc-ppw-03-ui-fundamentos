import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeSwitcherComponent } from "../../../../share/components/theme-switcher/theme-switcher";

@Component({
  selector: 'app-drawer',
  imports: [RouterLink, RouterLinkActive, ThemeSwitcherComponent, ThemeSwitcherComponent],
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer { }
