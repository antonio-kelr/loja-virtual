import { Component, OnInit } from '@angular/core';
import { FavoritoService } from '../../services/favorito.service';
import { CommonModule } from '@angular/common';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
}
