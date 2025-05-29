import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-complete-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavComponent,
    FooterComponent
  ],
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Não precisamos mais verificar se o perfil está completo
    // pois o usuário sempre será redirecionado para cá após o login
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;
      this.error = null;

      this.userService.updateUserProfile(this.registrationForm.value).subscribe({
        next: () => {
          this.loading = false;
          // Redirecionar para a home após salvar com sucesso
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Erro ao atualizar perfil. Tente novamente.';
        }
      });
    }
  }
}
