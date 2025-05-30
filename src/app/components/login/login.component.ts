import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from "../nav/nav.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent, NavComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async loginComGoogle() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      const user = await this.authService.loginWithGoogle();
      console.log('Dados do usuário Google:', {
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        uid: user.uid
      });
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      this.errorMessage = 'Erro ao fazer login com Google. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        this.isLoading = true;
        this.errorMessage = '';
        const { email, senha } = this.loginForm.value;
        await this.authService.loginWithEmailAndPassword(email, senha);
      } catch (error: any) {
        console.error('Erro ao fazer login:', error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          this.errorMessage = 'E-mail ou senha inválidos.';
        } else {
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
