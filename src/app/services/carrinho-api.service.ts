import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrinho } from '../interfaces/carrinho.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoApiService {
  private apiUrl = `${environment.apiUrl}/carrinho`;

  constructor(private http: HttpClient) {}

  getCarrinho(): Observable<Carrinho> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Carrinho>(this.apiUrl, { headers });
  }
}
