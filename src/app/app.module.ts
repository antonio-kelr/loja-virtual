import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompleteRegistrationComponent } from './components/complete-registration/complete-registration.component';
import { UsuarioAdminComponent } from './components/admin/usuarioAdmin/usuario-admin.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    AppComponent,
  ],
  providers: []
})
export class AppModule { }
