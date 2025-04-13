import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'KaBum!';

  constructor(private themeService: ThemeService) {
    // O serviço já está configurado para lidar com mudanças de rota
    // e definir o background adequadamente
  }
}
