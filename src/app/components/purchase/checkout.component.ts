import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  produto: any;
  metodoPagamento: string = 'pix';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Recupera o produto do localStorage
    const produtoData = localStorage.getItem('produtoCompra');
    if (produtoData) {
      this.produto = JSON.parse(produtoData);
    } else {
      // Se não houver produto, redireciona para a página inicial
      this.router.navigate(['/']);
    }
  }

  finalizarCompra() {
    console.log('Compra finalizada com método:', this.metodoPagamento);
    console.log('Produto:', this.produto);

    // Limpa o localStorage após a compra
    localStorage.removeItem('produtoCompra');

    // Aqui você pode implementar a lógica de finalização da compra
    // como enviar para uma API, etc.

    // Após processar, pode redirecionar para uma página de confirmação
    alert('Compra finalizada com sucesso!');
    this.router.navigate(['/']);
  }
}
