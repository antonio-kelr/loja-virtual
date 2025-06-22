export interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagens?: { url: string, nome:string }[];
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Carrinho {
  itens: ItemCarrinho[];
  total: number;
  metodoPagamento?: string;
}
