import React, { useState, useMemo, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Container,
  IconButton,
  makeStyles,
  Fade,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Search as SearchIcon, Close as CloseIcon } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useQuery } from "react-query";
import VagaCard from "../components/VagaCard";
import Loading from "../components/Loading";
import api from "../services/api";
import { Vaga } from "../types";

const useStyles = makeStyles(() => ({
  pagination: {
    "& .MuiPaginationItem-root": {
      borderRadius: "8px",
      border: "1px solid #B2EBF2",
      color: "#00ACC1",
      fontWeight: "bold",
    },
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "#E0F2F1",
      color: "#00ACC1",
      border: "1px solid #00ACC1",
    },
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 30,
      backgroundColor: "#F5F5F5",
      transition: "0.3s",
      "&.Mui-focused": {
        backgroundColor: "#FFF",
        boxShadow: "0px 4px 15px rgba(0, 172, 193, 0.1)",
      },
    },
  },
  cardAnimado: {
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-8px)",
    },
  },
}));

interface HomeProps {
  setAlerta: (alerta: any) => void;
}

const Home: React.FC<HomeProps> = ({ setAlerta }) => {
  const classes = useStyles();
  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");
  const [areaFilter, setAreaFilter] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("A-Z");
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
    const ativas = Array.isArray(vagas)
      ? vagas.filter((v) => v.status?.toLowerCase() === "aberta")
      : [];
    const areas = Array.from(new Set(ativas.map((v) => v.area))).sort((a, b) =>
      a.localeCompare(b),
    );

    let filtradas = ativas.filter(
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  if (isLoading) return <Loading />;

  return (
    <Fade in={!isLoading} timeout={1000}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Grid container spacing={3} style={{ marginBottom: 60 }}>
          <Grid item xs={12} md={6}>
            <TextField
              className={classes.searchField}
              fullWidth
              variant="outlined"
              placeholder="Pesquisar cargo, tecnologia ou área..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#00ACC1" }} />
                  </InputAdornment>
                ),
                endAdornment: busca && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setBusca("")} size="small">
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl
              variant="outlined"
              fullWidth
              className={classes.searchField}
            >
              <Select
                value={areaFilter}
                onChange={handleAreaChange}
                displayEmpty
                style={{
                  borderRadius: 30,
                  backgroundColor: "#F5F5F5",
                  fontWeight: 600,
                  color: "#555",
                }}
              >
                <MenuItem value="Todas">Todas as Áreas</MenuItem>
                {areasUnicas.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl
              variant="outlined"
              fullWidth
              className={classes.searchField}
            >
              <Select
                value={sortOrder}
                onChange={handleSortChange}
                displayEmpty
                style={{
                  borderRadius: 30,
                  backgroundColor: "#F5F5F5",
                  fontWeight: 600,
                  color: "#555",
                }}
              >
                <MenuItem value="Recentes">Mais Recentes</MenuItem>
                <MenuItem value="A-Z">Ordem Alfabética</MenuItem>
                <MenuItem value="Z-A">Ordem (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box mb={5}>
          <Typography
            variant="h3"
            style={{ fontWeight: 900, color: "#004D40" }}
          >
            Oportunidades
          </Typography>
          <Typography variant="subtitle1" style={{ color: "#666" }}>
            Explore {vagasFiltradas.length} vagas disponíveis para você.
          </Typography>
        </Box>

        <Fade in={!isPaginating} timeout={300}>
          <Box minHeight={400}>
            {isError ? (
              <Box width="100%" textAlign="center" py={10} style={{ backgroundColor: "#fff", borderRadius: 35, border: "1px dashed #cfd8dc" }}>
                <Box fontSize={50} mb={2}>⚠️</Box>
                <Typography variant="h5" style={{ fontWeight: 800, color: "#d32f2f" }}>
                  Falha ao carregar oportunidades
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginTop: 10 }}>
                  Verifique sua conexão ou tente novamente mais tarde.
                </Typography>
              </Box>
            ) : vagasFiltradas.length === 0 ? (
              <Box width="100%" textAlign="center" py={10} style={{ backgroundColor: "#F9FBFB", borderRadius: 35, border: "2px dashed #B2EBF2" }}>
                <Box fontSize={60} mb={2}>🔍</Box>
                <Typography variant="h5" style={{ fontWeight: 800, color: "#00838F" }}>
                  Nenhuma vaga encontrada
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginTop: 10, maxWidth: 400, margin: "0 auto" }}>
                  Tente ajustar seus filtros de pesquisa ou retorne mais tarde para visualizar novas oportunidades.
                </Typography>
              </Box>
            ) : (
            <Grid container spacing={3}>
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
          <Box mt={10} display="flex" justifyContent="center">
            <Pagination
              className={classes.pagination}
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Fade>
  );
};

export default Home;
