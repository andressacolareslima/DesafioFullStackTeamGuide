import React, { useState } from 'react';
import { 
  Paper, Typography, Button, Box, makeStyles, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, withStyles, Slide 
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useMutation } from 'react-query';
import api from '../services/api';

// 1. Estilo Personalizado e Moderno para os Inputs (Clean)
const StyledTextField = withStyles({
  root: { 
    '& .MuiOutlinedInput-root': { 
      borderRadius: 15, 
      backgroundColor: '#F9FBFB', 
      transition: '0.3s',
      '& fieldset': { borderColor: 'rgba(0, 172, 193, 0.2)' },
      '&:hover fieldset': { borderColor: '#00ACC1' },
      '&.Mui-focused fieldset': { borderColor: '#00ACC1', borderWidth: 2 } 
    },
    '& .MuiInputLabel-outlined': { color: '#546E7A', fontWeight: 500 },
    '& .MuiInputLabel-outlined.Mui-focused': { color: '#00ACC1' }
  }
})(TextField);

// 2. Animação de Entrada Premium (Slide para Cima)
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// 3. Estilos Gerais e do Modal Moderno
const useStyles = makeStyles(() => ({
  cardRoot: {
    borderRadius: '35px',
    padding: '25px 40px',
    border: '1px solid #E0F2F1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: '20px',
    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { 
      transform: 'translateY(-8px)', 
      boxShadow: '0px 12px 30px rgba(0, 172, 193, 0.12)', 
      borderColor: '#00ACC1' 
    }
  },
  btnCandidatar: {
    backgroundColor: '#00ACC1',
    color: 'white',
    borderRadius: '25px',
    fontWeight: 900,
    padding: '12px 30px',
    textTransform: 'none',
    boxShadow: '0px 4px 12px rgba(0, 172, 193, 0.3)',
    '&:hover': { backgroundColor: '#00838F' },
    '&.Mui-disabled': { 
      backgroundColor: '#CFD8DC !important', 
      color: '#90A4AE !important',
      boxShadow: 'none'
    }
  },
  // ESTILO DO PAPEL DO MODAL (Premium)
  dialogPaper: {
    borderRadius: '35px !important', // Bordas grandes e suaves
    padding: '20px',
    boxShadow: '0px 20px 50px rgba(0, 77, 64, 0.15)', // Sombra profunda e leve
    overflow: 'hidden',
  },
  dialogTitle: {
    textAlign: 'center',
    paddingBottom: '0px',
    '& h2': { fontWeight: 900, color: '#004D40', fontSize: '1.6rem', letterSpacing: '-1px' }
  },
  // WRAPPER COM ESPAÇAMENTO ENTRE CAMPOS (Gap de 24px)
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px', 
    marginTop: '25px',
    marginBottom: '10px'
  },
  btnConfirmar: {
    backgroundColor: '#00ACC1',
    color: '#fff',
    borderRadius: 18,
    fontWeight: 900,
    padding: '10px 35px',
    textTransform: 'none',
    boxShadow: '0px 4px 15px rgba(0, 172, 193, 0.25)',
    '&:hover': { backgroundColor: '#0097A7', boxShadow: '0px 6px 20px rgba(0, 172, 193, 0.35)' }
  }
}));

interface VagaCardProps {
  vaga: { id: number; titulo: string; area: string; tipo?: string; status?: string; };
  setAlerta: (alerta: any) => void;
}

const VagaCard: React.FC<VagaCardProps> = ({ vaga, setAlerta }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nomeCandidato: '', emailCandidato: '' });

  // Normalização do Status (Aceita "Aberto" ou "Aberta")
  const statusLimpo = vaga.status?.toLowerCase().trim() || '';
  const podeCandidatar = statusLimpo === 'aberto' || statusLimpo === 'aberta';

  const mutation = useMutation(
    (dados: typeof form) => api.post('/candidaturas', { ...dados, vagaId: vaga.id }),
    {
      onSuccess: () => {
        setAlerta({ open: true, msg: `Candidatura enviada para ${vaga.titulo}! ✨`, severity: 'success' });
        setOpen(false);
        setForm({ nomeCandidato: '', emailCandidato: '' });
      },
      onError: () => setAlerta({ open: true, msg: 'Erro ao processar candidatura.', severity: 'error' })
    }
  );

  const handleConfirmar = () => {
    if (!form.nomeCandidato.trim() || !form.emailCandidato.trim()) {
      setAlerta({ open: true, msg: 'Preencha todos os campos.', severity: 'warning' });
      return;
    }
    mutation.mutate(form);
  };

  return (
    <>
      {/* CARD DA VAGA COM EFEITO HOVER */}
      <Paper className={classes.cardRoot} elevation={0} style={{ opacity: podeCandidatar ? 1 : 0.75 }}>
        <Box>
          <Typography variant="h5" style={{ fontWeight: 900, color: podeCandidatar ? '#004D40' : '#90A4AE' }}>
            {vaga.titulo}
          </Typography>
          <Typography variant="body1" style={{ color: podeCandidatar ? '#00ACC1' : '#B0BEC5', fontWeight: 700, marginTop: 5 }}>
            {vaga.area} • {vaga.tipo} {!podeCandidatar && `[${vaga.status}]`}
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          className={classes.btnCandidatar} 
          onClick={() => setOpen(true)}
          disabled={!podeCandidatar || mutation.isLoading}
        >
          {podeCandidatar ? 'Candidatar-se' : 'Inscrições Encerradas'}
        </Button>
      </Paper>

      {/* MODAL DE INSCRIÇÃO BONITO E MODERNO (RESTAURADO) */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        TransitionComponent={Transition} // Animação de slide
        classes={{ paper: classes.dialogPaper }} // Aplicando bordas de 35px e sombra profundas
        maxWidth="xs" 
        fullWidth
      >
        <DialogTitle className={classes.dialogTitle}>
          Candidatura: <span style={{color: '#00ACC1'}}>{vaga.titulo}</span>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" style={{ color: '#78909C', textAlign: 'center', fontWeight: 500, marginBottom: 10 }}>
            Conecte seu talento a esta oportunidade preenchendo os dados abaixo.
          </Typography>

          {/* BOX COM GAP DE 24PX ENTRE OS CAMPOS */}
          <Box className={classes.inputWrapper}>
            <StyledTextField 
              label="Nome Completo" 
              variant="outlined" 
              fullWidth 
              value={form.nomeCandidato}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, nomeCandidato: e.target.value})}
            />
            
            <StyledTextField 
              label="E-mail Acadêmico ou Pessoal" 
              variant="outlined" 
              type="email"
              fullWidth 
              value={form.emailCandidato}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, emailCandidato: e.target.value})}
            />
          </Box>
        </DialogContent>

        <DialogActions style={{ padding: '20px 30px', justifyContent: 'space-between', borderTop: '1px solid rgba(0, 172, 193, 0.1)' }}>
          <Button onClick={() => setOpen(false)} style={{ fontWeight: 700, color: '#90A4AE', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button 
            onClick= {handleConfirmar} 
            variant="contained" 
            className={classes.btnConfirmar}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Enviando...' : 'Confirmar Inscrição'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VagaCard;