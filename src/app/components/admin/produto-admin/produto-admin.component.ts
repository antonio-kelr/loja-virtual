import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../interfaces/produto.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-produto-admin',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './produto-admin.component.html',
  styleUrls: ['./produto-admin.component.scss']
})
export class ProdutoAdminComponent implements OnInit {
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);
      }
    });
  }
}