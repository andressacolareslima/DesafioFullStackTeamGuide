import React, { useState, useMemo, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  InputBase,
  Box,
  Container,
  IconButton,
  makeStyles,
  Fade,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Search as SearchIcon, Close as CloseIcon, Work as WorkIcon } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useQuery } from "react-query";
import VagaCard from "../components/VagaCard";
import Loading from "../components/Loading";
import api from "../services/api";
import { Vaga } from "../types";

const useStyles = makeStyles((theme) => ({
  heroBackground: {
    background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)",
    padding: theme.spacing(12, 2, 10, 2),
    borderRadius: "0 0 60px 60px",
    marginBottom: theme.spacing(6),
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0, 172, 193, 0.1)",
  },
  heroTitle: {
    fontWeight: 900,
    color: "#004D40",
    marginBottom: theme.spacing(3),
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    letterSpacing: "-1.5px",
  },
  heroSubtitle: {
    color: "#00796B",
    fontSize: "1.2rem",
    marginBottom: theme.spacing(5),
    maxWidth: 700,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  searchWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    padding: theme.spacing(1, 2, 1, 3),
    display: "flex",
    alignItems: "center",
    boxShadow: "0 15px 35px rgba(0, 172, 193, 0.2)",
    maxWidth: 800,
    margin: "0 auto",
    border: "2px solid #E0F7FA",
    transition: "all 0.3s ease",
    "&:focus-within": {
      borderColor: "#00ACC1",
      boxShadow: "0 15px 40px rgba(0, 172, 193, 0.3)",
      transform: "translateY(-2px)"
    }
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing(1),
    fontSize: "1.1rem",
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#00ACC1",
    color: "#FFF",
    borderRadius: 30,
    padding: "10px 24px",
    fontWeight: 700,
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#0097A7",
    },
  },
  filterControl: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 15,
      backgroundColor: "#FFFFFF",
      boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
      "& fieldset": { borderColor: "#E0E0E0" },
      "&:hover fieldset": { borderColor: "#00ACC1" },
      "&.Mui-focused fieldset": { borderColor: "#00ACC1" },
    },
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      borderRadius: "12px",
      border: "1px solid #B2EBF2",
      color: "#00ACC1",
      fontWeight: "bold",
    },
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "#00ACC1",
      color: "#FFF",
      border: "1px solid #00ACC1",
      "&:hover": {
        backgroundColor: "#0097A7",
      }
    },
  },
  cardAnimado: {
    transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    "&:hover": {
      transform: "translateY(-10px) scale(1.02)",
    },
  },
  statBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    color: "#00695C",
    padding: "6px 16px",
    borderRadius: 20,
    fontWeight: 800,
    fontSize: "0.9rem",
    marginBottom: theme.spacing(3),
    "& svg": {
      marginRight: 6,
      fontSize: 18,
    }
  }
}));

interface HomeProps {
  setAlerta: (alerta: any) => void;
}

