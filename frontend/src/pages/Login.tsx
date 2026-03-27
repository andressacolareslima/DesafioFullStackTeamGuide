import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  makeStyles,
  Link,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { supabase } from "../lib/supabase";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  leftPanel: {
    backgroundColor: "#84C8C2",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(6),
    overflow: "hidden",
    borderBottomRightRadius: "40%",
    borderTopRightRadius: "20%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  illustration: {
    width: "90%",
    maxWidth: 450,
    zIndex: 2,
    marginTop: theme.spacing(6),
  },
  slogan: {
    fontWeight: 800,
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
    lineHeight: 1.3,
    zIndex: 2,
    letterSpacing: "-1px",
    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
  },
  backLink: {
    position: "absolute",
    top: theme.spacing(4),
    right: theme.spacing(6),
    color: "#666",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.95rem",
    "&:hover": {
      color: "#00ACC1",
    }
  },
  title: {
    fontWeight: 900,
    color: "#000",
    textAlign: "center",
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: "#888",
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
  inputRoot: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#F4F6F6",
      borderRadius: "16px",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "2px solid #a8dadc",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "18px 24px",
      fontSize: "1rem",
      color: "#333",
    }
  },
  submitBtn: {
    backgroundColor: "#A7D3CF",
    color: "#FFFFFF",
    padding: "16px",
    borderRadius: "16px",
    fontWeight: 800,
    fontSize: "1.05rem",
    textTransform: "none",
    boxShadow: "none",
    marginTop: theme.spacing(2),
    transition: "0.3s ease",
    "&:hover": {
      backgroundColor: "#8DBFB9",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
  },
  error: {
    color: theme.palette.error.main,
    textAlign: "center",
    fontWeight: 600,
  },
  bottomText: {
    textAlign: "center",
    marginTop: theme.spacing(4),
    color: "#666",
    fontWeight: 600,
  },
  linkText: {
    color: "#A7D3CF",
    fontWeight: 800,
    cursor: "pointer",
    "&:hover": { color: "#8DBFB9" }
  }
}));

interface LoginProps {
  setView: (v: string) => void;
  setAlerta: (v: any) => void;
}

const Login: React.FC<LoginProps> = ({ setView, setAlerta }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setAlerta({ open: true, msg: "Login efetuado com sucesso!", severity: "success" });
    setLoading(false);
    setView("vagas");
  };

  return (
    <Box className={classes.root}>
      <Grid container style={{ minHeight: "100vh" }}>

        <Grid item xs={12} md={6} className={classes.leftPanel}>
          <Typography variant="h3" className={classes.slogan}>
            Conecte-se,<br/>
            Construa o futuro.
          </Typography>
          <img 
            src="/auth_hero_image.png" 
            alt="Profissionais de Tecnologia" 
            className={classes.illustration}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </Grid>


        <Grid item xs={12} md={6} className={classes.rightPanel}>
          <Link 
            className={classes.backLink}
            onClick={() => setView("vagas")}
            underline="none"
          >
            Voltar para o início
          </Link>

          <Box className={classes.formContainer}>
            <Box>
              <Typography variant="h4" className={classes.title}>
                Login
              </Typography>
              <Typography variant="body1" className={classes.subtitle}>
                Adicione seus dados para prosseguir
              </Typography>
            </Box>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TextField
                fullWidth
                placeholder="Digite seu email de acesso"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                className={classes.inputRoot}
              />
              <TextField
                fullWidth
                placeholder="Digite sua senha"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                className={classes.inputRoot}
              />

              {errorMsg && (
                <Typography variant="body2" className={classes.error}>
                  {errorMsg}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                className={classes.submitBtn}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Fazer login"}
              </Button>
            </form>

            <Typography className={classes.bottomText}>
              Ainda não tem uma conta?{" "}
              <Link
                component="span"
                className={classes.linkText}
                onClick={() => setView("register")}
                underline="none"
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
