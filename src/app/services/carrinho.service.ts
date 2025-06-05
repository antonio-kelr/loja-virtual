import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

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

  adicionarAoCarrinho(produtoId: any): Observable<any> {
    console.log('Tentando adicionar produto ao carrinho:', produtoId);

    if (!isPlatformBrowser(this.platformId)) {
      console.log('Não está no navegador, retornando Observable vazio');
      return new Observable<any>(subscriber => {
        subscriber.next({});
        subscriber.complete();
      });
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token não encontrado');
      return new Observable<any>(subscriber => {
        subscriber.next({});
        subscriber.complete();
      });
    }

    // Criando o objeto no formato que o servidor espera
    const produtoCarrinho = {
      produtoId: produtoId,
      quantidade: 1
    };

    console.log('Fazendo requisição para:', `${this.apiUrl}/add-produto`);
    console.log('Dados enviados:', produtoCarrinho);
    console.log('Headers:', {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/add-produto`, produtoCarrinho, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap({
        next: (response) => {
          console.log('Resposta do servidor:', response);
          this.buscarCarrinhoDoServidor().subscribe(carrinho => {
            console.log('Carrinho atualizado:', carrinho);
            this.carrinhoSubject.next(carrinho.itens);
          });
        },
        error: (error) => {
          console.error('Erro detalhado:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            error: error.error,
            message: error.message
          });
        }
      })
    );
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
