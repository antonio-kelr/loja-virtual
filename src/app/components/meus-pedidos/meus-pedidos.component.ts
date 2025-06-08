import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.scss']
})
export class MeusPedidosComponent implements OnInit {
  pedidos: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Aqui será implementada a lógica para carregar os pedidos
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    // Implementar lógica para carregar pedidos do usuário
    console.log('Carregando pedidos...');
  }
}
