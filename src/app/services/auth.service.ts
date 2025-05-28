import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { auth } from '../firebase.config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = 'http://localhost:5299/api/auth';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Observar mudanças no estado de autenticação
    auth.onAuthStateChanged((user) => {
      this.userSubject.next(user);
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();

      // Configurações adicionais para o provedor Google
      provider.setCustomParameters({
        prompt: 'select_account',
        // Forçar a abertura em uma nova janela
        authType: 'signInWithPopup'
      });

      // Configurar opções do popup
      const popupOptions = {
        width: 500,
        height: 600,
        left: window.screenX + (window.outerWidth - 500) / 2,
        top: window.screenY + (window.outerHeight - 600) / 2
      };

      const result = await signInWithPopup(auth, provider);
      this.userSubject.next(result.user);

      // Obter o token do Google
      const idToken = await result.user.getIdToken();
      console.log('Token obtido:', idToken); // Debug

      // Enviar dados para o backend
      try {
        const response = await firstValueFrom(this.enviarDadosGoogle(idToken));
        console.log('Resposta do backend:', response); // Debug
      } catch (error) {
        console.error('Erro ao enviar dados para o backend:', error);
      }

      this.router.navigate(['/']);
      return result.user;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    }
  }

  enviarDadosGoogle(idToken: string): Observable<any> {
    console.log('Enviando token para o backend:', idToken); // Debug
    return this.http.post(`${this.apiUrl}/google`, { idToken });
  }

  logout() {
    auth.signOut();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
