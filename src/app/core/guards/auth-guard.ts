import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../share/service/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si existe el email (usuario logueado)
  if (authService.userEmail) {
    console.log('✅ AuthGuard: Acceso permitido');
    return true;
  }

  console.log('❌ AuthGuard: No autorizado, redirigiendo a login');
  
  // Redirigimos al login enviando la URL que quería visitar
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};