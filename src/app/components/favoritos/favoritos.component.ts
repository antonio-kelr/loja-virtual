import { Component, OnInit } from '@angular/core';
import { FavoritoService } from '../../services/favorito.service';
import { CommonModule } from '@angular/common';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { log } from 'console';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
  standalone: true,
  imports: [CommonModule,FontAwesomeModule]
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];
  faHeart = faHeart

  constructor(private favoritoService: FavoritoService) { }

  ngOnInit(): void {
    this.carregarFavoritos();
  }

  carregarFavoritos(): void {
    this.favoritoService.getFavoritos().subscribe({
      next: (data) => {
        console.log('favoritos carregados', data);
        this.favoritos = data;
      },
      error: (error) => {
        console.error('Erro ao carregar favoritos:', error);
      }
    });
  }

  deletetFavorito(favorito: any): void {
    const produtoId = favorito.produto.id;

    // Remove da lista local
    this.favoritos = this.favoritos.filter(fav => fav.produto.id !== produtoId);

    this.favoritoService.deletetFavorito(produtoId).subscribe({
      next: () => {
        console.log('Favorito removido com sucesso', produtoId);
        // Se quiser garantir sincronização, pode chamar carregarFavoritos()
      },
      error: (error) => {
        console.error('Erro ao remover favorito:', error);
        // Opcional: adicionar de volta caso deseje
        this.favoritos.push(favorito);
      }
    });
  }




}
