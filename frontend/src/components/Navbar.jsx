import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, makeStyles, Container } from '@material-ui/core';
import { 
  TrendingUp as FlowIcon, 
  WorkOutline as VagasIcon, 
  SettingsOutlined as GearIcon, 
  PeopleOutline as PeopleIcon 
} from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  navbar: {
    backgroundColor: '#B2EBF2', // A COR VOLTOU! Azul ciano da marca
    color: '#006064',
    padding: '10px 0',
    borderRadius: '0 0 50px 50px', // Bordas arredondadas imponentes
    boxShadow: '0px 4px 20px rgba(0, 172, 193, 0.1)',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': { transform: 'scale(1.05)' }
  },
  navButton: {
    borderRadius: '25px',
    textTransform: 'none',
    fontWeight: 900,
    fontSize: '0.95rem',
    marginLeft: '12px',
    padding: '10px 22px',
    color: '#004D40', // Verde escuro para contraste no azul claro
    transition: '0.3s all cubic-bezier(0.4, 0, 0.2, 1)',
    '& .MuiButton-startIcon': {
      transition: '0.3s transform ease',
      color: '#00ACC1'
    },
    '&:hover': {
      backgroundColor: '#FFFFFF', // Fica branco no hover para destacar
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.05)',
      transform: 'translateY(-3px)',
      '& .MuiButton-startIcon': {
        transform: 'scale(1.2) rotate(-8deg)', // Ícone cresce e inclina
      }
    }
  },
  activeButton: {
    backgroundColor: '#00ACC1',
    color: '#FFF !important',
    boxShadow: '0 6px 15px rgba(0, 172, 193, 0.3)',
    '& .MuiButton-startIcon': {
      color: '#FFF !important'
    },
    '&:hover': {
      backgroundColor: '#0097A7',
    }
  }
}));

const Navbar = ({ view, setView }) => {
  const classes = useStyles();

  return (
    <AppBar position="sticky" className={classes.navbar} elevation={0}>
      <Container maxWidth="lg">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          
          <Box className={classes.logo} onClick={() => setView('vagas')}>
            <FlowIcon style={{ fontSize: 36, color: '#00ACC1' }} />
            <Typography variant="h4" style={{ fontWeight: 900, color: '#004D40', letterSpacing: '-1.5px' }}>
              Talent<span style={{ color: '#00ACC1' }}>Flow</span>
            </Typography>
          </Box>

          <Box display="flex">
            <Button 
              className={`${classes.navButton} ${view === 'vagas' ? classes.activeButton : ''}`}
              onClick={() => setView('vagas')}
              startIcon={<VagasIcon />}
            >
              Vagas
            </Button>
            <Button 
              className={`${classes.navButton} ${view === 'gerenciar' ? classes.activeButton : ''}`}
              onClick={() => setView('gerenciar')}
              startIcon={<GearIcon />}
            >
              Gerenciar
            </Button>
            <Button 
              className={`${classes.navButton} ${view === 'inscricoes' ? classes.activeButton : ''}`}
              onClick={() => setView('inscricoes')}
              startIcon={<PeopleIcon />}
            >
              Inscrições
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;