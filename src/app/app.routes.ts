import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CelularesComponent } from './components/celulares/celulares.component';
import { PagamentoComponent } from './components/pagamento/pagamento.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ProdutoDetalhesComponent } from './components/produto-detalhes/produto-detalhes.component';
import { ConfirmacaoComponent } from './components/confirmacao/confirmacao.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'celulares', component: CelularesComponent },
  { path: 'pagamento', component: PagamentoComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'produto/:id', component: ProdutoDetalhesComponent },
  { path: 'confirmacao', component: ConfirmacaoComponent },
];

