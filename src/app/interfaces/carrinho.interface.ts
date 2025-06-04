import { Produto } from './produto.interface';

export interface ItemCarrinho {
  id: number;
  carrinhoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  statusItem: string;
  carrinho: any | null;
  produto: Produto;
}

export interface Carrinho {
  id: number;
  userId: number;
  dataCriacao: string;
  dataFinalizacao: string | null;
  total: number;
  ativo: boolean;
  user: any | null;
  itens: ItemCarrinho[];
}
