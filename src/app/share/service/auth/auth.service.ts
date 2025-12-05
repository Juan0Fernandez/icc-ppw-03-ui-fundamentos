import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  user, // <-- FUNCIÓN CLAVE
  signInWithEmailAndPassword, 
  User, 
  UserCredential,
  signOut,
  createUserWithEmailAndPassword 
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs'; 
// NOTA: No necesitamos 'first' y 'switchMap' aquí, solo en FavoritesService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // 1. Observable que emite el usuario autenticado (User) o null
  user$: Observable<User | null> = user(this.auth); // <<-- ESTA LÍNEA ES CRÍTICA
  
  // 2. Variable para almacenar el correo (para acceso rápido)
  public userEmail: string | null = null; 

  constructor() {
    // Escucha el user$ y actualiza la variable síncrona
    this.user$.subscribe(currentUser => {
      this.userEmail = currentUser ? currentUser.email : null;
      // Puedes añadir más lógica aquí si necesitas el UID en el constructor
      // console.log("Usuario actual UID:", currentUser?.uid);
    });
  }

  // Métodos de registro y login (deben devolver Observable usando 'from')
  register(email: string, password: string): Observable<UserCredential> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password);
    return from(promise);
  }
  
  loginWithEmail(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.auth, email, password);
    return from(promise); 
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise); 
  }
}