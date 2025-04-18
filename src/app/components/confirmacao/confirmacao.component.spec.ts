import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ConfirmacaoComponent } from './confirmacao.component';

describe('ConfirmacaoComponent', () => {
  let component: ConfirmacaoComponent;
  let fixture: ComponentFixture<ConfirmacaoComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({
        metodoPagamento: 'pix',
        valor: '100'
      })
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmacaoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read query params on init', () => {
    expect(component.metodoPagamento).toBe('pix');
    expect(component.valorTotal).toBe(100);
  });

  it('should format payment method correctly', () => {
    component.metodoPagamento = 'pix';
    expect(component.getMetodoPagamentoFormatado()).toBe('PIX (10% de desconto)');

    component.metodoPagamento = 'cartao';
    expect(component.getMetodoPagamentoFormatado()).toBe('Cartão de Crédito');

    component.metodoPagamento = 'boleto';
    expect(component.getMetodoPagamentoFormatado()).toBe('Boleto Bancário');
  });

  it('should navigate to home page when clicking on "Continuar Comprando"', () => {
    component.voltarParaHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});