import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTwitter, faYoutube, faPix,  } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { faQrcode, faCreditCard, faBarcode } from '@fortawesome/free-solid-svg-icons'

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  faYoutube = faYoutube;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;
  faPix = faPix
  faCreditCard = faCreditCard
  faBarcode = faBarcode

  email: string = '';

  onSubmit() {
    if (this.email) {
      // Aqui você pode implementar a lógica para enviar o email
      console.log('Email cadastrado:', this.email);
      this.email = '';
    }
  }
}
