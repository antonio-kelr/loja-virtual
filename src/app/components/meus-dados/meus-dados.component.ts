import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileLines, faLock } from '@fortawesome/free-solid-svg-icons';
import { EnderecosComponent } from "../enderecos/enderecos.component";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputOtpModule } from 'primeng/inputotp';

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
    InputTextModule,
    InputOtpModule
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
  sucesso: string | null = null;
  faFileLines = faFileLines;
  faLock = faLock;
  displayEmailModal = false;
  codigo: string = '';
  codigoEnviado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userServiceTrocaEmail: UserService
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
          // Formatar a data para o formato do input date (YYYY-MM-DD)
          const dataFormatada = profile.dataNascimento ? new Date(profile.dataNascimento).toISOString().split('T')[0] : '';

          // Preencher o formulário de dados
          this.dadosForm.patchValue({
            nome: profile.nome,
            email: profile.email,
            cpf: profile.cpf,
            dataNascimento: dataFormatada,
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

  solicitarTrocaEmail(): void {
    if (this.emailForm.invalid) {
      this.erro = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.userServiceTrocaEmail.solicitarTrocaEmail(
      this.emailForm.value.emailAtual,
      this.emailForm.value.senhaAtual,
      this.emailForm.value.novoEmail
    ).subscribe({
      next: (response: { mensagem: string }) => {
        console.log('Email solicitado com sucesso:', response);
        this.sucesso = response.mensagem;
        this.displayEmailModal = false;
      },
      error: (error: any) => {
        console.error('Erro ao solicitar troca de email:', error);
        this.erro = error.error?.mensagem || 'Erro ao solicitar troca de email. Tente novamente mais tarde.';
      }
    });
  }

  confirmarCodigo(): void {
    if (!this.codigo || this.codigo.length !== 6) {
      this.erro = 'Por favor, insira o código de verificação completo.';
      return;
    }

    this.userServiceTrocaEmail.confirmarTrocaEmail(
      this.emailForm.value.novoEmail,
      this.codigo
    ).subscribe({
      next: (response: { mensagem: string }) => {
        this.sucesso = response.mensagem;
        this.codigo = '';
        this.emailForm.reset();
      },
      error: (error: any) => {
        this.erro = error.error?.mensagem || 'Erro ao confirmar código. Tente novamente.';
      }
    });
  }

  abrirModalEmail(): void {
    this.displayEmailModal = true;
  }

  fecharModalEmail(): void {
    this.displayEmailModal = false;
    this.emailForm.reset();
    this.codigoEnviado = false;
    this.codigo = '';
    this.erro = '';
    this.sucesso = '';
  }

  alterarEmail(): void {
    if (this.emailForm.valid) {
      const { novoEmail, emailAtual, senhaAtual } = this.emailForm.value;

      this.userServiceTrocaEmail.solicitarTrocaEmail(novoEmail, emailAtual, senhaAtual).subscribe({
        next: () => {
          this.codigoEnviado = true;
          this.erro = '';
          this.sucesso = 'Código de confirmação enviado para seu e-mail';
        },
        error: (erro: any) => {
          this.erro = erro.error?.message || 'Erro ao solicitar troca de e-mail';
          this.sucesso = '';
        }
      });
    }
  }

}
