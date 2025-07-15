import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Endereco } from '../interfaces/endereco.interface';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private apiUrl = `${environment.apiUrl}/endereco`;

  constructor(private http: HttpClient) { }

  listarEnderecos(): Observable<Endereco[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Endereco[]>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  criarEndereco(endereco: Omit<Endereco, 'id'>): Observable<Endereco> {
    const token = localStorage.getItem('token');
    return this.http.post<Endereco>(this.apiUrl, endereco, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  atualizarEndereco(id: number, endereco: Partial<Endereco>): Observable<Endereco> {
    const token = localStorage.getItem('token');
    return this.http.put<Endereco>(`${this.apiUrl}/${id}`, endereco, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  deletarEndereco(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
