import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { auth } from '../firebase.config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = 'http://localhost:5299/api/GoogleAuth/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {
    auth.onAuthStateChanged((user) => {
      this.userSubject.next(user);
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      this.userSubject.next(result.user);

      // 🔑 Obter o ID Token (JWT) correto
      const idToken = await result.user?.getIdToken();

      if (!idToken) {
        throw new Error('ID Token não foi obtido');
      }

      console.log('ID Token JWT obtido:', idToken);

      // Enviar para o backend
      try {
        const response = await firstValueFrom(this.enviarDadosGoogle(idToken));
        console.log('Resposta do backend:', response);

        // Após login bem-sucedido, redirecionar direto para completar cadastro
        this.router.navigate(['/complete-registration']);
      } catch (error) {
        console.error('Erro ao enviar dados para o backend:', error);
        throw error;
      }

      return result.user;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    }
  }

  enviarDadosGoogle(idToken: string): Observable<any> {
    console.log('Enviando ID Token (JWT) para o backend:', idToken);
    const payload = { token: idToken };

    return this.http.post(this.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      responseType: 'text'
    }).pipe(
      tap({
        next: (response) => {
          console.log('Resposta do servidor:', response);
          try {
            const jsonResponse = JSON.parse(response);
            console.log('Resposta convertida para JSON:', jsonResponse);
          } catch (e) {
            console.log('Resposta não é um JSON válido:', response);
          }
        },
        error: (error) => {
          console.error('Erro detalhado:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            headers: error.headers,
            url: error.url
          });

          if (error.error instanceof ErrorEvent) {
            console.error('Erro do cliente:', error.error.message);
          } else {
            console.error('Erro do servidor:', error.error);
          }
        }
      })
    );
  }

  logout() {
    auth.signOut();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
