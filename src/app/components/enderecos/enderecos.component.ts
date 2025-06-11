import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnderecoService } from '../../services/endereco.service';
import { Endereco } from '../../interfaces/endereco.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
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
  enderecoForm: any;

  constructor(private enderecoService: EnderecoService, private fb: FormBuilder) {
    this.enderecoForm = this.fb.group({
      identificacao: ['', Validators.required],
      cep: ['', [Validators.required, Validators.minLength(8)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      referencia: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.minLength(2)]],
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
        if (enderecos.length > 0) {
          // Pega o primeiro endereço e preenche o formulário
          console.log(enderecos);

          const endereco = enderecos[0];
          this.enderecoForm.patchValue({
            identificacao: endereco.identificacao || '',
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento || '',
            referencia: endereco.referencia || '',
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado
          });
        }
        this.carregando = false;
      },
      error: (error) => {
        this.erro = 'Erro ao carregar endereços. Por favor, tente novamente.';
        this.carregando = false;
      },
    });
  }
}
