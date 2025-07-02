import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isLoggedIn = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkLoginStatus();
    }

    // Observar mudanças no estado do usuário
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.loadUserProfile();
      } else {
        this.userProfile = null;
      }
    });
  }

  getPrimeiroNome(): string {
    if (!this.userProfile?.nome) return '';
    return this.userProfile.nome.split(' ')[0];
  }

  private checkLoginStatus() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      this.isLoggedIn = true;
      this.loadUserProfile();
    } else {
      this.isLoggedIn = false;
      this.userProfile = null;
    }
  }

  private loadUserProfile() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.log('Usuário não está autenticado');
      this.userProfile = null;
      this.isLoggedIn = false;
      return;
    }

    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoggedIn = true;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.userProfile = null;
        this.isLoggedIn = false;
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.userProfile = null;
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
