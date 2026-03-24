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
  vaga?: Vaga;
  tituloVaga?: string;
}