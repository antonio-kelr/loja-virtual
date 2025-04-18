import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoCompraComponent } from './processo-compra.component';

describe('ProcessoCompraComponent', () => {
  let component: ProcessoCompraComponent;
  let fixture: ComponentFixture<ProcessoCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessoCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
