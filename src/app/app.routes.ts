import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CelularesComponent } from './components/celulares/celulares.component';
import { PagamentoComponent } from './components/pagamento/pagamento.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ProdutoDetalhesComponent } from './components/produto-detalhes/produto-detalhes.component';
import { ConfirmacaoComponent } from './components/confirmacao/confirmacao.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { LoginComponent } from './components/login/login.component';
import { CompleteRegistrationComponent } from './components/complete-registration/complete-registration.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { ConcluirComponent } from './components/concluir/concluir.component';
import { MinhaContaComponent } from './components/minha-conta/minha-conta.component';
import { MeusPedidosComponent } from './components/meus-pedidos/meus-pedidos.component';
import { MeusDadosComponent } from './components/meus-dados/meus-dados.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'celulares', component: CelularesComponent },
  { path: 'pagamento', component: PagamentoComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'forma-pagamento', component: PagamentoComponent },
  { path: 'produto/:slug', component: ProdutoDetalhesComponent },
  { path: 'confirmacao', component: ConfirmacaoComponent },
  { path: 'concluir', component: ConcluirComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'minha-conta',
    component: MinhaContaComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'meus-dados', component: MeusDadosComponent },
      { path: 'meus-pedidos', component: MeusPedidosComponent }
    ]
  },
  {
    path: 'complete-registration',
    component: CompleteRegistrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'painel-administrativo',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      // Aqui serão adicionadas as rotas filhas do painel administrativo
    ]
  }
];

