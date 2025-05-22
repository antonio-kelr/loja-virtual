import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ProdutoCardComponent } from '../produto-card/produto-card.component';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../interfaces/produto.interface';

@Component({
  selector: 'app-celulares',
  standalone: true,
  imports: [CarouselModule, ButtonModule, CommonModule, FontAwesomeModule, ProdutoCardComponent, FooterComponent, HeaderComponent],
  templateUrl: './celulares.component.html',
  styleUrls: ['./celulares.component.scss', '../produtos/produtos.component.scss']
})
export class CelularesComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  celulares: Produto[] = [];
  responsiveOptions: any[] | undefined;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.carregarCelulares();
    this.configurarResponsividade();
  }

  carregarCelulares() {
    this.produtoService.getProdutosPorCategoria('celular-smartphone').subscribe({
      next: (produtos) => {
        this.celulares = produtos;
        console.log('Celulares carregados:', this.celulares);
      },
      error: (erro) => {
        console.error('Erro ao carregar celulares:', erro);
      }
    });
  }

  private configurarResponsividade() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}