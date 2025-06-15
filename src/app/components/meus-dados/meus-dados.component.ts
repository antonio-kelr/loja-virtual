import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileLines, faLock } from '@fortawesome/free-solid-svg-icons';
import { EnderecosComponent } from "../enderecos/enderecos.component";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-meus-dados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    EnderecosComponent,
    DialogModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.scss']
})
export class MeusDadosComponent implements OnInit {
  dadosForm: FormGroup;
  emailForm: FormGroup;
  generos = ['Masculino', 'Feminino', 'Outro'];
  carregando = true;
  erro: string | null = null;
  faFileLines = faFileLines;
  faLock = faLock;
  displayEmailModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.dadosForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      cpf: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dataNascimento: [{value: '', disabled: true}, [Validators.required]],
      genero: ['', [Validators.required]],
      telefone: ['']
    });

    this.emailForm = this.fb.group({
      emailAtual: ['', [Validators.required, Validators.email]],
      senhaAtual: ['', [Validators.required]],
      novoEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    this.carregando = true;
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.dadosForm.patchValue({
            nome: profile.nome,
            email: profile.email,
            cpf: profile.cpf,
            dataNascimento: profile.dataNascimento,
            genero: profile.genero,
            telefone: profile.telefone
          });
          // Preencher o email atual no formulário de alteração de email
          this.emailForm.patchValue({
            emailAtual: profile.email
          });
        }
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
        this.erro = 'Erro ao carregar dados do usuário. Tente novamente mais tarde.';
        this.carregando = false;
      }
    });
  }

  abrirModalEmail(): void {
    this.displayEmailModal = true;
  }

  fecharModalEmail(): void {
    this.displayEmailModal = false;
    this.emailForm.reset();
    // Restaurar o email atual
    this.emailForm.patchValue({
      emailAtual: this.dadosForm.get('email')?.value
    });
  }

  async alterarEmail(): Promise<void> {
    if (this.emailForm.valid) {
      try {
        const { emailAtual, senhaAtual, novoEmail } = this.emailForm.value;
        console.log('Dados para alteração de email:', { emailAtual, senhaAtual, novoEmail });
        this.fecharModalEmail();
      } catch (error: any) {
        console.error('Erro ao alterar email:', error);
        this.erro = 'Erro ao alterar email. Tente novamente.';
      }
    }
  }

}
