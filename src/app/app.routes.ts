import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'simpsons', 
        pathMatch: 'full'
    },
    // RUTAS DE AUTENTICACIÓN (Rutas Públicas)
    {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login').then(m => m.Login),
        canActivate: [publicGuard] // << APLICADO: Solo si NO está autenticado
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register').then(m => m.Register),
        canActivate: [publicGuard] // << APLICADO: Solo si NO está autenticado
    },
    // TUS RUTAS EXISTENTES (Rutas Protegidas)
    {
        path: 'estilos-page',
        loadComponent: () => import('./features/estilos-page/estilos-page').then(m => m.EstilosPage),
        canActivate: [authGuard] // << APLICADO: Requiere autenticación
    },
    {
        path: 'simpsons',
        loadComponent: () => import('./features/simpsons/simpsons-page/simpsons-page').then(m => m.SimpsonsPage),
        canActivate: [authGuard] // << APLICADO: Requiere autenticación
    }, 
    {
        // Esta ruta (home) está protegida. Si quisieras que fuera pública, elimina [authGuard].
        path: 'home',
        loadComponent: () => import('./features/simpsons/simpson-detail-page/simpson-detail-page').then(m => m.SimpsonsDetailPage),
        canActivate: [authGuard] // << APLICADO: Requiere autenticación
    },
    {
        path: 'simpsons/:id', // Ruta con parámetro
        loadComponent: () => import('./features/simpsons/simpson-detail-page/simpson-detail-page').then(m => m.SimpsonsDetailPage),
        canActivate: [authGuard] // << APLICADO: Requiere autenticación
    },
    {
        path: '**',
        redirectTo: 'simpsons'
    }
];