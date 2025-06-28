import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProdutoService } from '../../services/produto.service';
import { Produto, ProdutoImagem } from '../../interfaces/produto.interface';
import { ProdutoCardComponent } from '../produto-card/produto-card.component';

@Component({
  selector: 'app-produto-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ProdutoCardComponent
  ],
  templateUrl: './produto-detalhes.component.html',
  styleUrls: ['./produto-detalhes.component.scss']
})
export class ProdutoDetalhesComponent implements OnInit {
  faCartPlus = faCartPlus;

  produto: Produto | null = null;
  carregando: boolean = true;
  imagemPrincipal: ProdutoImagem | null = null;
  quantidadeSelecionada: number = 1;
  tabAtiva: string = 'descricao';
  produtosRelacionados: Produto[] = [];
  posicaoSlider: number = 0;
  larguraProduto: number = 130;
  produtosPorSlide: number = 4;
  slideAtual: number = 0;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const produtoSlug = params['slug'];
      if (produtoSlug) {
        this.carregarProduto(produtoSlug);
      }
    });
  }

  carregarProduto(slug: string): void {
    this.carregando = true;
    this.produtoService.getProdutoPorSlug(slug).subscribe({
      next: (produto) => {
        this.produto = produto;
        if (produto.imagens && produto.imagens.length > 0) {
          this.imagemPrincipal = produto.imagens[0];
        }
        this.carregarProdutosRelacionados(produto.categoriaId);
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar produto:', erro);
        this.produto = null;
        this.carregando = false;
      }
    });
  }

  selecionarProduto(slug?: string): void {
    if (!slug) {
      console.warn('Slug inválido:', slug);
      return;
    }

    // Recarrega o novo produto no mesmo componente sem mudar de rota
    this.carregarProduto(slug);
    this.router.navigateByUrl(`/produto/${slug}`, { skipLocationChange: false });
  }

  carregarProdutosRelacionados(categoriaId: number): void {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtosRelacionados = produtos
          .filter(p => p.categoriaId === categoriaId && p.id !== this.produto?.id);
        this.posicaoSlider = 0;
        this.slideAtual = 0;
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos relacionados:', erro);
      }
    });
  }

  slideAnterior(): void {
    if (this.slideAtual > 0) {
      this.slideAtual--;
      this.posicaoSlider = -(this.slideAtual * this.larguraProduto * this.produtosPorSlide);
    }
  }

  slideProximo(): void {
    const totalSlides = Math.ceil(this.produtosRelacionados.length / this.produtosPorSlide);
    if (this.slideAtual < totalSlides - 1) {
      this.slideAtual++;
      this.posicaoSlider = -(this.slideAtual * this.larguraProduto * this.produtosPorSlide);
    }
  }

  trocarImagemPrincipal(imagem: ProdutoImagem): void {
    this.imagemPrincipal = imagem;
  }

  get precoParcelado(): number {
    return this.produto?.preco ? this.produto.preco / 10 : 0;
  }

  selecionarTab(tab: string): void {
    this.tabAtiva = tab;
  }
}
