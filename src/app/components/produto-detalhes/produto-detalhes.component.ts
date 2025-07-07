import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProdutoService } from '../../services/produto.service';
import { Produto, ProdutoImagem } from '../../interfaces/produto.interface';
import { ProdutoCardComponent } from '../produto-card/produto-card.component';
import { CarrinhoService } from '../../services/carrinho.service';
import { MessageService } from 'primeng/api';
import { BreakpointObserver, BreakpointState, LayoutModule } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ProdutoCardComponent,
    LayoutModule,
    RadioButtonModule,
    FormsModule
  ],
  templateUrl: './produto-detalhes.component.html',
  styleUrls: ['./produto-detalhes.component.scss']
})
export class ProdutoDetalhesComponent implements OnInit, OnDestroy {
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
  isMobileView: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private messageService: MessageService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const produtoSlug = params['slug'];
      if (produtoSlug) {
        this.carregarProduto(produtoSlug);
      }
    });

    this.breakpointObserver.observe(['(max-width: 1023px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isMobileView = state.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  adicionarOuComprarProduto(event: Event, comprar: boolean = false) {
    event.stopPropagation();

    console.log('Produto a ser adicionado:', this.produto?.id);

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Usuário não está logado');
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Você precisa estar logado para adicionar produtos ao carrinho.'
      });
      return;
    }

    this.carrinhoService.adicionarAoCarrinho(this.produto?.id).subscribe({
      next: (response) => {
        console.log('Produto adicionado com sucesso:', response);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: comprar ? 'Produto enviado para o carrinho!' : 'Produto adicionado ao carrinho!'
        });

        if (comprar) {
          this.router.navigate(['/carrinho']);
        }
      },
      error: (erro) => {
        console.error('Erro detalhado ao adicionar ao carrinho:', {
          status: erro.status,
          statusText: erro.statusText,
          url: erro.url,
          error: erro.error,
          message: erro.message
        });

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível adicionar o produto ao carrinho.'
        });
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

  onRadioChange(selectedImageId: number): void {
    console.log('Radio button clicado. ID da imagem:', selectedImageId);
    const selectedImage = this.produto?.imagens?.find(img => img.id === selectedImageId);
    if (selectedImage) {
      this.imagemPrincipal = selectedImage;
      console.log('Imagem principal atualizada para:', this.imagemPrincipal);
    } else {
      console.log('Imagem com ID', selectedImageId, 'não encontrada.');
    }
  }

  get precoParcelado(): number {
    return this.produto?.preco ? this.produto.preco / 10 : 0;
  }

  selecionarTab(tab: string): void {
    this.tabAtiva = tab;
  }
}
