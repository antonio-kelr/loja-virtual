import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosselCorDinamicaComponent } from './carrossel-cor-dinamica.component';

describe('CarrosselCorDinamicaComponent', () => {
  let component: CarrosselCorDinamicaComponent;
  let fixture: ComponentFixture<CarrosselCorDinamicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrosselCorDinamicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrosselCorDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
