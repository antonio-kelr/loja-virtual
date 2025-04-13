import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faTruck } from '@fortawesome/free-solid-svg-icons';
import { CarrinhoService } from '../../services/carrinho.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import produtos from '../../../data/Produtos';

@Component({
  selector: 'app-produto-detalhes',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './produto-detalhes.component.html',
  styleUrls: ['./produto-detalhes.component.scss']
})
export class ProdutoDetalhesComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faTruck = faTruck;

  produto: any = null;
  quantidadeSelecionada: number = 1;
  opcoesFrete: any[] = [
    { tipo: 'Frete Grátis', preco: 0, prazo: '7-10 dias úteis' },
    { tipo: 'Frete Expresso', preco: 19.90, prazo: '2-3 dias úteis' },
    { tipo: 'Frete Prioritário', preco: 29.90, prazo: '1 dia útil' }
  ];
  freteSelecionado: any = null;
  tabAtiva: string = 'descricao'; // Tab padrão

  constructor(
    private route: ActivatedRoute,
    private carrinhoService: CarrinhoService
  ) { }

  ngOnInit(): void {
    // Pegar o ID do produto da rota
    this.route.params.subscribe(params => {
      const produtoId = +params['id']; // O "+" converte string para número

      if (produtoId) {
        // Buscar o produto pelo ID
        this.produto = produtos.find(p => p.id === produtoId);

        if (!this.produto) {
          console.error('Produto não encontrado');
          // Aqui você pode redirecionar para uma página 404 ou voltar para a lista de produtos
        }

        // Selecionar o frete grátis como padrão
        this.freteSelecionado = this.opcoesFrete[0];
      }
    });
  }

  get precoParcelado(): number {
    return this.produto?.precoAtual / 10 || 0;
  }

  selecionarTab(tab: string): void {
    this.tabAtiva = tab;
  }

  adicionarAoCarrinho(): void {
    if (this.produto) {
      this.carrinhoService.adicionarAoCarrinho({
        ...this.produto,
        frete: this.freteSelecionado
      });
      alert('Produto adicionado ao carrinho!');
    }
  }

  selecionarFrete(frete: any): void {
    this.freteSelecionado = frete;
  }

  irParaCarrinho(): void {
    // A navegação será feita pelo routerLink no template
  }
}
