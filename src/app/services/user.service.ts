import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5299/api/Users';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUserProfile(): Observable<UserProfile> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable<UserProfile>(subscriber => {
        subscriber.error('Não é possível acessar o perfil do usuário fora do navegador');
        subscriber.complete();
      });
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      return new Observable<UserProfile>(subscriber => {
        subscriber.error('ID do usuário não encontrado');
        subscriber.complete();
      });
    }

    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateUserProfile(profile: UserProfile): Observable<UserProfile> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable<UserProfile>(subscriber => {
        subscriber.error('Não é possível atualizar o perfil do usuário fora do navegador');
        subscriber.complete();
      });
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      return new Observable<UserProfile>(subscriber => {
        subscriber.error('ID do usuário não encontrado');
        subscriber.complete();
      });
    }

    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}`, profile, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  isProfileComplete(user: UserProfile): boolean {
    return user.cpf !== '00000000000' &&
           user.dataNascimento !== null &&
           user.genero !== null &&
           user.telefone !== null;
  }
}
