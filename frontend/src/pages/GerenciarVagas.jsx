import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Button, Card, IconButton, Container, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, makeStyles, withStyles, Grid, Fade 
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import api from '../services/api';
import Loading from '../components/Loading';

const StyledTextField = withStyles({
  root: { '& .MuiOutlinedInput-root': { borderRadius: 15, backgroundColor: '#F9FBFB', '&:hover fieldset': { borderColor: '#00ACC1' }, '&.Mui-focused fieldset': { borderColor: '#00ACC1', borderWidth: 2 } } }
})(TextField);

const useStyles = makeStyles(() => ({
  cardAdmin: { 
    marginBottom: 20, borderRadius: '35px', padding: '25px 40px', border: '1px solid #E0F2F1', 
    backgroundColor: '#FFFFFF', transition: '0.3s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0px 12px 30px rgba(0, 172, 193, 0.15)', borderColor: '#00ACC1' }
  },
  btnAnunciar: { 
    backgroundColor: '#00ACC1', color: 'white', borderRadius: 25, fontWeight: 900, padding: '12px 30px', 
    textTransform: 'none', boxShadow: '0px 4px 12px rgba(0, 172, 193, 0.3)',
    '&:hover': { backgroundColor: '#00838F' }
  },
  pagination: { '& .MuiPaginationItem-root': { borderRadius: '8px', border: '1px solid #B2EBF2', color: '#00ACC1', fontWeight: 'bold' } }
}));

const GerenciarVagas = ({ setAlerta }) => {
  const classes = useStyles();
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [editMode, setEditMode] = useState(false); // Faltava o controle do modo edição
  const [form, setForm] = useState({ titulo: '', area: '', tipo: 'Estágio', status: 'Aberta' });

  const carregarVagas = async () => {
    setLoading(true);
    api.get(`/vagas?page=${page - 1}&size=5&sort=id,desc`)
      .then(res => { setVagas(res.data.content || []); setTotalPages(res.data.totalPages || 1); })
      .finally(() => setTimeout(() => setLoading(false), 1500));
  };

  useEffect(() => { carregarVagas(); }, [page]);

  const handlePageChange = (event, value) => {
    setLoading(true);
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setLoading(false), 1000);
  };

  const handleAbrirAnunciar = () => {
    setEditMode(false);
    setForm({ titulo: '', area: '', tipo: 'Estágio', status: 'Aberta' });
    setOpenForm(true); // O CLIQUE AQUI TINHA QUE FUNCIONAR
  };

  const handleSalvar = () => {
    if (!form.titulo.trim() || !form.area.trim()) return;
    const request = editMode ? api.put(`/vagas/${vagaSelecionada.id}`, form) : api.post('/vagas', form);
    
    request.then(() => {
      setAlerta({ open: true, msg: 'Vaga salva com sucesso!', severity: 'success' });
      setOpenForm(false);
      carregarVagas();
    }).catch(() => setAlerta({ open: true, msg: 'Erro ao salvar vaga', severity: 'error' }));
  };

  if (loading) return <Loading />;

  return (
    <Fade in={!loading} timeout={1000}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Typography variant="h3" style={{ fontWeight: 900, color: '#004D40' }}>Gestão de Vagas</Typography>
          <Button 
            variant="contained" 
            className={classes.btnAnunciar} 
            startIcon={<AddIcon />} 
            onClick={handleAbrirAnunciar} // CONECTADO AQUI
          >
            ANUNCIAR VAGA
          </Button>
        </Box>

        {vagas.map(v => (
          <Card key={v.id} className={classes.cardAdmin} elevation={0}>
            <Box>
              <Typography variant="h5" style={{ fontWeight: 900, color: '#004D40' }}>{v.titulo}</Typography>
              <Typography variant="body1" style={{ color: '#00ACC1', fontWeight: 700, marginTop: 5 }}>{v.area} • {v.tipo}</Typography>
            </Box>
            <Box>
              <IconButton onClick={() => { setEditMode(true); setVagaSelecionada(v); setForm(v); setOpenForm(true); }} color="primary"><EditIcon /></IconButton>
              <IconButton onClick={() => { setVagaSelecionada(v); setOpenDelete(true); }} style={{ color: '#d32f2f' }}><DeleteIcon /></IconButton>
            </Box>
          </Card>
        ))}

        {/* ... (Os Dialogs de formulário devem estar aqui dentro do return) ... */}
        {/* CERTIFIQUE-SE DE QUE O DIALOG OPEN={OPENFORM} ESTEJA ABAIXO */}
        <Dialog open={openForm} onClose={() => setOpenForm(false)} PaperProps={{ style: { borderRadius: 25 } }} maxWidth="xs" fullWidth>
           <DialogTitle><Typography variant="h5" style={{fontWeight: 900, textAlign: 'center'}}>{editMode ? 'Editar Vaga' : 'Nova Vaga'}</Typography></DialogTitle>
           <DialogContent>
              <Grid container spacing={2}>
                 <Grid item xs={12}><StyledTextField fullWidth label="Título" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} /></Grid>
                 <Grid item xs={12}><StyledTextField fullWidth label="Área" value={form.area} onChange={e => setForm({...form, area: e.target.value})} /></Grid>
              </Grid>
           </DialogContent>
           <DialogActions style={{padding: 20}}>
              <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
              <Button onClick={handleSalvar} variant="contained" style={{backgroundColor: '#00ACC1', color: '#fff'}}>Salvar</Button>
           </DialogActions>
        </Dialog>
      </Container>
    </Fade>
  );
};

export default GerenciarVagas;