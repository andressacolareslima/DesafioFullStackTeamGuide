import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, InputAdornment, Box, Container, IconButton, makeStyles, Fade } from '@material-ui/core';
import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import VagaCard from '../components/VagaCard';
import Loading from '../components/Loading'; 
import api from '../services/api';

const useStyles = makeStyles(() => ({
  pagination: {
    '& .MuiPaginationItem-root': { borderRadius: '8px', border: '1px solid #B2EBF2', color: '#00ACC1', fontWeight: 'bold' },
    '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: '#E0F2F1', color: '#00ACC1', border: '1px solid #00ACC1' }
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 30, backgroundColor: '#F5F5F5', transition: '0.3s',
      '&.Mui-focused': { backgroundColor: '#FFF', boxShadow: '0px 4px 15px rgba(0, 172, 193, 0.1)' }
    }
  },
  // ESTE É O CONTAINER QUE FLUTUA SEM BORDA QUADRADA
  cardAnimado: {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
    }
  }
}));

const Home = ({ setAlerta }) => {
  const classes = useStyles();
  const [vagas, setVagas] = useState([]);
  const [vagasFiltradas, setVagasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setLoading(true);
    api.get('/vagas?size=100')
      .then(res => {
        const dados = res.data.content || res.data || [];
        setVagas(dados);
        setVagasFiltradas(dados);
      })
      .finally(() => setTimeout(() => setLoading(false), 1500));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtradas = vagas.filter(v => 
        v.titulo.toLowerCase().includes(busca.toLowerCase()) || v.area.toLowerCase().includes(busca.toLowerCase())
      );
      setVagasFiltradas(filtradas);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [busca, vagas]);

  const handlePageChange = (event, value) => {
    setLoading(true);
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setLoading(false), 1000);
  };

  const totalPages = Math.ceil(vagasFiltradas.length / itemsPerPage) || 1;
  const vagasExibidas = vagasFiltradas.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) return <Loading />;

  return (
    <Fade in={!loading} timeout={1000}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <TextField className={classes.searchField} fullWidth variant="outlined" placeholder="Pesquisar vaga..." 
          value={busca} onChange={(e) => setBusca(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon style={{ color: '#00ACC1' }} /></InputAdornment>,
            endAdornment: busca && <InputAdornment position="end"><IconButton onClick={() => setBusca('')} size="small"><CloseIcon /></IconButton></InputAdornment>,
          }}
          style={{ marginBottom: 60 }}
        />
        <Box mb={5}><Typography variant="h3" style={{ fontWeight: 900, color: '#004D40' }}>Oportunidades</Typography></Box>
        
        <Grid container spacing={3}>
          {vagasExibidas.map(v => (
            <Grid item xs={12} key={v.id} className={classes.cardAnimado}>
               <VagaCard vaga={v} setAlerta={setAlerta} />
            </Grid>
          ))}
        </Grid>

        <Box mt={10} display="flex" justifyContent="center">
          <Pagination className={classes.pagination} count={totalPages} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
        </Box>
      </Container>
    </Fade>
  );
};
export default Home;