import { Component, effect, inject, signal, untracked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap, catchError, of } from 'rxjs';

import { PaginationService } from '../../../share/service/pagination-service';
import { SimpsonsService } from '../services/simpsons-service';
import { Pagination } from "../../../share/components/pagination-service/pagination-service";
import { HeroSimpsons } from "../components/hero-simpsons/hero-simpsons";
import { Breadcrumbs } from "../../../share/components/breadcrumbs/breadcrumbs";

import { AuthService } from '../../../share/service/auth/auth.service';
import { FavoritesService } from '../services/favorites';
import { Favorite } from '../interface/favorite.interface';

@Component({
    selector: 'app-simpsons-page',
    imports: [
        CommonModule, 
        RouterModule, 
        Pagination, 
        HeroSimpsons, 
        Breadcrumbs, 
        ReactiveFormsModule, 
        // Eliminado AsyncPipe si no se usa directamente en la plantilla como pipe
    ],
    templateUrl: './simpsons-page.html',
})
export class SimpsonsPage {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    private simpsonsService = inject(SimpsonsService);
    paginationService = inject(PaginationService);
    private favoritesService = inject(FavoritesService);
    private authService = inject(AuthService);

    charactersPerPage = signal(10);
    totalPages = signal(0);
    
    private reloadFavoritesTrigger = signal(0);
    private addFavoriteAction = signal<{ nombre: string; imagen: string } | null>(null);
    private deleteFavoriteAction = signal<string | null>(null);
    private updateFavoriteAction = signal<{ id: string; customName: string } | null>(null);

    editingFavoriteId = signal<string | null>(null);
    editForm: FormGroup;

    currentUser = this.authService.user$;

    constructor() {
        this.editForm = this.fb.group({
            customName: ['', [Validators.required, Validators.minLength(2)]]
        });

        effect(() => {
            if (this.simpsonsResource.hasValue()) {
                this.totalPages.set(this.simpsonsResource.value().pages);
            }
        });
        
        effect(() => {
            this.currentUser.subscribe(user => {
                if (user) {
                    this.reloadFavoritesTrigger.update(v => v + 1);
                } else {
                    this.favoritesService.favorites.set([]);
                }
            });
        });
    }

    simpsonsResource = rxResource({
        params: () => ({
            page: this.paginationService.currentPage() - 1,
            limit: this.charactersPerPage(),
        }),
        stream: ({params}) => {
            return this.simpsonsService.getCharactersOptions({
                offset: params.page,
                limit: params.limit,
            });
        },
    });

    favoritesResource = rxResource({
        params: () => ({ reload: this.reloadFavoritesTrigger() }),
        stream: ({ params }) => {
            const user = this.authService.user$; 
            if (!user) return of([]);
            return this.favoritesService.getFavorites();
        }
    });

    // 🚨 RECURSO FALTANTE RESTAURADO (TS2551)
    addFavoriteResource = rxResource({
        params: () => this.addFavoriteAction(),
        stream: ({ params }) => {
            if (!params) return of(null);
            return this.favoritesService.addFavorite(params.nombre, params.imagen).pipe(
                tap(() => {
                    untracked(() => {
                        this.reloadFavoritesTrigger.update(v => v + 1);
                        alert('¡Agregado a favoritos!'); 
                    });
                }),
                catchError((error) => {
                    console.error('Error al agregar favorito:', error);
                    alert('Error al agregar a favoritos: ' + error.message);
                    return of(null);
                })
            );
        }
    });

    deleteFavoriteResource = rxResource({
        params: () => this.deleteFavoriteAction(),
        stream: ({ params }) => {
            if (!params) return of(null);
            return this.favoritesService.deleteFavorite(params).pipe(
                tap(() => {
                    untracked(() => {
                        this.reloadFavoritesTrigger.update(v => v + 1);
                        alert('Eliminado de favoritos');
                    });
                }),
                catchError((error) => {
                    console.error('Error al eliminar favorito:', error);
                    alert('Error al eliminar favorito: ' + error.message);
                    return of(null);
                })
            );
        }
    });

    updateFavoriteResource = rxResource({
        params: () => this.updateFavoriteAction(),
        stream: ({ params }) => {
            if (!params) return of(null);
            return this.favoritesService.updateFavorite(params.id, params.customName).pipe(
                tap(() => {
                    untracked(() => {
                        this.reloadFavoritesTrigger.update(v => v + 1);
                        this.cancelEditingFavorite();
                        alert('Nombre actualizado');
                    });
                }),
                catchError((error) => {
                    console.error('Error al actualizar favorito:', error);
                    alert('Error al actualizar: ' + error.message);
                    return of(null);
                })
            );
        }
    });


    favorites = () => this.favoritesService.favorites() || [];
    loadingFavorites = this.favoritesResource.isLoading;


    logout() {
        this.authService.logout().subscribe({
            next: () => this.router.navigate(['/login']),
            error: (err) => console.error('Error al cerrar sesión:', err),
        });
    }

    reloadFavorites() {
        this.reloadFavoritesTrigger.update(v => v + 1);
    }

    // simpsons-page.ts

    addToFavorites(character: any) {
        // Obtenemos el nombre.
        const nombre = character.name || character.character;
        
        // 1. ASUMIMOS el campo de la ruta basado en el detalle (portrait_path)
        let path = character.portrait_path || character.image || character.img || '';

        let imagen: string;

        if (!nombre) {
            return alert('Error: Faltan datos (nombre).');
        }

        // 2. Si se encontró una RUTA (path), construimos la URL completa y correcta
        if (path) {
            if (path.startsWith('http')) {
                // Si ya es una URL completa, la usamos.
                imagen = path; 
            } else {
                // Usamos el mismo patrón que te funciona en la página de detalles:
                // Ejemplo: https://cdn.thesimpsonsapi.com/500 + /homer.png
                imagen = `https://cdn.thesimpsonsapi.com/500${path}`;
            }
        } else {
            // 3. Fallback genérico si la API nunca manda la ruta
            imagen = 'https://placehold.co/400x300/a8c2f0/white?text=IMAGEN+API+FALLA';
        }

        // 4. Disparamos la acción de guardar
        this.addFavoriteAction.set({ nombre, imagen }); 
    }

    removeFromFavorites(favoriteId: string) {
        if (confirm('¿Eliminar de favoritos?')) {
            this.deleteFavoriteAction.set(favoriteId);
        }
    }

    startEditingFavorite(favorite: Favorite) {
        this.editingFavoriteId.set(favorite.id!);
        this.editForm.patchValue({
            customName: favorite.customName
        });
    }

    saveEditedFavorite() {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }

        const favoriteId = this.editingFavoriteId();
        const customName = this.editForm.value.customName;

        if (favoriteId && customName) {
            this.updateFavoriteAction.set({ id: favoriteId, customName });
        }
    }

    cancelEditingFavorite() {
        this.editingFavoriteId.set(null);
        this.editForm.reset();
    }

    isFavorite(characterName: string): boolean {
        return this.favoritesService.isFavorite(characterName);
    }
}