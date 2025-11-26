import { Routes } from '@angular/router';
import { EstilosPage } from './features/estilos-page/estilos-page';
import { Drawer } from './features/daisyui-page/components/drawer/drawer';
import { DaisyuiPage } from './features/daisyui-page/daisyui-page';
import { SimpsonsPage } from './features/simpsons/simpsons-page/simpsons-page';
import { SimpsonsDetailPage } from './features/simpsons/simpson-detail-page/simpson-detail-page';

export const routes: Routes = [
    {
        path: '',
        component: DaisyuiPage,
    },
    
    {
        path: 'estilos-page',
        component: EstilosPage,
    },

    {
        path: 'simpsons',
        component: SimpsonsPage,
    },

    {
        path: 'simpsons/:id',
        component: SimpsonsDetailPage,
    }
    
];