const Home: React.FC<HomeProps> = ({ setAlerta }) => {
  const classes = useStyles();
  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");
  const [areaFilter, setAreaFilter] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("Recentes");
  const [page, setPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    setIsPaginating(true);
    const delayDebounceFn = setTimeout(() => {
      setBuscaDebounced(busca);
      setPage(1);
      setIsPaginating(false);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [busca]);

  const handleAreaChange = (e: any) => {
    const val = e.target.value as string;
    setIsPaginating(true);
    setTimeout(() => {
      setAreaFilter(val);
      setPage(1);
      setIsPaginating(false);
    }, 300);
  };

  const handleSortChange = (e: any) => {
    const val = e.target.value as string;
    setIsPaginating(true);
    setTimeout(() => {
      setSortOrder(val);
      setPage(1);
      setIsPaginating(false);
    }, 300);
  };

  const { data: vagas = [], isLoading, isError } = useQuery<Vaga[]>(
    "vagasHome",
    async () => {
      const res = await api.get("/vagas?size=100");
      return res.data.content || res.data || [];
    },
    {
      staleTime: 1000 * 60 * 5,
      retry: 1
    },
  );

  const { vagasAtivas, areasUnicas, vagasFiltradas } = useMemo(() => {
    const todas = Array.isArray(vagas) ? vagas : [];
    const ativas = todas.filter((v) => v.status?.toLowerCase() === "aberta");
    
    const areas = Array.from(new Set(todas.map((v) => v.area))).sort((a, b) =>
      a.localeCompare(b),
    );

    let filtradas = todas.filter(
      (v) =>
        v.titulo.toLowerCase().includes(buscaDebounced.toLowerCase()) ||
        v.area.toLowerCase().includes(buscaDebounced.toLowerCase()),
    );

    if (areaFilter !== "Todas") {
      filtradas = filtradas.filter((v) => v.area === areaFilter);
    }

    if (sortOrder === "A-Z") {
      filtradas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (sortOrder === "Z-A") {
      filtradas.sort((a, b) => b.titulo.localeCompare(a.titulo));
    } else {
      filtradas.sort((a, b) => b.id - a.id);
    }

    return {
      vagasAtivas: ativas,
      areasUnicas: areas,
      vagasFiltradas: filtradas,
    };
  }, [buscaDebounced, areaFilter, sortOrder, vagas]);

  const totalPages = Math.ceil(vagasFiltradas.length / itemsPerPage) || 1;
  const vagasExibidas = vagasFiltradas.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (value === page) return;
    setIsPaginating(true);
    setTimeout(() => {
      setPage(value);
      setIsPaginating(false);
      const jobsSection = document.getElementById("jobs-list");
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 300, behavior: "smooth" });
      }
    }, 300);
  };

  if (isLoading) return <Loading />;

  return (
    <Fade in={!isLoading} timeout={800}>
      <Box>
        <Box className={classes.heroBackground}>
          <Container maxWidth="md">
            <Box className={classes.statBadge}>
              <WorkIcon /> {vagasAtivas.length} Vagas Abertas
            </Box>
            <Typography variant="h1" className={classes.heroTitle}>
              Encontre o trabalho da sua vida
            </Typography>
            <Typography variant="subtitle1" className={classes.heroSubtitle}>
              Conectamos talentos incríveis com as empresas mais inovadoras do mercado.
              Pesquise por cargo, tecnologia ou área e dê o próximo passo na sua jornada.
            </Typography>

            <Box className={classes.searchWrapper}>
              <SearchIcon style={{ color: "#00ACC1", fontSize: 28 }} />
              <InputBase
                className={classes.searchInput}
                placeholder="Ex: Desenvolvedor React, Engenheiro de Dados..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca && (
                <IconButton onClick={() => setBusca("")} size="small" style={{ marginRight: 8 }}>
                  <CloseIcon />
                </IconButton>
              )}
              <Button className={classes.searchButton} disableElevation variant="contained">
                Buscar
              </Button>
            </Box>
          </Container>
        </Box>


        <Container maxWidth="md" style={{ marginBottom: 80 }} id="jobs-list">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={4}>
            <Typography
              variant="h4"
              style={{ fontWeight: 800, color: "#004D40", flex: "1 1 auto", minWidth: 200, marginBottom: 16 }}
            >
              Resultados da busca ({vagasFiltradas.length})
            </Typography>

            <Box display="flex" flexWrap="wrap" style={{ gap: "16px" }}>
              <FormControl variant="outlined" className={classes.filterControl} style={{ minWidth: 200 }}>
                <Select
                  value={areaFilter}
                  onChange={handleAreaChange}
                  displayEmpty
                >
                  <MenuItem value="Todas">Todas as Áreas</MenuItem>
                  {areasUnicas.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" className={classes.filterControl} style={{ minWidth: 200 }}>
                <Select
                  value={sortOrder}
                  onChange={handleSortChange}
                  displayEmpty
                >
                  <MenuItem value="Recentes">Mais Recentes</MenuItem>
                  <MenuItem value="A-Z">Ordem Alfabética</MenuItem>
                  <MenuItem value="Z-A">Ordem (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Fade in={!isPaginating} timeout={400}>
            <Box minHeight={400}>
              {isError ? (
                <Box width="100%" textAlign="center" py={12} style={{ backgroundColor: "#FAFAFA", borderRadius: 30, border: "2px dashed #E0E0E0" }}>
                  <Box fontSize={60} mb={2}>🔌</Box>
                  <Typography variant="h5" style={{ fontWeight: 800, color: "#d32f2f" }}>
                    Ops, algo deu errado
                  </Typography>
                  <Typography variant="body1" color="textSecondary" style={{ marginTop: 10 }}>
                    Não conseguimos conectar aos nossos servidores. Tente novamente em instantes.
                  </Typography>
                </Box>
              ) : vagasFiltradas.length === 0 ? (
                <Box width="100%" textAlign="center" py={12} style={{ backgroundColor: "#F9FBFB", borderRadius: 30, border: "2px dashed #B2EBF2" }}>
                  <Box fontSize={70} mb={2}>🚀</Box>
                  <Typography variant="h5" style={{ fontWeight: 800, color: "#00838F" }}>
                    Nenhuma vaga encontrada
                  </Typography>
                  <Typography variant="body1" color="textSecondary" style={{ marginTop: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
                    Não encontramos nenhuma oportunidade com os filtros atuais. <br />
                    Tente usar termos mais genéricos ou limpar a busca.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={4}>
                  {vagasExibidas.map((v) => (
                    <Grid item xs={12} key={v.id} className={classes.cardAnimado}>
                      <VagaCard vaga={v} setAlerta={setAlerta} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>

          {vagasFiltradas.length > 0 && !isError && (
            <Box mt={8} display="flex" justifyContent="center">
              <Pagination
                className={classes.pagination}
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                size="large"
              />
            </Box>
          )}
        </Container>
      </Box>
    </Fade>
  );
};

export default Home;
