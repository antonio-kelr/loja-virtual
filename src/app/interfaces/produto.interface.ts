export interface Produto {
  id: number;
  nome: string;
  slug?: string;
  descricao?: string;
  preco: number;
  precoAntigo: number;
  categoriaId: number;
  categoria?: Categoria;
  imagens?: ProdutoImagem[];
}

export interface Categoria {
  id: number;
  nome: string;
  // Adicione outros campos da categoria se houver
}

export interface ProdutoImagem {
  id: number;
  url: string;
  titulo: string;
  ordem: number;
  produtoId: number;
  // Adicione outros campos da imagem se houver
}
