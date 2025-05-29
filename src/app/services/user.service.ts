import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  fotoPerfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5299/api/Users';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateUserProfile(userData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/complete-registration`, userData);
  }

  isProfileComplete(user: UserProfile): boolean {
    return user.cpf !== '00000000000' &&
           user.dataNascimento !== null &&
           user.genero !== null;
  }
}
