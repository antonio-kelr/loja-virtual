import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CelularesComponent } from './components/celulares/celulares.component';
import { CheckoutComponent } from './components/purchase/checkout.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ProdutoDetalhesComponent } from './components/produto-detalhes/produto-detalhes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'celulares', component: CelularesComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'produto/:id', component: ProdutoDetalhesComponent },
];

