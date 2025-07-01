import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.scss']
})
export class MeusPedidosComponent implements OnInit {
  pedidos: any[] = [];
  faceFrown = faFaceFrown;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      console.warn('Usuário não está logado.');
      return;
    }
    this.pedidoService.getPedidos(userId).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        console.log('Pedidos carregados:', pedidos);
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
      }
    });
  }

}
