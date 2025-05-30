import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../interfaces/produto.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:5299/api/Produtos'; // Ajuste para sua URL da API

  constructor(private http: HttpClient) { }
  // Buscar todos os produtos
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  // Buscar produto por ID
  getProdutoPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

// Buscar produtos por nome da categoria (endpoint novo que você criou)
getProdutosPorCategoria(nomeCategoria: string): Observable<Produto[]> {
  return this.http.get<Produto[]>(`${this.apiUrl}/categoria/${nomeCategoria}`);
}

  // Buscar produtos em destaque
  getProdutosDestaque(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}?destaque=true`);
  }

  getProdutosMercadoLivre(query: string): Observable<any> {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
    return this.http.get<any>(url);
  }


  // Criar novo produto
  criarProduto(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  // Atualizar produto
  atualizarProduto(id: number, produto: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  // Deletar produto
  deletarProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar produto por slug
  getProdutoPorSlug(slug: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/slug/${slug}`);
  }
}
