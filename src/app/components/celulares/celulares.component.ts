import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProdutoCardComponent } from '../produto-card/produto-card.component';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../interfaces/produto.interface';

@Component({
  selector: 'app-celulares',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ProdutoCardComponent,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './celulares.component.html',
  styleUrls: ['./celulares.component.scss']
})
export class CelularesComponent implements OnInit {
  celulares: Produto[] = [];
  celularesFiltrados: Produto[] = [];
  nomesCelulares: string[] = [];
  filtroAtivo: string | null = null;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.carregarCelulares();
  }

  carregarCelulares() {
    this.produtoService.getProdutosPorCategoria('celular-smartphone').subscribe({
      next: (produtos) => {
        this.celulares = produtos;
        this.celularesFiltrados = produtos;
        // Extrair nomes únicos dos celulares
        this.nomesCelulares = [...new Set(produtos.map(celular => celular.nome))];
        console.log('Celulares carregados:', this.celulares);
      },
      error: (erro) => {
        console.error('Erro ao carregar celulares:', erro);
      }
    });
  }

  filtrarPorNome(nome: string) {
    if (this.filtroAtivo === nome) {
      // Se clicar no mesmo filtro, remove o filtro
      this.filtroAtivo = null;
      this.celularesFiltrados = this.celulares;
    } else {
      // Aplica o novo filtro
      this.filtroAtivo = nome;
      this.celularesFiltrados = this.celulares.filter(celular =>
        celular.nome === nome
      );
    }
  }
}
