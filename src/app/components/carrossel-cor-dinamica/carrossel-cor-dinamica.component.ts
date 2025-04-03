import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProdutosComponent } from "../produtos/produtos.component";

@Component({
  selector: 'app-carrossel-cor-dinamica',
  templateUrl: './carrossel-cor-dinamica.component.html',
  styleUrls: ['./carrossel-cor-dinamica.component.scss'],
  imports: [CommonModule, ProdutosComponent]
})
export class CarrosselCorDinamicaComponent implements AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  images = [
    'assets/img/img-1.webp',
    'assets/img/img-2.webp',
    'assets/img/img-3.webp',
    'assets/img/img-4.webp',
    'assets/img/img-5.webp',
    'assets/img/img-6.webp',
    'assets/img/img-7.webp',
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) { // Verifica se está no browser
      import('bootstrap').then((bootstrap) => { // Carrega o Bootstrap apenas no cliente
        const carouselElement = this.carousel.nativeElement;
        const bsCarousel = new bootstrap.Carousel(carouselElement);

        // Adiciona evento para alterar fundo ao trocar de slide
        carouselElement.addEventListener('slid.bs.carousel', () => {
          const activeImage: HTMLImageElement = carouselElement.querySelector('.carousel-item.active img');
          if (activeImage) {
            this.changeBackground(activeImage.src);
          }
        });

        // Altera o fundo ao carregar o primeiro slide
        setTimeout(() => {
          const firstImage: HTMLImageElement = carouselElement.querySelector('.carousel-item.active img');
          if (firstImage) {
            this.changeBackground(firstImage.src);
          }
        }, 500);
      });
    }
  }

  async changeBackground(imageUrl: string) {
    if (isPlatformBrowser(this.platformId)) { // Verifica se está no browser antes de usar o document
      const color = await this.getDominantColor(imageUrl);
      // Certifica-se de que o código de manipulação do DOM só ocorra no navegador
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = color;
      }
    }
  }

  getDominantColor(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx?.getImageData(0, 0, 1, 1).data;
        if (imageData) {
          const [r, g, b] = imageData;
          resolve(`rgb(${r}, ${g}, ${b})`);
        }
      };
    });
  }
}
