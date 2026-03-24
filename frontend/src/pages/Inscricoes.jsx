import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles, Fade } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import api from '../services/api';
import Loading from '../components/Loading';

const useStyles = makeStyles(() => ({
  tableContainer: { borderRadius: '25px', border: '1px solid #E0F2F1', overflow: 'hidden' },
  head: { backgroundColor: '#E0F7FA' },
  pagination: { '& .MuiPaginationItem-root': { borderRadius: '8px', border: '1px solid #B2EBF2', color: '#00ACC1', fontWeight: 'bold' } }
}));

const Inscricoes = () => {
  const classes = useStyles();
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    setLoading(true);
    api.get('/candidaturas')
      .then(res => setInscricoes(res.data || []))
      .finally(() => setTimeout(() => setLoading(false), 1200));
  }, []);

  const handlePageChange = (event, value) => {
    setLoading(true);
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setLoading(false), 1000);
  };

  const totalPages = Math.ceil(inscricoes.length / itemsPerPage) || 1;
  const exibidas = inscricoes.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) return <Loading />;

  return (
    <Fade in={!loading} timeout={800}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 50 }}>
        <Typography variant="h3" style={{ fontWeight: 900, color: '#004D40', marginBottom: 40 }}>Inscrições</Typography>
        <TableContainer component={Paper} className={classes.tableContainer} elevation={0}>
          <Table>
            <TableHead className={classes.head}>
              <TableRow><TableCell style={{ fontWeight: 900 }}>Candidato</TableCell><TableCell style={{ fontWeight: 900 }}>E-mail</TableCell><TableCell style={{ fontWeight: 900 }}>Vaga</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {exibidas.map(insc => (
                <TableRow key={insc.id}><TableCell>{insc.nomeCandidato}</TableCell><TableCell style={{ color: '#00ACC1' }}>{insc.emailCandidato}</TableCell><TableCell style={{ fontWeight: 700 }}>{insc.vaga?.titulo || 'Vaga Removida'}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={10} display="flex" justifyContent="center"><Pagination className={classes.pagination} count={totalPages} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" /></Box>
      </Container>
    </Fade>
  );
};
export default Inscricoes;