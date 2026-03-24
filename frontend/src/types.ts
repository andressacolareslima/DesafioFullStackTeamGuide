export interface Vaga {
  id: number;
  titulo: string;
  area: string;
  tipo?: string;
  status?: string;
}

export interface Candidatura {
  id: number;
  nomeCandidato: string;
  emailCandidato: string;
  vagaId: number;
  status: string;
  vaga_titulo?: string;
  tituloVaga?: string;
  vaga?: {
    titulo: string;
  };
}
