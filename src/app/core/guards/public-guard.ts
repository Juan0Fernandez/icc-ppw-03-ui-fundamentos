import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../share/service/auth/auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si YA tiene email (está logueado), no debe ver el login
  if (authService.userEmail) {
    console.log('❌ PublicGuard: Usuario ya logueado, redirigiendo a Simpsons');
    router.navigate(['/simpsons']);
    return false;
  }

  // Si no está logueado, puede ver el login
  return true;
};