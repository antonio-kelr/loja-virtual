import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, HeaderComponent, FooterComponent],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;

  itensCarrinho: ItemCarrinho[] = [];
  total: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Aqui vamos carregar os itens do carrinho
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    // Simulando dados do carrinho
    this.itensCarrinho = [
      {
        id: 1,
        nome: 'Produto 1',
        preco: 199.90,
        quantidade: 1,
        imagem: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        nome: 'Produto 2',
        preco: 299.90,
        quantidade: 2,
        imagem: 'https://via.placeholder.com/150'
      }
    ];
    this.calcularTotal();
  }

  atualizarQuantidade(item: ItemCarrinho, incremento: number): void {
    const novaQuantidade = item.quantidade + incremento;
    if (novaQuantidade > 0) {
      item.quantidade = novaQuantidade;
      this.calcularTotal();
    }
  }

  removerItem(item: ItemCarrinho): void {
    this.itensCarrinho = this.itensCarrinho.filter(i => i.id !== item.id);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.itensCarrinho.reduce((acc, item) => {
      return acc + (item.preco * item.quantidade);
    }, 0);
  }

  finalizarCompra(): void {
    // Implementar lógica de finalização de compra
    console.log('Finalizando compra...');
  }
}
