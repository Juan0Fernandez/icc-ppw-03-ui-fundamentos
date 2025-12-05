// src/app/core/guards/public.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../share/service/auth/auth.service'; // << Verifica esta ruta

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado, redirige a una ruta protegida (ej: /simpsons)
  if (authService.userEmail) { // Chequeo síncrono del estado
    router.navigate(['/simpsons']);
    return false; // Deniega el acceso al login/registro
  }

  return true; // Permite el acceso si no está logueado
};