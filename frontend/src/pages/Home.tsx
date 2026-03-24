import React, { useState, useMemo } from 'react';
import { 
  Grid, Typography, TextField, InputAdornment, Box, 
  Container, IconButton, makeStyles, Fade 
} from '@material-ui/core';
import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { useQuery } from 'react-query'; // Exigência do edital
import VagaCard from '../components/VagaCard';
import Loading from '../components/Loading'; 
import api from '../services/api';
import { Vaga } from '../types'; // Importando a interface global

const useStyles = makeStyles(() => ({
  pagination: {
    '& .MuiPaginationItem-root': { 
      borderRadius: '8px', 
      border: '1px solid #B2EBF2', 
      color: '#00ACC1', 
      fontWeight: 'bold' 
    },
    '& .MuiPaginationItem-page.Mui-selected': { 
      backgroundColor: '#E0F2F1', 
      color: '#00ACC1', 
      border: '1px solid #00ACC1' 
    }
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 30, 
      backgroundColor: '#F5F5F5', 
      transition: '0.3s',
      '&.Mui-focused': { 
        backgroundColor: '#FFF', 
        boxShadow: '0px 4px 15px rgba(0, 172, 193, 0.1)' 
      }
    }
  },
  cardAnimado: {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
    }
  }
}));

interface HomeProps {
  setAlerta: (alerta: any) => void;
}

const Home: React.FC<HomeProps> = ({ setAlerta }) => {
  const classes = useStyles();
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // 1. BUSCA DE DADOS COM REACT QUERY (Motor do Edital)
  const { data: vagas = [], isLoading } = useQuery<Vaga[]>('vagasHome', async () => {
    const res = await api.get('/vagas?size=100');
    // Ajuste conforme a estrutura do seu backend (res.data ou res.data.content)
    return res.data.content || res.data || [];
  }, {
    staleTime: 1000 * 60 * 5, // Mantém os dados no cache por 5 minutos
  });

  // 2. FILTRO INTELIGENTE COM useMemo (Performance de Engenharia)
  const vagasFiltradas = useMemo(() => {
    return vagas.filter(v => 
      v.titulo.toLowerCase().includes(busca.toLowerCase()) || 
      v.area.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, vagas]);

  // 3. PAGINAÇÃO
  const totalPages = Math.ceil(vagasFiltradas.length / itemsPerPage) || 1;
  const vagasExibidas = vagasFiltradas.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <Loading />;

  return (
    <Fade in={!isLoading} timeout={1000}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        {/* BARRA DE PESQUISA */}
        <TextField 
          className={classes.searchField} 
          fullWidth 
          variant="outlined" 
          placeholder="Pesquisar cargo, tecnologia ou área..." 
          value={busca} 
          onChange={(e) => { setBusca(e.target.value); setPage(1); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#00ACC1' }} />
              </InputAdornment>
            ),
            endAdornment: busca && (
              <InputAdornment position="end">
                <IconButton onClick={() => setBusca('')} size="small">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{ marginBottom: 60 }}
        />

        <Box mb={5}>
          <Typography variant="h3" style={{ fontWeight: 900, color: '#004D40' }}>
            Oportunidades
          </Typography>
          <Typography variant="subtitle1" style={{ color: '#666' }}>
            Explore {vagasFiltradas.length} vagas disponíveis para você.
          </Typography>
        </Box>
        
        {/* LISTA DE CARDS */}
        <Grid container spacing={3}>
          {vagasExibidas.map(v => (
            <Grid item xs={12} key={v.id} className={classes.cardAnimado}>
               <VagaCard vaga={v} setAlerta={setAlerta} />
            </Grid>
          ))}
          
          {vagasFiltradas.length === 0 && (
            <Box width="100%" textAlign="center" py={10}>
              <Typography variant="h6" color="textSecondary">
                Nenhuma vaga encontrada para "{busca}"
              </Typography>
            </Box>
          )}
        </Grid>

        {/* PAGINAÇÃO */}
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

export default Home;