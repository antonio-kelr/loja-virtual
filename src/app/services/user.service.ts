import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5299/api/Users';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('ID do usuário não encontrado');
    }
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateUserProfile(profile: UserProfile): Observable<UserProfile> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('ID do usuário não encontrado');
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
           user.genero !== null;
  }
}
