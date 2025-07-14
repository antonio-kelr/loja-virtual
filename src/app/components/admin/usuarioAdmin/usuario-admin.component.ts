import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/user-profile.model';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuario-admin',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './usuario-admin.component.html',
  styleUrls: ['./usuario-admin.component.scss']
})
export class UsuarioAdminComponent implements OnInit {
  usuarios: UserProfile[] = [];
  loading = true;
  erro = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService

  ) { }

  ngOnInit(): void {
    console.log('Iniciando carregamento de usuários...');
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.erro = '';

    console.log('Carregando usuários...');
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Usuários carregados com sucesso:', users);
        console.log('Quantidade de usuários:', users?.length);
        this.usuarios = users || [];
        this.loading = false;

        // Forçar detecção de mudanças
        this.cdr.detectChanges();
        console.log('Detecção de mudanças forçada para usuários');

        // Verificar se a view foi atualizada
        setTimeout(() => {
          console.log('Verificação após 100ms:');
          console.log('Usuários na view:', this.usuarios.length);
          console.log('Primeiro usuário na view:', this.usuarios[0]?.nome);
        }, 100);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.erro = 'Erro ao carregar usuários. Verifique sua conexão.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // recarregarUsuarios(): void {
  //   console.log('Recarregando usuários...');
  //   this.carregarUsuarios();
  // }

  forcarCarregamento(): void {
    console.log('Forçando carregamento de usuários...');
    this.loading = true;
    this.erro = '';

    // Pequeno delay para garantir que a UI seja atualizada
    setTimeout(() => {
      this.carregarUsuarios();
    }, 100);
  }


  atualizarUsuario(usuario: UserProfile) {
    console.log(`valor`, usuario);

    this.userService.updateUserProfile(usuario).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado com sucesso!'
        });
        this.carregarUsuarios();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar usuário. Tente novamente.'
        });
        console.error(err);
      }
    });
  }

}
