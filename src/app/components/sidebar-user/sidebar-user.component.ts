import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.scss']
})
export class SidebarUserComponent {
  // Aqui você pode adicionar lógica adicional se necessário
}
