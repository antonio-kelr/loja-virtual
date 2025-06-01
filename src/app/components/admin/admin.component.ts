import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faBox,
  faTags,
  faShoppingCart,
  faUsers,
  faChartBar,
  faCog
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // Ícones do FontAwesome
  faHome = faHome;
  faBox = faBox;
  faTags = faTags;
  faShoppingCart = faShoppingCart;
  faUsers = faUsers;
  faChartBar = faChartBar;
  faCog = faCog;

  constructor() {}
}