// src/app/app.routes.ts

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
       // canActivate: [publicGuard] // << Aplica el Public Guard
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register').then(m => m.Register),
        //canActivate: [publicGuard] // << Aplica el Public Guard
    },
    // TUS RUTAS EXISTENTES (Rutas Protegidas)
    {
        path: 'estilos-page',
        loadComponent: () => import('./features/estilos-page/estilos-page').then(m => m.EstilosPage),
        canActivate: [authGuard] // << Aplica el Auth Guard
    },
    {
        path: 'simpsons',
        loadComponent: () => import('./features/simpsons/simpsons-page/simpsons-page').then(m => m.SimpsonsPage),
        canActivate: [authGuard] // << Aplica el Auth Guard
    }, 
    {
        path: 'home',
        loadComponent: () => import('./features/simpsons/simpson-detail-page/simpson-detail-page').then(m => m.SimpsonsDetailPage),
        canActivate: [authGuard] // << Aplica el Auth Guard
    },
    {
        path: 'simpsons/:id', // <-- Asegúrate de tener el ':id' aquí
        loadComponent: () => import('./features/simpsons/simpson-detail-page/simpson-detail-page').then(m => m.SimpsonsDetailPage),
        canActivate: [authGuard] // <-- (Opcional, pero recomendado: proteger la ruta)
    },
    {
        path: '**',
        redirectTo: 'simpsons'
    }
];