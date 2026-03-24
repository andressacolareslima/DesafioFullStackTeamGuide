import React from 'react';
import { Paper, Typography, Button, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  cardRoot: {
    borderRadius: '35px',
    padding: '25px 40px',
    border: '1px solid #E0F2F1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.03)',
    transition: '0.3s',
    '&:hover': {
      borderColor: '#00ACC1',
      boxShadow: '0px 10px 25px rgba(0, 172, 193, 0.12)',
    }
  },
  btnCandidatar: {
    backgroundColor: '#00ACC1',
    color: 'white',
    borderRadius: '25px',
    padding: '8px 30px',
    fontWeight: 900,
    textTransform: 'none',
    boxShadow: '0px 4px 12px rgba(0, 172, 193, 0.3)',
    '&:hover': {
      backgroundColor: '#00838F',
    }
  }
}));

const VagaCard = ({ vaga, setAlerta }) => {
  const classes = useStyles();

  // FUNÇÃO QUE DISPARA O ALERTA
  const handleCandidatar = () => {
    if (setAlerta) {
      setAlerta({ 
        open: true, 
        msg: `Sucesso! Sua candidatura para ${vaga.titulo} foi enviada.`, 
        severity: 'success' 
      });
    }
  };

  return (
    <Paper className={classes.cardRoot} elevation={0}>
      <Box>
        <Typography variant="h5" style={{ fontWeight: 900, color: '#004D40' }}>
          {vaga.titulo}
        </Typography>
        <Typography variant="body1" style={{ color: '#00ACC1', fontWeight: 700, marginTop: 5 }}>
          {vaga.area} • {vaga.tipo || vaga.nivel}
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        className={classes.btnCandidatar}
        onClick={handleCandidatar} // O CLIQUE AQUI TINHA QUE FUNCIONAR
      >
        Candidatar-se
      </Button>
    </Paper>
  );
};

export default VagaCard;