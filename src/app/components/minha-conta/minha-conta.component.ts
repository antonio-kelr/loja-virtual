import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user.component';

@Component({
  selector: 'app-minha-conta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    SidebarUserComponent
  ],
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss']
})
export class MinhaContaComponent implements OnInit {
  userProfile: any = {
    nome: '',
    email: '',
    fotoPerfil: ''
  };

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Aqui você pode carregar os dados do usuário do serviço de autenticação
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    // Implementar lógica para carregar dados do usuário
    console.log('Carregando dados do usuário...');
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.userProfile = null;
        // Se houver erro de autenticação, limpar os dados do localStorage
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      }
    });
  }

  atualizarDados(): void {
    // Implementar lógica para atualizar dados do usuário
    console.log('Atualizando dados do usuário...');
  }
}
