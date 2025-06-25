import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/user-profile.model';

@Component({
  selector: 'app-usuario-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-admin.component.html',
  styleUrls: ['./usuario-admin.component.scss']
})
export class UsuarioAdminComponent implements OnInit {
  usuarios: UserProfile[] = [];
  loading = true;
  erro = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.usuarios = users;
        this.loading = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar usuários';
        this.loading = false;
      }
    });
  }

  deletarUsuario(idUser: string): void {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      this.userService.deleteUser(idUser).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.idUser !== idUser);
        },
        error: () => {
          alert('Erro ao deletar usuário.');
        }
      });
    }
  }
}
