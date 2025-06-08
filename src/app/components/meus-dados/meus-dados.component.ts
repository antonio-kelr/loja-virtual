import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meus-dados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.scss']
})
export class MeusDadosComponent {
  userData = {
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  };

  onSubmit() {
    console.log('Dados do usuário:', this.userData);
    // Implementar lógica para salvar os dados
  }
}
