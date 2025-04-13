import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itensCarrinho: any[] = [];
  private carrinhoSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    // Recupera o carrinho do localStorage ao iniciar o serviço
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.itensCarrinho = JSON.parse(carrinhoSalvo);
      this.carrinhoSubject.next(this.itensCarrinho);
    }
  }

  getCarrinho() {
    return this.carrinhoSubject.asObservable();
  }

  getQuantidadeItens() {
    return this.itensCarrinho.length;
  }

  adicionarAoCarrinho(produto: any) {
    // Verificar se o produto já existe no carrinho
    const produtoExistente = this.itensCarrinho.find(item => item.id === produto.id);

    if (produtoExistente) {
      // Se já existe, incrementa a quantidade
      produtoExistente.quantidade += 1;
    } else {
      // Se não existe, adiciona com quantidade 1
      this.itensCarrinho.push({
        ...produto,
        quantidade: 1
      });
    }

    // Atualiza o observable e o localStorage
    this.atualizarCarrinho();

    return this.itensCarrinho.length;
  }

  removerDoCarrinho(produtoId: number) {
    this.itensCarrinho = this.itensCarrinho.filter(item => item.id !== produtoId);
    this.atualizarCarrinho();
  }

  alterarQuantidade(produtoId: number, quantidade: number) {
    const produto = this.itensCarrinho.find(item => item.id === produtoId);
    if (produto) {
      produto.quantidade = quantidade;
      if (quantidade <= 0) {
        this.removerDoCarrinho(produtoId);
      } else {
        this.atualizarCarrinho();
      }
    }
  }

  limparCarrinho() {
    this.itensCarrinho = [];
    this.atualizarCarrinho();
  }

  calcularTotal() {
    return this.itensCarrinho.reduce((total, item) => {
      const preco = item.preco || item.precoAtual || 0;
      return total + (preco * item.quantidade);
    }, 0);
  }

  private atualizarCarrinho() {
    // Atualiza o BehaviorSubject para notificar os componentes inscritos
    this.carrinhoSubject.next([...this.itensCarrinho]);

    // Salva no localStorage
    localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
  }
}
