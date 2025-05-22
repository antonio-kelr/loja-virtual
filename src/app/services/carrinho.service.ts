import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  // private carrinhoKey = 'carrinho';
  private carrinhoSubject = new BehaviorSubject<any[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor() {
    // Temporariamente desabilitado para evitar erro de localStorage
    // const carrinhoSalvo = localStorage.getItem(this.carrinhoKey);
    // if (carrinhoSalvo) {
    //   this.carrinhoSubject.next(JSON.parse(carrinhoSalvo));
    // }
  }

  getCarrinho(): Observable<any[]> {
    return this.carrinho$;
  }

  getQuantidadeItens() {
    return this.carrinhoSubject.value.length;
  }

  adicionarAoCarrinho(produto: any): void {
    // Temporariamente desabilitado
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
    // const carrinhoAtual = this.carrinhoSubject.value;
    // const produtoExistente = carrinhoAtual.find(item => item.id === produto.id);

    // if (produtoExistente) {
    //   produtoExistente.quantidade += 1;
    // } else {
    //   carrinhoAtual.push({ ...produto, quantidade: 1 });
    // }

    // this.carrinhoSubject.next(carrinhoAtual);
    // localStorage.setItem(this.carrinhoKey, JSON.stringify(carrinhoAtual));
  }

  removerDoCarrinho(produtoId: number): void {
    // Temporariamente desabilitado
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
    // const carrinhoAtual = this.carrinhoSubject.value;
    // const novoCarrinho = carrinhoAtual.filter(item => item.id !== produtoId);
    // this.carrinhoSubject.next(novoCarrinho);
    // localStorage.setItem(this.carrinhoKey, JSON.stringify(novoCarrinho));
  }

  alterarQuantidade(produtoId: number, quantidade: number): void {
    // Temporariamente desabilitado
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
    // const carrinhoAtual = this.carrinhoSubject.value;
    // const produto = carrinhoAtual.find(item => item.id === produtoId);
    // if (produto) {
    //   produto.quantidade = quantidade;
    //   this.carrinhoSubject.next(carrinhoAtual);
    //   localStorage.setItem(this.carrinhoKey, JSON.stringify(carrinhoAtual));
    // }
  }

  limparCarrinho(): void {
    // Temporariamente desabilitado
    console.log('Funcionalidade de carrinho temporariamente desabilitada');
    // this.carrinhoSubject.next([]);
    // localStorage.removeItem(this.carrinhoKey);
  }

  calcularTotal(): number {
    // Temporariamente desabilitado
    return 0;
    // return this.carrinhoSubject.value.reduce((total, item) => {
    //   return total + (item.preco * item.quantidade);
    // }, 0);
  }
}
