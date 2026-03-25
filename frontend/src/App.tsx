import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  makeStyles,
  Snackbar,
  Box,
  Fade,
  CssBaseline,
} from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import { QueryClient, QueryClientProvider } from "react-query";
import Loading from "./components/Loading";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GerenciarVagas from "./pages/GerenciarVagas";
import Inscricoes from "./pages/Inscricoes";
import Dashboard from "./pages/Dashboard";
import Privacidade from "./pages/Privacidade";
import MinhasInscricoes from "./pages/MinhasInscricoes";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: { primary: { main: "#00ACC1" } },
  typography: { fontFamily: '"Inter", sans-serif' },
});

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    position: "relative",
    overflowX: "hidden",
    width: "100%",
  },

  shapeLeft: {
    position: "fixed",
    left: "-150px",
    top: "20%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    backgroundColor: "#E0F7FA",
    filter: "blur(80px)",
    zIndex: 0,
    opacity: 0.6,
  },
  shapeRight: {
    position: "fixed",
    right: "-150px",
    bottom: "10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    backgroundColor: "#B2EBF2",
    filter: "blur(100px)",
    zIndex: 0,
    opacity: 0.4,
  },
  content: {
    flexGrow: 1,
    position: "relative",
    zIndex: 1,
    paddingBottom: "80px",
  },
}));

interface AlertaState {
  open: boolean;
  msg: string;
  severity: Color;
}

function App() {
  const classes = useStyles();
  const { session, role, loading: authLoading } = useAuth();

  const getInitialView = () => {
    const path = window.location.pathname;
    if (path.includes("gerenciar")) return "gerenciar";
    if (path.includes("inscricoes")) return "inscricoes";
    if (path.includes("dashboard")) return "dashboard";
    if (path.includes("minhas-inscricoes")) return "minhas-inscricoes";
    if (path.includes("privacidade")) return "privacidade";
    return "vagas";
  };
  const [view, setView] = useState<string>(getInitialView());
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [alerta, setAlerta] = useState<AlertaState>({
    open: false,
    msg: "",
    severity: "success",
  });

  const handleViewChange = (newView: string) => {
    if (view === newView) return;
    setIsTransitioning(true);

    const newPath = newView === "vagas" ? "/" : `/${newView}`;
    window.history.pushState({}, "", newPath);

    setTimeout(() => {
      setView(newView);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  };

  useEffect(() => {
    switch (view) {
      case "vagas":
        document.title = "Vagas | TalentFlow";
        break;
      case "gerenciar":
        document.title = "Gerenciar Vagas | TalentFlow";
        break;
      case "inscricoes":
        document.title = "Inscrições | TalentFlow";
        break;
      case "dashboard":
        document.title = "Estatísticas | TalentFlow";
        break;
      case "minhas-inscricoes":
        document.title = "Minhas Inscrições | TalentFlow";
        break;
      case "privacidade":
        document.title = "Privacidade | TalentFlow";
        break;
      default:
        document.title = "TalentFlow";
    }
  }, [view]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const newView = path.includes("gerenciar")
        ? "gerenciar"
        : path.includes("inscricoes")
          ? "inscricoes"
          : path.includes("dashboard")
            ? "dashboard"
            : path.includes("minhas-inscricoes")
              ? "minhas-inscricoes"
              : path.includes("privacidade")
                ? "privacidade"
              : "vagas";
      if (view !== newView) {
        setIsTransitioning(true);
        setTimeout(() => {
          setView(newView);
          setIsTransitioning(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 300);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [view]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className={classes.root}>
          <Box className={classes.shapeLeft} />
          <Box className={classes.shapeRight} />

          <Navbar view={view} setView={handleViewChange} />

          <main className={classes.content}>
            {isTransitioning ? (
              <Loading />
            ) : (
              <Fade in={!isTransitioning} timeout={600}>
                <Box>
                  {view === "vagas" && <Home setAlerta={setAlerta} />}
                  {view === "login" && <Login setView={handleViewChange} setAlerta={setAlerta} />}
                  {view === "register" && <Register setView={handleViewChange} setAlerta={setAlerta} />}
                  
                  {view === "gerenciar" && (
                    role === "admin" ? <GerenciarVagas setAlerta={setAlerta} /> : <Home setAlerta={setAlerta} />
                  )}
                  {view === "inscricoes" && (
                    role === "admin" ? <Inscricoes setAlerta={setAlerta} /> : <Home setAlerta={setAlerta} />
                  )}
                  {view === "dashboard" && (
                     role === "admin" ? <Dashboard /> : <Home setAlerta={setAlerta} />
                  )}
                  {view === "privacidade" && <Privacidade />}
                  {view === "minhas-inscricoes" && session && <MinhasInscricoes />}
                </Box>
              </Fade>
            )}
          </main>

          <Footer setView={handleViewChange} />

          <Snackbar
            open={alerta.open}
            autoHideDuration={4000}
            onClose={() => setAlerta({ ...alerta, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
