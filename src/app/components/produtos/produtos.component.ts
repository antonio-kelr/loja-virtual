import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ProdutoCardComponent } from '../produto-card/produto-card.component';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../interfaces/produto.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, CarouselModule, ProdutoCardComponent, ButtonModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  celulares: Produto[] = [];
  notebooks: Produto[] = [];
  monitores: Produto[] = [];

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
    this.carregarProdutosPorCategoria();
  }

  carregarProdutosPorCategoria() {
    // Carregar Celulares
    this.produtoService.getProdutosPorCategoria('celular-smartphone').subscribe({
      next: (produtos) => {
        this.celulares = produtos;
      },
      error: (erro) => {
        console.error('Erro ao carregar celulares:', erro);
      }
    });

    // Carregar Notebooks
    this.produtoService.getProdutosPorCategoria('Computadores').subscribe({
      next: (produtos) => {
        this.notebooks = produtos;
      },
      error: (erro) => {
        console.error('Erro ao carregar notebooks:', erro);
      }
    });

    // Carregar Monitores
    this.produtoService.getProdutosPorCategoria('moinitor').subscribe({
      next: (produtos) => {
        this.monitores = produtos;
      },
      error: (erro) => {
        console.error('Erro ao carregar monitores:', erro);
      }
    });
  }
}
