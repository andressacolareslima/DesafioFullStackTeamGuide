import React, { useState } from 'react';
import { 
  Typography, Container, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, makeStyles, Fade 
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useQuery } from 'react-query'; // Exigência técnica do edital
import api from '../services/api';
import Loading from '../components/Loading';
import { Candidatura } from '../types'; // Importando a interface global

const useStyles = makeStyles(() => ({
  tableContainer: { 
    borderRadius: '25px', 
    border: '1px solid #E0F2F1', 
    overflow: 'hidden',
    boxShadow: '0px 10px 30px rgba(0, 172, 193, 0.05)'
  },
  head: { 
    backgroundColor: '#E0F7FA' 
  },
  headerCell: {
    fontWeight: 900,
    color: '#004D40',
    fontSize: '1rem'
  },
  pagination: { 
    '& .MuiPaginationItem-root': { 
      borderRadius: '8px', 
      border: '1px solid #B2EBF2', 
      color: '#00ACC1', 
      fontWeight: 'bold' 
    } 
  }
}));

const Inscricoes: React.FC = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  // 1. BUSCA DE DADOS COM REACT QUERY
  const { data: inscricoes = [], isLoading } = useQuery<Candidatura[]>('candidaturas', async () => {
    const res = await api.get('/candidaturas');
    return res.data || [];
  }, {
    staleTime: 1000 * 60 * 2, // Cache de 2 minutos
  });

  // 2. LÓGICA DE PAGINAÇÃO (Client-side conforme o código original)
  const totalPages = Math.ceil(inscricoes.length / itemsPerPage) || 1;
  const exibidas = inscricoes.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <Loading />;

  return (
    <Fade in={!isLoading} timeout={1000}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Box mb={5}>
          <Typography variant="h3" style={{ fontWeight: 900, color: '#004D40' }}>
            Inscrições
          </Typography>
          <Typography variant="subtitle1" style={{ color: '#666' }}>
            Acompanhe os candidatos interessados nas vagas do TalentFlow.
          </Typography>
        </Box>

        <TableContainer component={Paper} className={classes.tableContainer} elevation={0}>
          <Table>
            <TableHead className={classes.head}>
              <TableRow>
                <TableCell className={classes.headerCell}>Candidato</TableCell>
                <TableCell className={classes.headerCell}>E-mail de Contato</TableCell>
                <TableCell className={classes.headerCell}>Vaga Desejada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exibidas.map((insc) => (
                <TableRow key={insc.id} hover>
                  <TableCell style={{ fontWeight: 600 }}>{insc.nomeCandidato}</TableCell>
                  <TableCell style={{ color: '#00ACC1', fontWeight: 500 }}>{insc.emailCandidato}</TableCell>
                  <TableCell style={{ fontWeight: 700, color: '#004D40' }}>
                    {insc.vaga?.titulo || insc.tituloVaga || 'Vaga Removida'}
                  </TableCell>
                </TableRow>
              ))}
              
              {inscricoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" style={{ padding: '40px' }}>
                    <Typography color="textSecondary">Nenhuma candidatura registrada ainda.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={10} display="flex" justifyContent="center">
          <Pagination 
            className={classes.pagination} 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            variant="outlined" 
            shape="rounded" 
          />
        </Box>
      </Container>
    </Fade>
  );
};

export default Inscricoes;