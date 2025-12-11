import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'app-theme';


  saveTheme(theme: string): void {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch {
      console.warn('No se pudo guardar el tema en localStorage');
    }
  }

  getSavedTheme(defaultTheme: string = 'coffe'): string {
    try {
      return localStorage.getItem(this.THEME_KEY) ?? defaultTheme;
    } catch {
      return defaultTheme;
    }
  }

  applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}