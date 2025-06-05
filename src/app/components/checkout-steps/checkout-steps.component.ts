import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-steps.component.html',
  styleUrls: ['./checkout-steps.component.scss']
})
export class CheckoutStepsComponent {
  @Input() etapaAtual: number = 1;
}
