import React, { useState } from 'react';
import { ThemeProvider, createTheme, makeStyles, Snackbar, Box, Fade } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';
import { QueryClient, QueryClientProvider } from 'react-query'; // Exigência do edital

import Navbar from './components/Navbar';
import Home from './pages/Home';
import GerenciarVagas from './pages/GerenciarVagas';
import Inscricoes from './pages/Inscricoes';
import Footer from './components/Footer';

// 1. Configuração do React Query (Motor de busca de dados)
const queryClient = new QueryClient();

// 2. Definição do Tema (Design System)
const theme = createTheme({
  palette: { primary: { main: '#00ACC1' } },
  typography: { fontFamily: '"Inter", sans-serif' }
});

// 3. Estilos do Layout
const useStyles = makeStyles(() => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflowX: 'hidden',
  },
  // SHAPES LATERAIS (O toque de design que a gente criou)
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

// 4. Tipagem para o TypeScript
interface AlertaState {
  open: boolean;
  msg: string;
  severity: Color; // Tipo específico do Material UI (success, error, etc.)
}

function App() {
  const classes = useStyles();
  
  // Estados tipados
  const [view, setView] = useState<string>('vagas');
  const [alerta, setAlerta] = useState<AlertaState>({ 
    open: false, 
    msg: '', 
    severity: 'success' 
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Box className={classes.root}>
          {/* Elementos Decorativos */}
          <div className={classes.shapeLeft} />
          <div className={classes.shapeRight} />

          <Navbar view={view} setView={setView} />
          
          <main className={classes.content}>
            <Fade in={true} timeout={800}>
              <Box>
                {/* Navegação entre as telas */}
                {view === 'vagas' && <Home setAlerta={setAlerta} />}
                {view === 'gerenciar' && <GerenciarVagas setAlerta={setAlerta} />}
                {view === 'inscricoes' && <Inscricoes />}
              </Box>
            </Fade>
          </main>

          <Footer />

          {/* Notificações do Sistema */}
          <Snackbar 
            open={alerta.open} 
            autoHideDuration={4000} 
            onClose={() => setAlerta({ ...alerta, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setAlerta({ ...alerta, open: false })} 
              severity={alerta.severity} 
              variant="filled" 
              style={{ borderRadius: 20, fontWeight: 600 }}
            >
              {alerta.msg}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;