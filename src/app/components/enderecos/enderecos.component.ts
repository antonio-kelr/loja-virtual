import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnderecoService } from '../../services/endereco.service';
import { Endereco } from '../../interfaces/endereco.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faLock } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-enderecos',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
  ],

  templateUrl: './enderecos.component.html',
  styleUrls: [
    './enderecos.component.scss',
    '../meus-dados/meus-dados.component.scss'
  ],
})
export class EnderecosComponent implements OnInit {
  enderecos: Endereco[] = [];
  carregando = true;
  erro: string | null = null;
  faMapMarkerAlt = faMapMarkerAlt;
  faLock = faLock;
  enderecoForm: any;
  mostrarFormulario = false;
  mostrarFormularioVolta = true;
  mostrarNovoEndereco = false;
  enderecoEditando: Endereco | null = null;

  constructor(private enderecoService: EnderecoService, private fb: FormBuilder,   private cdRef: ChangeDetectorRef) {
    this.enderecoForm = this.fb.group({
      identificacao: ['', Validators.required],
      cep: [{value: '', disabled: true}, [Validators.required, Validators.minLength(8)]],
      logradouro: [{value: '', disabled: true}, Validators.required],
      numero: [{value: '', disabled: true}, Validators.required],
      complemento: [''],
      referencia: [''],
      bairro: [{value: '', disabled: true}, Validators.required],
      tipoEndereco: [{value: '', disabled: true}],
      cidade: [{value: '', disabled: true}, Validators.required],
      estado: [{value: '', disabled: true}, [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.carregarEnderecos();
  }

  carregarEnderecos(): void {
    this.carregando = true;
    this.erro = null;

    this.enderecoService.listarEnderecos().subscribe({
      next: (enderecos) => {
        this.enderecos = enderecos;
        this.carregando = false;
        this.cdRef.detectChanges();

      },
      error: (error) => {
        this.erro = 'Erro ao carregar endereços. Por favor, tente novamente.';
        this.carregando = false;
      },
    });
  }

  editarEndereco(endereco: Endereco): void {
    console.log(endereco);
    this.enderecoEditando = endereco;
    this.enderecoForm.patchValue({
      identificacao: endereco.identificacao || '',
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento || '',
      referencia: endereco.referencia || '',
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      tipoEndereco: endereco.tipoEndereco || ''
    });
    this.mostrarFormulario = true;
    this.mostrarFormularioVolta = false;
    this.cdRef.detectChanges();
  }

  toggleNovoEndereco(): void {
    this.mostrarNovoEndereco = !this.mostrarNovoEndereco;
    this.mostrarFormularioVolta = !this.mostrarNovoEndereco;
    if (this.mostrarNovoEndereco) {
      this.limparFormulario();
    }
    this.cdRef.detectChanges();
  }

  limparFormulario(): void {
    this.enderecoForm.reset();
    // Habilitar os campos que estavam desabilitados
    this.enderecoForm.get('cep').enable();
    this.enderecoForm.get('logradouro').enable();
    this.enderecoForm.get('numero').enable();
    this.enderecoForm.get('bairro').enable();
    this.enderecoForm.get('cidade').enable();
    this.enderecoForm.get('estado').enable();
    this.enderecoForm.get('tipoEndereco').enable();
  }

  salvarEndereco(): void {
    if (this.enderecoForm.valid && this.enderecoEditando) {
      const enderecoAtualizado = {
        cep: this.enderecoForm.get('cep')?.value,
        logradouro: this.enderecoForm.get('logradouro')?.value,
        numero: this.enderecoForm.get('numero')?.value,
        bairro: this.enderecoForm.get('bairro')?.value,
        complemento: this.enderecoForm.get('complemento')?.value,
        referencia: this.enderecoForm.get('referencia')?.value,
        cidade: this.enderecoForm.get('cidade')?.value,
        estado: this.enderecoForm.get('estado')?.value,
        tipoEndereco: this.enderecoForm.get('tipoEndereco')?.value
      };

      console.log('Dados sendo enviados:', enderecoAtualizado);

      this.enderecoService.atualizarEndereco(this.enderecoEditando.id, enderecoAtualizado).subscribe({
        next: (endereco) => {
          console.log('Endereço atualizado com sucesso:', endereco);
          this.mostrarFormulario = false;
          this.mostrarFormularioVolta = true;
          this.enderecoEditando = null;
          this.carregarEnderecos();
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao atualizar endereço:', error);
          this.erro = 'Erro ao atualizar endereço. Por favor, tente novamente.';
        }
      });
    }
}
  salvarNovoEndereco(): void {
    if (this.enderecoForm.valid) {
      const novoEndereco = this.enderecoForm.value;
      this.enderecoService.criarEndereco(novoEndereco).subscribe({
        next: (endereco) => {
          console.log('Endereço criado com sucesso:', endereco);
          this.mostrarNovoEndereco = false;
          this.mostrarFormularioVolta = true;
          this.carregarEnderecos(); // Recarrega a lista de endereços
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao criar endereço:', error);
          this.erro = 'Erro ao criar endereço. Por favor, tente novamente.';
        }
      });
    } else {
      console.log('Formulário inválido');
      Object.keys(this.enderecoForm.controls).forEach(key => {
        const control = this.enderecoForm.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
    }
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarFormularioVolta = !this.mostrarFormularioVolta;
    this.cdRef.detectChanges();
  }

  toggleFormularioVolta(): void {
    this.mostrarFormularioVolta = !this.mostrarFormularioVolta;
    this.mostrarFormulario = !this.mostrarFormulario;
    this.cdRef.detectChanges();
  }
}
