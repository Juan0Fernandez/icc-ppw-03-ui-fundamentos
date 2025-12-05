// src/app/core/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../share/service/auth/auth.service'; // << Verifica esta ruta

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el observable user$ para chequear inmediatamente el estado
  // Si hay un usuario (no es null), permite el acceso (true)
  if (authService.userEmail) { // Chequeo síncrono para rutas iniciales
    return true;
  }

  // Si no está autenticado, redirige al login
  router.navigate(['/login'], {
    // Esto es opcional, pero útil para redirigir al usuario a donde quería ir después del login
    queryParams: { returnUrl: state.url } 
  });
  
  return false;
};