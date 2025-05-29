import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteRegistrationComponent } from './components/complete-registration/complete-registration.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // ... outras rotas ...
  {
    path: 'complete-registration',
    component: CompleteRegistrationComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
