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

@Component({
  selector: 'app-produto-admin',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, DropdownModule, FormsModule],
  templateUrl: './produto-admin.component.html',
  styleUrls: ['./produto-admin.component.scss']
})
export class ProdutoAdminComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categorias: Categoria[] = [];
  categoriaSelecionada: Categoria | null = null;
  carregando: boolean = true;

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
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