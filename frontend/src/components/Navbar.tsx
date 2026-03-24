import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  makeStyles,
  Container,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  TrendingUp as FlowIcon,
  WorkOutline as VagasIcon,
  SettingsOutlined as GearIcon,
  PeopleOutline as PeopleIcon,
  DashboardOutlined as DashboardIcon,
} from "@material-ui/icons";

interface NavbarProps {
  view: string;
  setView: (view: string) => void;
}

const useStyles = makeStyles(() => ({
  navbar: {
    backgroundColor: "#B2EBF2",
    color: "#006064",
    padding: "10px 0",
    borderRadius: "0 0 50px 50px",
    boxShadow: "0px 4px 20px rgba(0, 172, 193, 0.1)",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": { transform: "scale(1.05)" },
  },
  navButton: {
    borderRadius: "25px",
    textTransform: "none",
    fontWeight: 900,
    fontSize: "0.95rem",
    marginLeft: "12px",
    padding: "10px 22px",
    color: "#004D40",
    transition: "0.3s all cubic-bezier(0.4, 0, 0.2, 1)",
    "& .MuiButton-startIcon": {
      transition: "0.3s transform ease",
      color: "#00ACC1",
      margin: 0,
      "@media (min-width: 600px)": { marginRight: "8px" },
    },
    "&:hover": {
      backgroundColor: "#FFFFFF",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.05)",
      transform: "translateY(-3px)",
      "& .MuiButton-startIcon": {
        transform: "scale(1.2) rotate(-8deg)",
      },
    },
  },
  activeButton: {
    backgroundColor: "#00ACC1",
    color: "#FFF !important",
    boxShadow: "0 6px 15px rgba(0, 172, 193, 0.3)",
    "& .MuiButton-startIcon": {
      color: "#FFF !important",
    },
    "&:hover": {
      backgroundColor: "#0097A7",
    },
  },
}));

const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="sticky" className={classes.navbar} elevation={0}>
      <Container maxWidth="lg">
        <Toolbar
          style={{
            justifyContent: "space-between",
            padding: isMobile ? "0 5px" : "0 24px",
          }}
        >
          <Box className={classes.logo} onClick={() => setView("vagas")}>
            <FlowIcon
              style={{ fontSize: isMobile ? 28 : 36, color: "#00ACC1" }}
            />
            {!isMobile && (
              <Typography
                variant="h4"
                style={{
                  fontWeight: 900,
                  color: "#004D40",
                  letterSpacing: "-1.5px",
                }}
              >
                Talent
                <Box component="span" style={{ color: "#00ACC1" }}>
                  Flow
                </Box>
              </Typography>
            )}
          </Box>

          <Box display="flex">
            <Button
              className={`${classes.navButton} ${view === "vagas" ? classes.activeButton : ""}`}
              onClick={() => setView("vagas")}
              startIcon={<VagasIcon />}
            >
              {!isMobile && "Vagas"}
            </Button>
            <Button
              className={`${classes.navButton} ${view === "gerenciar" ? classes.activeButton : ""}`}
              onClick={() => setView("gerenciar")}
              startIcon={<GearIcon />}
            >
              {!isMobile && "Gerenciar"}
            </Button>
            <Button
              className={`${classes.navButton} ${view === "inscricoes" ? classes.activeButton : ""}`}
              onClick={() => setView("inscricoes")}
              startIcon={<PeopleIcon />}
            >
              {!isMobile && "Inscrições"}
            </Button>
            <Button
              className={`${classes.navButton} ${view === "dashboard" ? classes.activeButton : ""}`}
              onClick={() => setView("dashboard")}
              startIcon={<DashboardIcon />}
            >
              {!isMobile && "Estatísticas"}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
