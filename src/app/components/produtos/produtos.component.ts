import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ProdutoCardComponent } from '../produto-card/produto-card.component';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../interfaces/produto.interface';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, CarouselModule, ProdutoCardComponent],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  products: Produto[] = [];
  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '1220px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '1100px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    console.log('Iniciando carregamento de produtos...');
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.products = produtos;
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
      }
    });
  }
}
