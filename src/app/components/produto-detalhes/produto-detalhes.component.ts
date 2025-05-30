import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../interfaces/produto.interface';

@Component({
  selector: 'app-produto-detalhes',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './produto-detalhes.component.html',
  styleUrls: ['./produto-detalhes.component.scss']
})
export class ProdutoDetalhesComponent implements OnInit {
  faTruck = faTruck;

  produto: Produto | null = null;
  quantidadeSelecionada: number = 1;
  opcoesFrete: any[] = [
    { tipo: 'Frete Grátis', preco: 0, prazo: '7-10 dias úteis' },
    { tipo: 'Frete Expresso', preco: 19.90, prazo: '2-3 dias úteis' },
    { tipo: 'Frete Prioritário', preco: 29.90, prazo: '1 dia útil' }
  ];
  freteSelecionado: any = null;
  tabAtiva: string = 'descricao';

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const produtoSlug = params['slug'];

      if (produtoSlug) {
        this.carregarProduto(produtoSlug);
        this.freteSelecionado = this.opcoesFrete[0];
      }
    });
  }

  carregarProduto(slug: string): void {
    this.produtoService.getProdutoPorSlug(slug).subscribe({
      next: (produto) => {
        console.log('Produto carregado:', produto);
        this.produto = produto;
      },
      error: (erro) => {
        console.error('Erro ao carregar produto:', erro);
      }
    });
  }

  get precoParcelado(): number {
    return this.produto?.preco ? this.produto.preco / 10 : 0;
  }

  selecionarTab(tab: string): void {
    this.tabAtiva = tab;
  }

  selecionarFrete(frete: any): void {
    this.freteSelecionado = frete;
  }
}
