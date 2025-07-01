import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../../services/produto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Produto, Categoria } from '../../../interfaces/produto.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-produto-admin',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './produto-admin.component.html',
  styleUrls: ['./produto-admin.component.scss']
})
export class ProdutoAdminComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categorias: Categoria[] = [];
  categoriaSelecionada: Categoria | null = null;
  carregando: boolean = true;

  // Modal de criação
  mostrarModalCriar: boolean = false;
  produtoNovo: any = {
    nome: '',
    descricao: '',
    preco: 0,
    precoAntigo: 0,
    categoriaId: null,
    slug: ''
  };
  salvando: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    console.log('Iniciando carregamento de produtos...');
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregarProdutos();
      },
      error: (erro) => {
        console.error('Erro ao carregar categorias:', erro);
        this.carregarProdutos();
      }
    });
  }

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        console.log('Produtos carregados com sucesso:', produtos);
        console.log('Tipo de produtos:', typeof produtos);
        console.log('É array?', Array.isArray(produtos));
        console.log('Quantidade de produtos:', produtos?.length);
        console.log('Primeiro produto:', produtos?.[0]);

        this.produtos = produtos || [];
        this.produtosFiltrados = [...this.produtos];
        console.log('Produtos após atribuição:', this.produtos);
        console.log('Quantidade após atribuição:', this.produtos.length);
        this.carregando = false;

        // Forçar detecção de mudanças
        this.cdr.detectChanges();
        console.log('Detecção de mudanças forçada');

        // Verificar se a view foi atualizada
        setTimeout(() => {
          console.log('Verificação após 100ms:');
          console.log('Produtos na view:', this.produtos.length);
          console.log('Primeiro produto na view:', this.produtos[0]?.nome);
        }, 100);
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCriar(): void {
    this.produtoNovo = {
      nome: '',
      descricao: '',
      preco: 0,
      precoAntigo: 0,
      categoriaId: null,
      slug: ''
    };
    this.mostrarModalCriar = true;
  }

  fecharModalCriar(): void {
    this.mostrarModalCriar = false;
    this.salvando = false;
  }


  criarProduto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.salvando = true;


    console.log('novo produto',this.produtoNovo);

    // this.produtoService.criarProduto(this.produtoNovo).subscribe({
    //   next: (produtoCriado) => {
    //     console.log('Produto criado com sucesso:', produtoCriado);
    //     this.produtos.push(produtoCriado);
    //     this.produtosFiltrados = [...this.produtos];
    //     this.fecharModalCriar();
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Sucesso',
    //       detail: 'Produto criado com sucesso!'
    //     });
    //     this.cdr.detectChanges();
    //   },
    //   error: (erro) => {
    //     console.error('Erro ao criar produto:', erro);
    //     this.salvando = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Erro',
    //       detail: 'Erro ao criar produto. Tente novamente.'
    //     });
    //   }
    // });
  }

  validarFormulario(): boolean {
    if (!this.produtoNovo.nome || this.produtoNovo.nome.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Nome do produto é obrigatório'
      });
      return false;
    }

    if (!this.produtoNovo.descricao || this.produtoNovo.descricao.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Descrição do produto é obrigatória'
      });
      return false;
    }

    if (!this.produtoNovo.preco || this.produtoNovo.preco <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preço deve ser maior que zero'
      });
      return false;
    }

    if (!this.produtoNovo.categoriaId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Categoria é obrigatória'
      });
      return false;
    }

    return true;
  }

  filtrarPorCategoria(): void {
    if (this.categoriaSelecionada) {
      this.produtosFiltrados = this.produtos.filter(
        produto => produto.categoriaId === this.categoriaSelecionada!.id
      );
    } else {
      this.produtosFiltrados = this.produtos;
    }
  }

  limparFiltro(): void {
    this.categoriaSelecionada = null;
    this.produtosFiltrados = this.produtos;
  }

  getNomeCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Categoria não encontrada';
  }
}