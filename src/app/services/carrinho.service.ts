import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private carrinhoSubject = new BehaviorSubject<any[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();
  private apiUrl = 'http://localhost:5299/api/carrinho';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Busca os dados do carrinho do servidor
   */
  buscarCarrinhoDoServidor(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable<any>(subscriber => {
        subscriber.next({ itens: [] });
        subscriber.complete();
      });
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable<any>(subscriber => {
        subscriber.next({ itens: [] });
        subscriber.complete();
      });
    }

    return this.http.get<any>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Remove um produto do carrinho
   * @param produtoId ID do produto a ser removido
   */
  removerProdutoDoCarrinho(produtoId: number): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable<any>(subscriber => {
        subscriber.next({});
        subscriber.complete();
      });
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable<any>(subscriber => {
        subscriber.next({});
        subscriber.complete();
      });
    }

    return this.http.delete<any>(`${this.apiUrl}/remover-produto/${produtoId}`, {
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
