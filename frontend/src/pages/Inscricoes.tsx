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
  MenuItem,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  FormControl,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  WarningRounded as WarningIcon,
} from "@material-ui/icons";
import { TransitionProps } from "@material-ui/core/transitions";
import { Pagination } from "@material-ui/lab";
import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../services/api";
import Loading from "../components/Loading";
import { Candidatura } from "../types";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  selectRoot: {
    padding: "6px 14px",
    borderRadius: "12px",
    fontWeight: 800,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    minWidth: "145px",
    textAlign: "center",
    "& .MuiSelect-select:focus": { backgroundColor: "transparent" },
  },
  status_em_analise: { backgroundColor: "#FFFDE7", color: "#F57F17" },
  status_aprovado: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
  status_reprovado: { backgroundColor: "#FFEBEE", color: "#C62828" },
  deleteModal: {
    borderRadius: "24px !important",
    padding: "10px",
    boxShadow: "0px 20px 40px rgba(0,0,0,0.1) !important",
  },
  btnCancel: {
    fontWeight: 700,
    color: "#666",
    borderRadius: "12px",
    padding: "8px 24px",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": { backgroundColor: "#f0f0f0", color: "#333" },
  },
  btnConfirmDelete: {
    backgroundColor: "#e53935",
    color: "#fff",
    borderRadius: "12px",
    fontWeight: 700,
    padding: "8px 24px",
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(229, 57, 53, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#c62828",
      boxShadow: "0 6px 16px rgba(198, 40, 40, 0.4)",
    },
  },
  iconWrapper: {
    backgroundColor: "#ffebee",
    borderRadius: "50%",
    padding: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
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

interface InscricoesProps {
  setAlerta: (alerta: any) => void;
}

const Inscricoes: React.FC<InscricoesProps> = ({ setAlerta }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);
  const [deleteId, setDeleteId] = useState<{ id: number; nome: string } | null>(
    null,
  );

  const { data: inscricoes = [], isLoading } = useQuery<Candidatura[]>(
    "candidaturas",
    async () => {
      const res = await api.get("/candidaturas");
      return res.data || [];
    },
  );

  const updateMutation = useMutation(
    async ({ id, status }: { id: number; status: string }) => {
      const cand = inscricoes.find((c) => c.id === id);
      return api.put(`/candidaturas/${id}`, { ...cand, status });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("candidaturas");
        setAlerta({
          open: true,
          msg: "Status atualizado com sucesso! ✨",
          severity: "success",
        });
      },
    },
  );

  const deleteMutation = useMutation(
    (id: number) => api.delete(`/candidaturas/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("candidaturas");
        setAlerta({
          open: true,
          msg: "Candidatura removida.",
          severity: "info",
        });
        setDeleteId(null);
      },
    },
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
    <Fade in={!isLoading}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Typography
          variant="h3"
          style={{ fontWeight: 900, color: "#004D40", marginBottom: 20 }}
        >
          Inscrições
        </Typography>
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
                    <TableCell className={classes.headerCell}>
                      Candidato
                    </TableCell>
                    <TableCell className={classes.headerCell}>Vaga</TableCell>
                    <TableCell className={classes.headerCell} align="center">
                      Status
                    </TableCell>
                    <TableCell className={classes.headerCell} align="center">
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inscricoes.slice((page - 1) * 7, page * 7).map((insc) => (
                    <TableRow key={insc.id} hover className={classes.row}>
                      <TableCell>
                        <Typography style={{ fontWeight: 600 }}>
                          {insc.nomeCandidato}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {insc.emailCandidato}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ fontWeight: 700, color: "#00ACC1" }}>
                        {insc.tituloVaga || "---"}
                      </TableCell>
                      <TableCell align="center">
                        <FormControl variant="standard">
                          <Select
                            value={insc.status || "em_analise"}
                            onChange={(e) =>
                              updateMutation.mutate({
                                id: insc.id,
                                status: e.target.value as string,
                              })
                            }
                            className={`${classes.selectRoot} ${classes[`status_${insc.status || "em_analise"}` as keyof typeof classes]}`}
                            disableUnderline
                          >
                            <MenuItem value="em_analise">Em Análise</MenuItem>
                            <MenuItem value="aprovado">Aprovado</MenuItem>
                            <MenuItem value="reprovado">Reprovado</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() =>
                            setDeleteId({
                              id: insc.id,
                              nome: insc.nomeCandidato,
                            })
                          }
                          style={{ color: "#d32f2f" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
        <Dialog
          open={Boolean(deleteId)}
          TransitionComponent={Transition}
          onClose={() => setDeleteId(null)}
          PaperProps={{ className: classes.deleteModal }}
          maxWidth="xs"
          fullWidth
        >
          <Box p={3} display="flex" flexDirection="column" alignItems="center">
            <Box className={classes.iconWrapper}>
              <DeleteIcon style={{ fontSize: 40, color: "#e53935" }} />
            </Box>
            <Typography
              variant="h5"
              style={{ fontWeight: 900, color: "#004D40", marginBottom: 10 }}
            >
              Remover Inscrição
            </Typography>
            <DialogContentText
              align="center"
              style={{ color: "#666", fontSize: "1rem" }}
            >
              Você tem certeza que deseja excluir a candidatura de{" "}
              <Box component="strong" style={{ color: "#333" }}>
                {deleteId?.nome}
              </Box>
              ?<Box mt={1}>Ação não permite volta.</Box>
            </DialogContentText>
            <DialogActions
              style={{
                width: "100%",
                justifyContent: "space-between",
                marginTop: 20,
                padding: 0,
              }}
            >
              <Button
                onClick={() => setDeleteId(null)}
                className={classes.btnCancel}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => deleteId && deleteMutation.mutate(deleteId.id)}
                className={classes.btnConfirmDelete}
                variant="contained"
                disableElevation
              >
                Remover Candidato
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
        <Box mt={6} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(inscricoes.length / 7)}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            className={classes.pagination}
          />
        </Box>
      </Container>
    </Fade>
  );
};

export default Inscricoes;
