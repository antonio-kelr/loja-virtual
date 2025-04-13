import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import  Produtos from '../../../data/Produtos';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CelularesComponent } from "../celulares/celulares.component";


@Component({
  selector: 'app-produtos',
  imports: [CarouselModule, ButtonModule, CommonModule,FontAwesomeModule,CelularesComponent],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent {
    faShoppingCart = faShoppingCart

  products = Produtos;

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
