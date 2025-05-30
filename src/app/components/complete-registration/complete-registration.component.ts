import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { UserProfile } from '../../models/user-profile.model';

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
export class CompleteRegistrationComponent {
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
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/)]]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;
      this.error = null;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.error = 'ID do usuário não encontrado';
        this.loading = false;
        return;
      }

      // Primeiro, buscar o usuário completo
      this.userService.getUserProfile().subscribe({
        next: (userProfile) => {
          // Atualizar apenas os campos do formulário
          const updatedProfile: UserProfile = {
            ...userProfile, // Mantém todos os dados existentes
            cpf: this.registrationForm.get('cpf')?.value,
            dataNascimento: this.registrationForm.get('dataNascimento')?.value,
            genero: this.registrationForm.get('genero')?.value,
            telefone: this.registrationForm.get('telefone')?.value
          };

          // Enviar a atualização
          this.userService.updateUserProfile(updatedProfile).subscribe({
            next: () => {
              this.loading = false;
              this.router.navigate(['/']);
            },
            error: (err) => {
              this.loading = false;
              this.error = err.error?.message || 'Erro ao atualizar perfil. Tente novamente.';
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erro ao carregar dados do usuário. Tente novamente.';
        }
      });
    }
  }
}
