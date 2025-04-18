import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoCarrinhoComponent } from './resumo-carrinho.component';

describe('ResumoCarrinhoComponent', () => {
  let component: ResumoCarrinhoComponent;
  let fixture: ComponentFixture<ResumoCarrinhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumoCarrinhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumoCarrinhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
