import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common'; // Importante para @if
import { ThemeSwitcherComponent } from "../../../../share/components/theme-switcher/theme-switcher";
import { AuthService } from '../../../../share/service/auth/auth.service';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeSwitcherComponent],
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estado de carga para el logout
  loggingOut = signal(false);

  // Getter para usar en el HTML: ¿Está autenticado?
  get isAuthenticated(): boolean {
    // Usamos la propiedad síncrona que definiste en tu servicio
    return !!this.authService.userEmail;
  }

  // Getter para mostrar el email del usuario
  get userEmail(): string | null {
    return this.authService.userEmail;
  }

  // Método de Logout (Requisito Práctica 12)
  logout() {
    // Confirmación simple (puedes mejorarla con un modal si quieres)
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.loggingOut.set(true);
      
      this.authService.logout().subscribe({
        next: () => {
          this.loggingOut.set(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error logout', err);
          this.loggingOut.set(false);
        }
      });
    }
  }
}