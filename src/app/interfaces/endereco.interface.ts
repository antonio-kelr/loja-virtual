export interface Endereco {
  id: number;
  identificacao?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  tipoEndereco?: string;
  referencia?: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
}
