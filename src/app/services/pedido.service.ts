import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:5299/api/pedido';

  constructor(private http: HttpClient) {}

  criarPedido(payload: { userId: number, EnderecoId: number, itens: any[] }): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(this.apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getPedidos(userId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
