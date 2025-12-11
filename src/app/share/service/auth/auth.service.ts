// src/app/share/service/auth/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  user, 
  signInWithEmailAndPassword, 
  User, 
  UserCredential,
  signOut,
  // Asegúrate de añadir esta importación para el registro en el futuro
  createUserWithEmailAndPassword 
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs'; // <-- ¡Añadir 'from' aquí!

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  user$: Observable<User | null> = user(this.auth);
  public userEmail: string | null = null; 

  constructor() {
    this.user$.subscribe(currentUser => {
      this.userEmail = currentUser ? currentUser.email : null;
    });
  }

  /**
   * Intenta registrar un nuevo usuario con email y password.
   */
  register(email: string, password: string): Observable<UserCredential> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password);
    return from(promise); // Envuelve la Promise en un Observable
  }
  
  /**
   * Intenta iniciar sesión con correo electrónico y contraseña.
   * @returns Observable de las credenciales del usuario
   */
  loginWithEmail(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.auth, email, password);
    return from(promise); // Envuelve la Promise en un Observable
  }

  /**
   * Cierra la sesión del usuario actual.
   * @returns Observable<void>
   */
  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise); // Envuelve la Promise en un Observable
  }
}