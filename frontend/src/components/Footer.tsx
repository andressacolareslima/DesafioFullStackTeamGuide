import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  makeStyles,
  Divider,
  Theme,
} from "@material-ui/core";
import {
  Instagram,
  LinkedIn,
  GitHub,
  TrendingUp as FlowIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    backgroundColor: "#E0F7FA",
    color: "#004D40",
    padding: theme.spacing(6, 0),
    marginTop: "auto",
    borderRadius: "60px 60px 0 0",
    boxShadow: "0px -10px 30px rgba(0, 172, 193, 0.05)",
    position: "relative",
    zIndex: 2,
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    color: "#004D40",
  },
  socialIcon: {
    color: "#00ACC1",
    marginRight: "15px",
    transition: "0.3s",
    "&:hover": {
      color: "#004D40",
      transform: "translateY(-3px)",
    },
  },
  footerLink: {
    color: "#555",
    display: "block",
    marginBottom: "8px",
    fontSize: "0.9rem",
    transition: "0.2s",
    fontWeight: 500,
    "&:hover": {
      color: "#00ACC1",
      textDecoration: "none",
      paddingLeft: "5px",
    },
  },
  divider: {
    margin: "30px 0",
    backgroundColor: "rgba(0, 172, 193, 0.1)",
  },
}));

interface FooterProps {
  setView: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  const classes = useStyles();

  return (
    <Box component="footer" className={classes.footer}>
      <Container maxWidth="md">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={5}>
            <Box className={classes.logoSection}>
              <FlowIcon style={{ fontSize: 30, color: "#00ACC1" }} />
              <Typography variant="h6" style={{ fontWeight: 900 }}>
                Talent
                <Box component="span" style={{ color: "#00ACC1" }}>
                  Flow
                </Box>
              </Typography>
            </Box>
            <Typography
              variant="body2"
              style={{ color: "#666", lineHeight: 1.6, maxWidth: "350px" }}
            >
              A plataforma inteligente para conectar mentes brilhantes às
              melhores oportunidades no ecossistema de tecnologia e engenharia.
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: 800, color: "#004D40", marginBottom: 15 }}
            >
              Plataforma
            </Typography>
            <Link
              href="/"
              onClick={(e: any) => {
                e.preventDefault();
                setView("vagas");
              }}
              className={classes.footerLink}
            >
              Oportunidades
            </Link>
            <Link
              href="/gerenciar"
              onClick={(e: any) => {
                e.preventDefault();
                setView("gerenciar");
              }}
              className={classes.footerLink}
            >
              Gerenciar
            </Link>
            <Link
              href="/privacidade"
              onClick={(e: any) => {
                e.preventDefault();
                setView("privacidade");
              }}
              className={classes.footerLink}
            >
              Privacidade
            </Link>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: 800, color: "#004D40", marginBottom: 15 }}
            >
              Conecte-se
            </Typography>
            <Box display="flex">
              <Link
                href="#"
                className={classes.socialIcon}
                aria-label="Instagram"
              >
                <Instagram />
              </Link>
              <Link
                href="#"
                className={classes.socialIcon}
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </Link>
              <Link href="#" className={classes.socialIcon} aria-label="GitHub">
                <GitHub />
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />

        <Box textAlign="center">
          <Typography
            variant="caption"
            style={{
              color: "#888",
              fontWeight: 600,
              display: "block",
              paddingBottom: 4,
            }}
          >
            © {new Date().getFullYear()}{" "}
            <Box component="strong">TalentFlow</Box>. Todos os direitos
            reservados.
          </Typography>
          <Typography
            variant="caption"
            style={{ color: "#888", fontWeight: 600, display: "block" }}
          >
            Construído por <Box component="strong">Andressa Colares</Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
