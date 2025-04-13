import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Produtos from '../../../data/Produtos';

@Component({
  selector: 'app-celulares',
  imports: [CarouselModule, ButtonModule, CommonModule, FontAwesomeModule],
  templateUrl: './celulares.component.html',
  styleUrls: ['./celulares.component.scss', '../produtos/produtos.component.scss']
})
export class CelularesComponent {
  faShoppingCart = faShoppingCart;

  celulares = Produtos.filter(produto => produto.id >= 1 && produto.id <= 15);

  responsiveOptions: any[] | undefined;

  ngOnInit() {
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