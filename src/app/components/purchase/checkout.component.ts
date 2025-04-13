import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  produto: any;
  itensCarrinho: any[] = [];
  totalCompra: number = 0;
  metodoPagamento: string = 'pix';
  mostrarPagamento: boolean = false;

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    // Recupera os itens do carrinho
    this.carrinhoService.getCarrinho().subscribe(itens => {
      this.itensCarrinho = itens;

      if (this.itensCarrinho.length === 0) {
        // Se não houver itens no carrinho, redireciona para a página inicial
        this.router.navigate(['/']);
      } else {
        // Recupera o produto selecionado do localStorage (se houver)
        const produtoData = localStorage.getItem('produtoCompra');
        if (produtoData) {
          this.produto = JSON.parse(produtoData);
        } else {
          // Se não houver produto específico, usa o primeiro item do carrinho
          this.produto = this.itensCarrinho[0];
        }

        this.calcularTotal();
      }
    });
  }

  calcularTotal(): void {
    this.totalCompra = this.carrinhoService.calcularTotal();
  }

  continuarCompra() {
    // Navega de volta para a página de produtos
    this.router.navigate(['/']);
  }

  irParaPagamento() {
    // Mostra a seção de pagamento
    this.mostrarPagamento = true;

    // Rola a tela para a seção de pagamento após um pequeno delay
    setTimeout(() => {
      document.querySelector('.pagamento-container')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  finalizarCompra() {
    console.log('Compra finalizada com método:', this.metodoPagamento);
    console.log('Itens do carrinho:', this.itensCarrinho);
    console.log('Total da compra:', this.totalCompra);

    // Limpa o localStorage e o carrinho após a compra
    localStorage.removeItem('produtoCompra');
    this.carrinhoService.limparCarrinho();

    // Após processar, redireciona para uma página de confirmação
    alert('Compra finalizada com sucesso!');
    this.router.navigate(['/']);
  }
}
