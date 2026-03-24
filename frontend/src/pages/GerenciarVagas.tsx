import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  makeStyles,
  withStyles,
  Grid,
  Fade,
  Slide,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { Pagination } from "@material-ui/lab";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../services/api";
import Loading from "../components/Loading";
import { Vaga } from "../types";

const StyledTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 15,
      backgroundColor: "#F9FBFB",
      "&:hover fieldset": { borderColor: "#00ACC1" },
      "&.Mui-focused fieldset": { borderColor: "#00ACC1", borderWidth: 2 },
    },
  },
})(TextField);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() => ({
  cardAdmin: {
    marginBottom: 20,
    borderRadius: "35px",
    padding: "25px 40px",
    border: "1px solid #E0F2F1",
    backgroundColor: "#FFFFFF",
    transition: "0.3s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      gap: "15px",
      textAlign: "center",
    },
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0px 12px 30px rgba(0, 172, 193, 0.15)",
      borderColor: "#00ACC1",
    },
  },
  headerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "48px",
    "@media (max-width: 600px)": {
      flexDirection: "column",
      gap: "20px",
      textAlign: "center",
    },
  },
  btnAnunciar: {
    backgroundColor: "#00ACC1",
    color: "white",
    borderRadius: 25,
    fontWeight: 900,
    padding: "12px 30px",
    textTransform: "none",
    boxShadow: "0px 4px 12px rgba(0, 172, 193, 0.3)",
    "&:hover": { backgroundColor: "#00838F" },
  },
  dialogPaper: { borderRadius: "35px !important", padding: "20px" },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginTop: "10px",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      borderRadius: "8px",
      border: "1px solid #B2EBF2",
      color: "#00ACC1",
      fontWeight: "bold",
    },
  },
}));

interface GerenciarProps {
  setAlerta: (alerta: any) => void;
}

