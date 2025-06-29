export interface Cliente {
  id?: number;
  nome: string;
  nomeSocial?: string;
  email?: string;
  endereco?: Endereco;
  telefones: Telefone[];
  pets: Pet[];
}

export interface Endereco {
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  informacoesAdicionais?: string;
}

export interface Telefone {
  ddd: string;
  numero: string;
}

export interface Pet {
  id?: number;
  nome: string;
  tipo: string;
  raca: string;
  genero: string;
  clienteId?: number;
}

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
}

export interface Servico {
  id?: number;
  nome: string;
  preco: number;
}

export interface Consumo {
  id?: number;
  clienteId: number;
  produtoId?: number;
  servicoId?: number;
  quantidade: number;
  data: string;
  valorTotal: number;
}
