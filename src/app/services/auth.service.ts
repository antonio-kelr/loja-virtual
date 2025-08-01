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
  private loginEmailUrl = 'http://localhost:5299/api/Users/login-email';

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      // Verifica o estado do Firebase Auth
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.userSubject.next(user);
        } else {
          // Se não houver usuário no Firebase, verifica o token no localStorage
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          if (token && userId) {
            // Se houver token e userId, tenta carregar o perfil
            this.getUserProfile().subscribe({
              next: (profile) => {
                // Cria um objeto User mínimo para manter a compatibilidade
                const minimalUser = {
                  uid: userId,
                  email: profile.email,
                  displayName: profile.nome,
                  photoURL: profile.fotoPerfil
                } as User;
                this.userSubject.next(minimalUser);
              },
              error: () => {
                // Se houver erro, limpa o localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                this.userSubject.next(null);
              }
            });
          } else {
            this.userSubject.next(null);
          }
        }
      });
    }
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

  // Função para verificar se o perfil está completo (sem valores padrão/vazios)
  private isProfileComplete(profile: UserProfile): boolean {
    console.log('Verificando perfil:', profile);
    return !!(
      profile.nome &&
      profile.email &&
      profile.senha && profile.senha.trim() !== '' &&
      profile.cpf && profile.cpf !== '00000000000' &&
      profile.dataNascimento && profile.dataNascimento !== '2025-07-14' &&
      profile.genero && profile.genero !== 'Não informado' &&
      profile.telefone && profile.telefone.trim() !== ''
    );
  }

  private async verificarCadastroCompleto(userId: number): Promise<boolean> {
    try {
      const profile = await firstValueFrom(this.getUserProfile());
      console.log('Verificando perfil:', profile); // Mantenha esse log
      return this.isProfileComplete(profile);
      return this.isProfileComplete(profile);
    } catch (error) {
      console.error('Erro ao verificar cadastro:', error);
      return false;
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

  private enviarDadosGoogle(idToken: string) {
    const payload = { token: idToken };

    return this.http.post<{token: string, message: string, userId: number}>(this.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async loginWithEmailAndPassword(email: string, senha: string) {
    try {
      const loginData = {
        email: email,
        senha: senha
      };

      const response = await firstValueFrom(
        this.http.post<{token: string, message: string, userId: number}>(this.loginEmailUrl, loginData, {
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

      // Verifica se precisa completar o cadastro
      if (response && response.userId) {
        await this.redirecionarAposLogin(response.userId);
      }

      return response;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  private async redirecionarAposLogin(userId: number) {
    const cadastroCompleto = await this.verificarCadastroCompleto(userId);
    if (!cadastroCompleto) {
      this.router.navigate(['/complete-registration']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    auth.signOut();
    this.userSubject.next(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
