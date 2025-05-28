import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from "../nav/nav.component";
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent, NavComponent],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  cadastroForm: FormGroup;
  generos = ['Homem', 'Mulher'];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dataNascimento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      telefone: [''],
      ativo: [true],
      role: ['user']
    }, {
      validators: this.senhasIguais
    });
  }

  senhasIguais(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  async loginComGoogle() {
    try {
      this.isLoading = true;
      const user = await this.authService.loginWithGoogle();
      console.log('Dados do usuário Google:', {
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        uid: user.uid
      });
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      const formData = this.cadastroForm.value;
      console.log('Dados do formulário:', formData);
      // Remover confirmarSenha antes de enviar
      delete formData.confirmarSenha;

      // Converter data para o formato DateOnly
      formData.dataNascimento = new Date(formData.dataNascimento).toISOString().split('T')[0];

      console.log('Dados do formulário:', formData);
      // Aqui você implementará a lógica de cadastro
    }
  }

  loginComFacebook() {
    console.log('Login com Facebook');
    // Implementar integração com Facebook
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  // Máscara para CPF
  formatarCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    event.target.value = value;
  }

  // Máscara para telefone
  formatarTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    event.target.value = value;
  }
}
