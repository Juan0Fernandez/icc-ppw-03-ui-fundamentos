import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../share/service/auth/auth.service';
import { of } from 'rxjs';
import { FormUtils } from '../../../../share/components/form-utils/form-utils';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login { 
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Inyectamos ActivatedRoute

  loginForm: FormGroup;
  private returnUrl: string = '/simpsons'; // Ruta por defecto

  // Signal para disparar el login
  private loginTrigger = signal<{ email: string; password: string } | null>(null);

  // rxResource para manejar el proceso de login
  loginResource = rxResource({
    params: () => this.loginTrigger(),
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.authService.loginWithEmail(params.email, params.password);
    }
  });

  formUtils = FormUtils;

  constructor() {
    // Leemos el query param 'returnUrl' si existe, sino usamos '/simpsons'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/simpsons'; 

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Effect para navegar cuando el login sea exitoso
    effect(() => {
      if (this.loginResource.hasValue() && this.loginResource.value()) {
        console.log('Login exitoso, navegando a:', this.returnUrl);
        // Usamos navigateByUrl para ir a la ruta guardada
        this.router.navigateByUrl(this.returnUrl); 
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loginTrigger.set({ email, password });
  }

  // Computed signal para el estado de carga
  loading = this.loginResource.isLoading;

  // Computed signal para el mensaje de error (mapea los códigos de error de Firebase)
  errorMessage = () => {
    const error = this.loginResource.error();
    if (!error) return '';

    const code = (error as any).code || '';
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'El usuario ha sido deshabilitado',
      'auth/user-not-found': 'No existe un usuario con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas'
    };
    return errorMessages[code] || 'Error al iniciar sesión';
  }

  // Getters para validación en el template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}