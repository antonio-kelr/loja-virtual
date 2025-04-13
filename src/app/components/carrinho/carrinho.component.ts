import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  itensCarrinho: any[] = [];
  totalCarrinho: number = 0;

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inscreve-se no observable do carrinho para receber atualizações
    this.carrinhoService.getCarrinho().subscribe(itens => {
      this.itensCarrinho = itens;
      this.calcularTotal();
    });
  }

  calcularTotal(): void {
    this.totalCarrinho = this.carrinhoService.calcularTotal();
  }

  atualizarQuantidade(produto: any, quantidade: number): void {
    this.carrinhoService.alterarQuantidade(produto.id, quantidade);
  }

  atualizarQuantidadeInput(event: Event, produto: any): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      const quantidade = parseInt(input.value, 10);
      if (!isNaN(quantidade) && quantidade > 0) {
        this.carrinhoService.alterarQuantidade(produto.id, quantidade);
      }
    }
  }

  removerItem(produto: any): void {
    this.carrinhoService.removerDoCarrinho(produto.id);
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }

  finalizarCompra(): void {
    if (this.itensCarrinho.length > 0) {
      // Seleciona o primeiro item do carrinho para checkout
      localStorage.setItem('produtoCompra', JSON.stringify(this.itensCarrinho[0]));
      this.router.navigate(['/checkout']);
    } else {
      alert('Seu carrinho está vazio!');
    }
  }
}
