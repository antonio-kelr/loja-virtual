import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isBrowser } from '../utils/is-browser'; // importe o helper

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private carrinhoSubject = new BehaviorSubject<any[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();
  private apiUrl = 'http://localhost:5299/api/carrinho';

  constructor(private http: HttpClient) {}

  /**
   * Busca os dados do carrinho do servidor
   */
  buscarCarrinhoDoServidor(): Observable<any> {
    if (!isBrowser()) {
      throw new Error('LocalStorage não disponível fora do navegador');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado no localStorage');
    }

    return this.http.get<any>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getCarrinho(): Observable<any[]> {
    return this.carrinho$;
  }

  getQuantidadeItens() {
    return this.carrinhoSubject.value.length;
  }

  adicionarAoCarrinho(produto: any): void {
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
  }

  removerDoCarrinho(produtoId: number): void {
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
  }

  alterarQuantidade(produtoId: number, quantidade: number): void {
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
  }

  limparCarrinho(): void {
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
  }

  calcularTotal(): number {
    return 0;
  }
}
