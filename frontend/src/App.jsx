import React, { useState } from 'react';
import { ThemeProvider, createTheme, makeStyles, Snackbar, Box, Fade } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GerenciarVagas from './pages/GerenciarVagas';
import Inscricoes from './pages/Inscricoes';
import Footer from './components/Footer';

const theme = createTheme({
  palette: { primary: { main: '#00ACC1' } },
  typography: { fontFamily: '"Inter", sans-serif' }
});

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflowX: 'hidden',
  },
  // SHAPES LATERAIS PARA FICAR BONITO
  shapeLeft: {
    position: 'fixed',
    left: '-150px',
    top: '20%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    backgroundColor: '#E0F7FA',
    filter: 'blur(80px)',
    zIndex: 0,
    opacity: 0.6,
  },
  shapeRight: {
    position: 'fixed',
    right: '-150px',
    bottom: '10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    backgroundColor: '#B2EBF2', 
    filter: 'blur(100px)',
    zIndex: 0,
    opacity: 0.4,
  },
  content: {
    flexGrow: 1,
    position: 'relative',
    zIndex: 1,
    paddingBottom: '80px',
  }
}));

function App() {
  const classes = useStyles();
  const [view, setView] = useState('vagas');
  const [alerta, setAlerta] = useState({ open: false, msg: '', severity: 'success' });

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>
        <div className={classes.shapeLeft} />
        <div className={classes.shapeRight} />

        <Navbar view={view} setView={setView} />
        
        <main className={classes.content}>
          <Fade in={true} timeout={800}>
            <Box>
              {view === 'vagas' && <Home setAlerta={setAlerta} />}
              {view === 'gerenciar' && <GerenciarVagas setAlerta={setAlerta} />}
              {view === 'inscricoes' && <Inscricoes />}
            </Box>
          </Fade>
        </main>

        <Footer />

        <Snackbar 
          open={alerta.open} 
          autoHideDuration={3000} 
          onClose={() => setAlerta({...alerta, open: false})}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={alerta.severity} variant="filled" style={{ borderRadius: 20 }}>
            {alerta.msg}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;