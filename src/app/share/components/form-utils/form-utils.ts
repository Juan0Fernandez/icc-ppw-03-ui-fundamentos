import { FormGroup } from '@angular/forms';

export class FormUtils { 

   static getFieldError(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Este campo es obligatorio.';
    }

    if (errors['email']) {
      return 'El correo electrónico no es válido.';
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres.`;
    }

    // Para el caso de Register (confirmar contraseña)
    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden.';
    }

    return 'Error de formato.';
  }
}