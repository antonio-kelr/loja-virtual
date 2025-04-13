import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
// import { FooterComponent } from '../footer/footer.component';
import { CarrosselCorDinamicaComponent } from "../carrossel-cor-dinamica/carrossel-cor-dinamica.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    // FooterComponent,
    CarrosselCorDinamicaComponent,
    FooterComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
