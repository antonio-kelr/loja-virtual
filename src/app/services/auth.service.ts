import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { auth } from '../firebase.config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { UserService } from './user.service';
import { UserProfile } from '../models/user-profile.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = 'http://localhost:5299/api/GoogleAuth/login';
  private loginUrl = 'http://localhost:5299/api/Users/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    auth.onAuthStateChanged((user) => {
      this.userSubject.next(user);
    });
  }

  getUserProfile(): Observable<UserProfile> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('ID do usuário não encontrado');
    }
    return this.http.get<UserProfile>(`http://localhost:5299/api/Users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  private async verificarCadastroCompleto(userId: number): Promise<boolean> {
    try {
      const profile = await firstValueFrom(this.getUserProfile());
      return !!profile.nome && !!profile.cpf; // Verifica se tem nome e CPF cadastrados
    } catch (error) {
      console.error('Erro ao verificar cadastro:', error);
      return false;
    }
  }

  private async redirecionarAposLogin(userId: number) {
    const cadastroCompleto = await this.verificarCadastroCompleto(userId);

    if (!cadastroCompleto) {
      console.log('Cadastro incompleto, redirecionando para completar...');
      this.router.navigate(['/complete-registration']);
    } else {
      console.log('Cadastro completo, redirecionando para home...');
      this.router.navigate(['/']);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      this.userSubject.next(result.user);

      const idToken = await result.user?.getIdToken();

      if (!idToken) {
        throw new Error('ID Token não foi obtido');
      }

      console.log('ID Token JWT obtido:', idToken);

      try {
        const response = await firstValueFrom(this.enviarDadosGoogle(idToken));
        console.log('Resposta do backend:', response);

        // Salvar o userId e token no localStorage
        if (response && response.userId) {
          localStorage.setItem('userId', response.userId.toString());
        }
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }

        // Verifica se precisa completar o cadastro
        if (response && response.userId) {
          await this.redirecionarAposLogin(response.userId);
        }
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

  async loginWithEmailAndPassword(email: string, senha: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const idToken = await user.getIdToken();

      if (!idToken) {
        throw new Error('ID Token não foi obtido');
      }

      const loginData = {
        email: email,
        senha: senha,
        token: idToken
      };

      const response = await firstValueFrom(
        this.http.post<{token: string, message: string, userId: number}>(this.loginUrl, loginData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      );

      console.log('Resposta do backend:', response);

      // Salvar o userId e token no localStorage
      if (response && response.userId) {
        localStorage.setItem('userId', response.userId.toString());
      }
      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }

      this.userSubject.next(user);

      // Verifica se precisa completar o cadastro
      if (response && response.userId) {
        await this.redirecionarAposLogin(response.userId);
      }

      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  enviarDadosGoogle(idToken: string): Observable<{token: string, message: string, userId: number}> {
    console.log('Enviando ID Token (JWT) para o backend:', idToken);
    const payload = { token: idToken };

    return this.http.post<{token: string, message: string, userId: number}>(this.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).pipe(
      tap({
        next: (response) => {
          console.log('Resposta do servidor:', response);
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
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
