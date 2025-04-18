import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-processo-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './processo-compra.component.html',
  styleUrls: ['./processo-compra.component.scss']
})
export class ProcessoCompraComponent {
  @Input() etapaAtual: number = 1;
}
