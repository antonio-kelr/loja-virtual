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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserProfile } from '../../models/user-profile.model';
import { log } from 'console';

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
    InputOtpModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.scss']
})
export class MeusDadosComponent implements OnInit {
  dadosForm: FormGroup;
  emailForm: FormGroup;
  senhaForm: FormGroup;
  generos = ['Masculino', 'Feminino', 'Outro'];
  carregando = true;
  erro: string | null = null;
  sucesso: string | null = null;
  faFileLines = faFileLines;
  faLock = faLock;
  displayEmailModal = false;
  displayCodigoModal = false;
  displaySenhaModal = false;
  codigo: string = '';
  codigoEnviado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userServiceTrocaEmail: UserService,
    private messageService: MessageService
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
      novoEmail: ['', [Validators.required, Validators.email]],
    });

    this.senhaForm = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarNovaSenha: ['', [Validators.required]]
    }, {
      validators: this.senhasIguaisValidator
    });
  }

  // Validador personalizado para verificar se as senhas são iguais
  private senhasIguaisValidator(form: FormGroup) {
    const novaSenha = form.get('novaSenha')?.value;
    const confirmarNovaSenha = form.get('confirmarNovaSenha')?.value;

    if (novaSenha !== confirmarNovaSenha) {
      form.get('confirmarNovaSenha')?.setErrors({ senhasDiferentes: true });
      return { senhasDiferentes: true };
    } else {
      // Se estavam com erro antes, limpa
      const confirmarControl = form.get('confirmarNovaSenha');
      if (confirmarControl?.hasError('senhasDiferentes')) {
        confirmarControl.setErrors(null);
      }
    }

    return null;
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

  salvarDadosUsuario(): void {
    if (this.dadosForm.valid) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID do usuário não encontrado',
          life: 5000
        });
        return;
      }

      // Primeiro, buscar o usuário completo
      this.authService.getUserProfile().subscribe({
        next: (userProfile) => {
          // Atualizar apenas os campos do formulário
          const dadosAtualizados: UserProfile = {
            ...userProfile, // Mantém todos os dados existentes
            idUser: userId,
            nome: this.dadosForm.get('nome')?.value,
            genero: this.dadosForm.get('genero')?.value,
            telefone: this.dadosForm.get('telefone')?.value
          };

          this.userServiceTrocaEmail.updateUserProfile(dadosAtualizados).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados atualizados com sucesso!',
                life: 5000
              });
              // Recarrega os dados do usuário para atualizar a tela
              this.carregarDadosUsuario();
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: error.error?.mensagem || 'Erro ao atualizar dados. Tente novamente.',
                life: 5000
              });
            }
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar dados do usuário. Tente novamente.',
            life: 5000
          });
        }
      });
    }
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

  abrirModalEmail(): void {
    // Pega o email atual do formulário principal
    const emailAtual = this.dadosForm.get('email')?.value;

    // Preenche o formulário de email com o email atual
    this.emailForm.patchValue({
      emailAtual: emailAtual
    });

    this.displayEmailModal = true;
  }

  abrirModalSenha(): void {
    this.senhaForm.reset();
    console.log('senha form', this.senhaForm);
    this.displaySenhaModal = true;
  }

  fecharModalSenha(): void {
    this.displaySenhaModal = false;
    this.senhaForm.reset();
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

      this.userServiceTrocaEmail.solicitarTrocaEmail(emailAtual, senhaAtual, novoEmail).subscribe({
        next: () => {
          this.displayEmailModal = false;
          this.displayCodigoModal = true;
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

  fecharModalCodigo(): void {
    this.displayCodigoModal = false;
    this.codigo = '';
    this.erro = '';
    this.sucesso = '';
  }

  confirmarCodigo(): void {
    if (!this.codigo || this.codigo.length !== 6) {
      this.erro = 'Por favor, insira o código de verificação completo.';
      return;
    }

    this.userServiceTrocaEmail.confirmarTrocaEmail(this.codigo).subscribe({
      next: (response: { mensagem: string }) => {
        this.codigo = '';
        this.emailForm.reset();
        this.codigoEnviado = false;
        this.displayCodigoModal = false;
        window.location.reload();

        // Mostra mensagem de sucesso usando Toast
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Seu e-mail foi alterado com sucesso!',
          life: 5000
        });
      },
      error: (error: any) => {
        this.erro = error.error?.mensagem || 'Erro ao confirmar código. Tente novamente.';
      }
    });
  }

  alterarSenha(): void {
    this.senhaForm.updateValueAndValidity();

    const senhaAtual = this.senhaForm.get('senhaAtual')?.value;
    const novaSenha = this.senhaForm.get('novaSenha')?.value;
    const confirmarNovaSenha = this.senhaForm.get('confirmarNovaSenha')?.value;

    console.log('Senha atual:', senhaAtual);
    console.log('Nova senha:', novaSenha);
    console.log('Confirmar nova senha:', confirmarNovaSenha);

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos.',
        life: 5000
      });
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'As senhas não coincidem.',
        life: 5000
      });
      return;
    }

    if (novaSenha.length < 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A nova senha deve ter no mínimo 6 caracteres.',
        life: 5000
      });
      return;
    }

    // const dadosSenha = {
    //   senhaAtual: senhaAtual,
    //   novaSenha: novaSenha,
    //   confirmarNovaSenha: confirmarNovaSenha
    // };

    this.userServiceTrocaEmail.trocarSenha(senhaAtual, novaSenha, confirmarNovaSenha).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Senha alterada com sucesso!',
          life: 5000
        });
        this.fecharModalSenha();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.mensagem || 'Erro ao alterar senha. Tente novamente.',
          life: 5000
        });
      }
    });
  }

  camposSenhaPreenchidos(): boolean {
    const senhaAtual = this.senhaForm.get('senhaAtual')?.value;
    const novaSenha = this.senhaForm.get('novaSenha')?.value;
    const confirmarNovaSenha = this.senhaForm.get('confirmarNovaSenha')?.value;

    return !!senhaAtual && !!novaSenha && !!confirmarNovaSenha && novaSenha.length >= 6;
  }

  excluirConta(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'ID do usuário não encontrado',
        life: 5000
      });
      return;
    }

    this.userServiceTrocaEmail.deleteUser(userId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Conta excluída',
          detail: 'Sua conta foi excluída com sucesso.',
          life: 5000
        });
        // Logout após exclusão
        setTimeout(() => {
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 2000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir conta. Tente novamente.',
          life: 5000
        });
        console.error(error);
      }
    });
  }

}
