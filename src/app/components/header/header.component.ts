import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart,faHeart } from '@fortawesome/free-solid-svg-icons';
import { CarrosselCorDinamicaComponent } from "../carrossel-cor-dinamica/carrossel-cor-dinamica.component";
import { MegaMenuComponent } from "../mega-menu/mega-menu.component";

@Component({
  selector: 'app-header',
  imports: [ButtonModule, MenubarModule, DialogModule, InputTextModule, FontAwesomeModule, CarrosselCorDinamicaComponent, MegaMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  faShoppingCart = faShoppingCart
  faHeart = faHeart



}
