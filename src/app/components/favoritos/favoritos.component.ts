import { Component, OnInit } from '@angular/core';
import { FavoritoService } from '../../services/favorito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];

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
}
