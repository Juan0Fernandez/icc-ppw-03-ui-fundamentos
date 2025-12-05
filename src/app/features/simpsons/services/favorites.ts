import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  Timestamp
} from '@angular/fire/firestore';
// ¡CRÍTICO!: Importar first, switchMap, y of para la lógica asíncrona con el usuario
import { Observable, from, map, first, switchMap, of } from 'rxjs'; 
import { AuthService } from '../../../share/service/auth/auth.service';
import { Favorite } from '../interface/favorite.interface'; // Verifica que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class FavoritesService { // <--- ¡CLASE CORREGIDA!
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  // Señales reactivas para el estado de la UI
  favorites = signal<Favorite[]>([]);
  loading = signal(false);

  /**
   * Agrega un favorito a Firestore.
   */
  addFavorite(nombre: string, image: string, customName?: string): Observable<any> {
    // 1. Obtenemos el usuario autenticado (user$) y solo tomamos el primer valor (first())
    return this.authService.user$.pipe(
      first(), 
      switchMap(user => { 
        if (!user || !user.uid) {
          // Si no hay usuario o UID, lanzamos un error que el rxResource capturará
          throw new Error('auth/user-not-authenticated');
        }

        const favorite: Omit<Favorite, 'id'> = {
          nombre,
          customName: customName || nombre,
          image: image,
          userId: user.uid, // ⬅️ ¡UID REAL REQUERIDO POR LAS REGLAS!
          createdAt: new Date()
        };

        const favoritesCollection = collection(this.firestore, 'favorites');
        
        // 2. Retorna el Observable de la promesa de addDoc
        return from(addDoc(favoritesCollection, {
          ...favorite,
          createdAt: Timestamp.fromDate(favorite.createdAt)
        }));
      })
    );
  }

  /**
   * Obtener todos los favoritos del usuario actual.
   */
  getFavorites(): Observable<Favorite[]> {
    // 1. Obtenemos el usuario autenticado (user$)
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user || !user.uid) {
          // Si no hay usuario, limpiamos la señal de favoritos y retornamos un Observable vacío
          this.favorites.set([]);
          return of([]); 
        }

        this.loading.set(true);
        const favoritesCollection = collection(this.firestore, 'favorites');
        
        // 2. Usamos el UID real para la consulta (where)
        const q = query(favoritesCollection, where('userId', '==', user.uid)); 
        
        // 3. Retorna un Observable de la promesa de getDocs y mapea los datos
        return from(getDocs(q)).pipe(
          map(snapshot => {
            const favorites = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data()['createdAt'].toDate()
            } as Favorite));
            
            this.favorites.set(favorites);
            this.loading.set(false);
            return favorites;
          })
        );
      })
    );
  }

  /**
   * Eliminar un favorito.
   */
  deleteFavorite(id: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(deleteDoc(favoriteDoc));
  }
  
  /**
   * Actualizar el nombre personalizado de un favorito.
   */
  updateFavorite(id: string, customName: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(updateDoc(favoriteDoc, { customName }));
  }

  /**
   * Verificar si un personaje ya es favorito.
   */
  isFavorite(nombre: string): boolean {
    return this.favorites().some(fav => fav.nombre === nombre);
  }
}