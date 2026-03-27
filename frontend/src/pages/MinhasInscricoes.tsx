import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Fade,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../services/api";
import Loading from "../components/Loading";
import { Candidatura } from "../types";
import { useAuth } from "../contexts/AuthContext";

const useStyles = makeStyles(() => ({
  tableContainer: {
    borderRadius: "25px",
    border: "1px solid #E0F2F1",
    boxShadow: "0px 10px 30px rgba(0, 172, 193, 0.05)",
    overflowX: "auto",
    width: "100%",
  },
  head: { backgroundColor: "#E0F7FA" },
  headerCell: { fontWeight: 900, color: "#004D40" },
  row: { "&:hover": { backgroundColor: "#F9FBFB" } },
  chip_em_analise: { backgroundColor: "#FFFDE7", color: "#F57F17", fontWeight: 700 },
  chip_aprovado: { backgroundColor: "#E8F5E9", color: "#2E7D32", fontWeight: 700 },
  chip_reprovado: { backgroundColor: "#FFEBEE", color: "#C62828", fontWeight: 700 },
  pagination: {
    "& .MuiPaginationItem-root": {
      borderRadius: "8px",
      border: "1px solid #B2EBF2",
      color: "#00ACC1",
      fontWeight: "bold",
      margin: "0 4px",
      backgroundColor: "#FFFFFF",
    },
    "& .Mui-selected": {
      backgroundColor: "#E0F7FA !important",
      borderColor: "#00ACC1",
      color: "#00ACC1",
    },
  },
}));

const MinhasInscricoes: React.FC = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedInsc, setSelectedInsc] = useState<Candidatura | null>(null);
  const [editName, setEditName] = useState("");

  const { data: inscricoes = [], isLoading, isError } = useQuery<Candidatura[]>(
    ["minhasCandidaturas", user?.email],
    async () => {
      if (!user?.email) return [];
      const res = await api.get(`/candidaturas?email=${encodeURIComponent(user.email)}`);
      return res.data || [];
    },
    { retry: 1, enabled: !!user?.email }
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

  const editMutation = useMutation(
    (dados: { id: number; nomeCandidato: string }) =>
      api.put(`/candidaturas/user/${dados.id}`, { nomeCandidato: dados.nomeCandidato }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["minhasCandidaturas", user?.email]);
        setEditOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: number) => api.delete(`/candidaturas/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["minhasCandidaturas", user?.email]);
        setDeleteOpen(false);
      },
    }
  );

  const handleEditClick = (insc: Candidatura) => {
    setSelectedInsc(insc);
    setEditName(insc.nomeCandidato || "");
    setEditOpen(true);
  };

  const handleDeleteClick = (insc: Candidatura) => {
    setSelectedInsc(insc);
    setDeleteOpen(true);
  };

  const confirmEdit = () => {
    if (selectedInsc && editName.trim()) {
      editMutation.mutate({ id: selectedInsc.id, nomeCandidato: editName });
    }
  };

  const confirmDelete = () => {
    if (selectedInsc) {
      deleteMutation.mutate(selectedInsc.id);
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "aprovado": return "Aprovado";
      case "reprovado": return "Não foi dessa vez";
      default: return "Em Análise";
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Fade in={!isLoading}>
        <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Typography
          variant="h3"
          style={{ fontWeight: 900, color: "#004D40", marginBottom: 20 }}
        >
          Minhas Inscrições
        </Typography>

        {isError ? (
          <Box width="100%" textAlign="center" py={10} style={{ backgroundColor: "#fff", borderRadius: 35, border: "1px dashed #cfd8dc" }}>
            <Box fontSize={50} mb={2}>⚠️</Box>
            <Typography variant="h5" style={{ fontWeight: 800, color: "#d32f2f" }}>
              Falha ao carregar dados
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ marginTop: 10 }}>
              Verifique sua conexão ou a disponibilidade do servidor.
            </Typography>
          </Box>
        ) : inscricoes.length === 0 ? (
          <Box width="100%" textAlign="center" py={10} style={{ backgroundColor: "#F9FBFB", borderRadius: 35, border: "2px dashed #B2EBF2" }}>
            <Box fontSize={60} mb={2}>🚀</Box>
            <Typography variant="h5" style={{ fontWeight: 800, color: "#00838F" }}>
              Nenhuma inscrição encontrada
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ marginTop: 10, maxWidth: 400, margin: "10px auto" }}>
              Você ainda não se candidatou a nenhuma vaga. Acesse a página inicial e encontre a oportunidade perfeita para você!
            </Typography>
          </Box>
        ) : (
        <Fade in={!isPaginating} timeout={300}>
          <Box minHeight={450}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
              elevation={0}
            >
              <Table style={{ minWidth: 650 }}>
                <TableHead className={classes.head}>
                  <TableRow>
                    <TableCell className={classes.headerCell}>Vaga</TableCell>
                    <TableCell className={classes.headerCell} align="center">
                      Status da Candidatura
                    </TableCell>
                    <TableCell className={classes.headerCell} align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inscricoes.slice((page - 1) * 7, page * 7).map((insc) => (
                    <TableRow key={insc.id} hover className={classes.row}>
                      <TableCell style={{ fontWeight: 700, color: "#00ACC1" }}>
                        {insc.tituloVaga || "---"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                           label={getStatusLabel(insc.status || "em_analise")}
                           className={classes[`chip_${insc.status || "em_analise"}` as keyof typeof classes]}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton size="small" style={{ color: "#00ACC1" }} onClick={() => handleEditClick(insc)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" style={{ color: "#F44336" }} onClick={() => handleDeleteClick(insc)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
        )}
        
        {inscricoes.length > 0 && !isError && (
          <Box mt={6} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(inscricoes.length / 7) || 1}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              className={classes.pagination}
            />
          </Box>
        )}
        </Container>
      </Fade>


      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 20 } }}>
        <DialogTitle style={{ fontWeight: 800, color: "#004D40" }}>Editar Candidatura</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 15 }}>
            Atualize o nome associado à sua candidatura para a vaga <strong>{selectedInsc?.tituloVaga}</strong>.
          </Typography>
          <TextField
            label="Nome Completo"
            variant="outlined"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button onClick={() => setEditOpen(false)} color="default" style={{ fontWeight: "bold" }}>
            Cancelar
          </Button>
          <Button
            onClick={confirmEdit}
            color="primary"
            variant="contained"
            disabled={!editName.trim() || editMutation.isLoading}
            style={{ fontWeight: "bold", borderRadius: 20, backgroundColor: "#00ACC1" }}
          >
            {editMutation.isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 20 } }}>
        <DialogTitle style={{ fontWeight: 800, color: "#D32F2F" }}>Excluir Candidatura</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza que deseja cancelar e excluir sua candidatura para a vaga <strong>{selectedInsc?.tituloVaga}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
            Esta ação não pode ser desfeita. Você precisará se candidatar novamente caso mude de ideia.
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button onClick={() => setDeleteOpen(false)} color="default" style={{ fontWeight: "bold" }}>
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="secondary"
            variant="contained"
            disabled={deleteMutation.isLoading}
            style={{ fontWeight: "bold", borderRadius: 20, backgroundColor: "#D32F2F" }}
          >
            {deleteMutation.isLoading ? "Excluindo..." : "Sim, Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MinhasInscricoes;