const GerenciarVagas: React.FC<GerenciarProps> = ({ setAlerta }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);

  const [form, setForm] = useState({
    titulo: "",
    area: "",
    tipo: "Estágio",
    status: "Aberta",
  });

  const { data, isLoading, isError } = useQuery(
    ["vagasAdmin", page],
    async () => {
      const res = await api.get(`/vagas?page=${page - 1}&size=5&sort=id,desc`);
      return res.data;
    },
    { keepPreviousData: true, retry: 1 },
  );

  const saveMutation = useMutation(
    (payload: any) =>
      editMode && vagaSelecionada
        ? api.put(`/vagas/${vagaSelecionada.id}`, payload)
        : api.post("/vagas", payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vagasAdmin"]);
        queryClient.invalidateQueries(["vagasHome"]);
        setAlerta({
          open: true,
          msg: "Dados atualizados com sucesso! ✨",
          severity: "success",
        });
        setOpenForm(false);
      },
      onError: () =>
        setAlerta({
          open: true,
          msg: "Erro ao salvar informações.",
          severity: "error",
        }),
    },
  );

  const deleteMutation = useMutation(
    (id: number) => api.delete(`/vagas/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vagasAdmin"]);
        queryClient.invalidateQueries(["vagasHome"]);
        setAlerta({
          open: true,
          msg: "Vaga excluída permanentemente.",
          severity: "info",
        });
      },
      onError: () =>
        setAlerta({
          open: true,
          msg: "Não foi possível excluir (verifique se há candidatos).",
          severity: "error",
        }),
    },
  );

  const handleExcluir = (id: number, titulo: string) => {
    if (window.confirm(`Deseja realmente apagar a vaga: ${titulo}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSalvar = () => {
    if (!form.titulo.trim() || !form.area.trim()) return;
    saveMutation.mutate(form);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (value === page) return;
    setIsPaginating(true);
    setTimeout(() => {
      setPage(value);
      setIsPaginating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Box className={classes.headerBox}>
          <Typography
            variant="h3"
            style={{ fontWeight: 900, color: "#004D40" }}
          >
            Gestão de Vagas
          </Typography>
          <Button
            variant="contained"
            className={classes.btnAnunciar}
            startIcon={<AddIcon />}
            onClick={() => {
              setEditMode(false);
              setForm({
                titulo: "",
                area: "",
                tipo: "Estágio",
                status: "Aberta",
              });
              setOpenForm(true);
            }}
          >
            ANUNCIAR VAGA
          </Button>
        </Box>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Box width="100%" textAlign="center" py={10} style={{ backgroundColor: "#fff", borderRadius: 35, border: "1px dashed #cfd8dc" }}>
            <Box fontSize={50} mb={2}>⚠️</Box>
            <Typography variant="h5" style={{ fontWeight: 800, color: "#d32f2f" }}>
              Falha ao carregar dados
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ marginTop: 10 }}>
              Verifique se a variável VITE_API_URL está correta ou se o backend está online.
            </Typography>
          </Box>
        ) : data?.content?.length === 0 ? (
          <Box width="100%" textAlign="center" py={10} style={{ backgroundColor: "#F9FBFB", borderRadius: 35, border: "2px dashed #B2EBF2" }}>
            <Box fontSize={60} mb={2}>✨</Box>
            <Typography variant="h5" style={{ fontWeight: 800, color: "#00838F" }}>
              Seu portal está novinho em folha!
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ marginTop: 10, maxWidth: 400, margin: "10px auto" }}>
              Ainda não existem vagas cadastradas no banco de dados. Clique no botão "ANUNCIAR VAGA" acima para publicar a sua primeira oportunidade.
            </Typography>
          </Box>
        ) : (
        <Fade in={!isPaginating} timeout={300}>
           <Box minHeight={500}>
             {data?.content?.map((v: Vaga) => (
                <Card key={v.id} className={classes.cardAdmin} elevation={0}>
                  <Box>
                    <Typography
                      variant="h5"
                      style={{ fontWeight: 900, color: "#004D40" }}
                    >
                      {v.titulo}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: "#00ACC1", fontWeight: 700 }}
                  >
                    {v.area} • {v.tipo} •{" "}
                    <Box
                      component="span"
                      style={{
                        color:
                          v.status?.toLowerCase() === "aberta"
                            ? "#4caf50"
                            : "#d32f2f",
                      }}
                    >
                      {v.status}
                    </Box>
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditMode(true);
                      setVagaSelecionada(v);
                      setForm({
                        titulo: v.titulo,
                        area: v.area,
                        tipo: v.tipo || "Estágio",
                        status: v.status || "Aberta",
                      });
                      setOpenForm(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleExcluir(v.id, v.titulo)}
                    style={{ color: "#d32f2f" }}
                    disabled={deleteMutation.isLoading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </Fade>
        )}

        <Box mt={8} display="flex" justifyContent="center">
          <Pagination
            count={data?.totalPages || 1}
            page={page}
            onChange={handlePageChange}
            className={classes.pagination}
          />
        </Box>

        <Dialog
          open={openForm}
          onClose={() => setOpenForm(false)}
          TransitionComponent={Transition}
          classes={{ paper: classes.dialogPaper }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Typography
              variant="h5"
              style={{ fontWeight: 900, textAlign: "center", color: "#004D40" }}
            >
              {editMode ? "Editar Vaga" : "Nova Oportunidade"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box className={classes.inputWrapper}>
              <StyledTextField
                label="Título"
                fullWidth
                value={form.titulo}
                onChange={(e: any) =>
                  setForm({ ...form, titulo: e.target.value })
                }
              />
              <StyledTextField
                label="Área"
                fullWidth
                value={form.area}
                onChange={(e: any) =>
                  setForm({ ...form, area: e.target.value })
                }
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledTextField
                    select
                    label="Nível"
                    fullWidth
                    value={form.tipo}
                    onChange={(e: any) =>
                      setForm({ ...form, tipo: e.target.value })
                    }
                  >
                    {["Estágio", "Júnior", "Pleno", "Sênior"].map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>
                <Grid item xs={6}>
                  <StyledTextField
                    select
                    label="Status"
                    fullWidth
                    value={form.status}
                    onChange={(e: any) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <MenuItem value="Aberta">Aberta</MenuItem>
                    <MenuItem value="Fechada">Fechada</MenuItem>
                  </StyledTextField>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions
            style={{ padding: "20px 24px", justifyContent: "space-between" }}
          >
            <Button
              onClick={() => setOpenForm(false)}
              style={{ fontWeight: 700, color: "#666" }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvar}
              variant="contained"
              style={{
                backgroundColor: "#00ACC1",
                color: "#fff",
                borderRadius: 15,
                fontWeight: 800,
              }}
            >
              {saveMutation.isLoading ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Fade>
  );
};

export default GerenciarVagas;
