import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, ProgressSpinnerModule],
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.scss']
})
export class MeusPedidosComponent implements OnInit {
  pedidos: any[] = [];
  faceFrown = faFaceFrown;
  carregando = true;

  constructor(private pedidoService: PedidoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      console.warn('Usuário não está logado.');
      this.carregando = false;
      return;
    }
    this.pedidoService.getPedidos(userId).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
        this.cdr.detectChanges();

        console.log('Pedidos carregados:', pedidos);
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro ao carregar pedidos:', err);
      }
    });
  }

}
