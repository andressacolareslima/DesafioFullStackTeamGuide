import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  makeStyles,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { useMutation, useQueryClient } from "react-query";
import api from "../services/api";

interface Candidatura {
  id: number;
  nomeCandidato: string;
  emailCandidato: string;
  status: "em_analise" | "aprovado" | "reprovado";
  vaga?: {
    titulo: string;
  };
}

interface AdminTableProps {
  candidaturas: Candidatura[];
  setAlerta: (alerta: any) => void;
}

const useStyles = makeStyles(() => ({
  container: { marginTop: "40px", marginBottom: "40px" },
  tableContainer: {
    borderRadius: "25px",
    boxShadow: "0px 10px 30px rgba(0, 172, 193, 0.08)",
    overflow: "hidden",
    border: "1px solid #E0F2F1",
  },
  headerCell: {
    fontWeight: 900,
    color: "#004D40",
    fontSize: "1rem",
    borderBottom: "2px solid #B2EBF2",
  },
  row: { "&:hover": { backgroundColor: "#F9FBFB" } },
  vagaText: { fontWeight: 700, color: "#00ACC1" },
  selectRoot: {
    padding: "6px 14px",
    borderRadius: "12px",
    fontWeight: 800,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    minWidth: "135px",
    textAlign: "center",
    "& .MuiSelect-select:focus": { backgroundColor: "transparent" },
  },
  statusAprovado: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
  statusReprovado: { backgroundColor: "#FFEBEE", color: "#C62828" },
  statusAnalise: { backgroundColor: "#FFFDE7", color: "#F57F17" },
  btnDelete: {
    color: "#d32f2f",
    transition: "0.2s",
    "&:hover": { transform: "scale(1.1)" },
  },
}));

const AdminTable: React.FC<AdminTableProps> = ({ candidaturas, setAlerta }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    async ({ id, status }: { id: number; status: string }) => {
      return api.patch(`/candidaturas/${id}`, { status });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("candidaturas");
        setAlerta({
          open: true,
          msg: "Status atualizado!",
          severity: "success",
        });
      },
      onError: () =>
        setAlerta({
          open: true,
          msg: "Erro ao atualizar status.",
          severity: "error",
        }),
    },
  );

  const deleteMutation = useMutation(
    (id: number) => api.delete(`/candidaturas/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("candidaturas");
        setAlerta({
          open: true,
          msg: "Candidatura removida com sucesso.",
          severity: "info",
        });
      },
      onError: () =>
        setAlerta({
          open: true,
          msg: "Erro ao excluir candidatura.",
          severity: "error",
        }),
    },
  );

  const handleExcluir = (id: number, nome: string) => {
    if (window.confirm(`Remover a candidatura de ${nome}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "aprovado":
        return classes.statusAprovado;
      case "reprovado":
        return classes.statusReprovado;
      default:
        return classes.statusAnalise;
    }
  };

  return (
    <Container className={classes.container}>
      <Typography
        variant="h4"
        style={{ fontWeight: 900, marginBottom: "30px", color: "#004D40" }}
      >
        Gerenciar Inscrições
      </Typography>

      <TableContainer
        component={Paper}
        className={classes.tableContainer}
        elevation={0}
      >
        <Table>
          <TableHead style={{ backgroundColor: "#E0F7FA" }}>
            <TableRow>
              <TableCell className={classes.headerCell}>Candidato</TableCell>
              <TableCell className={classes.headerCell}>E-mail</TableCell>
              <TableCell className={classes.headerCell}>Vaga Alvo</TableCell>
              <TableCell className={classes.headerCell} align="center">
                Status
              </TableCell>
              <TableCell className={classes.headerCell} align="center">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidaturas.map((c) => (
              <TableRow key={c.id} className={classes.row}>
                <TableCell style={{ fontWeight: 600 }}>
                  {c.nomeCandidato}
                </TableCell>
                <TableCell>{c.emailCandidato}</TableCell>
                <TableCell className={classes.vagaText}>
                  {c.vaga?.titulo || "Vaga Removida"}
                </TableCell>

                <TableCell align="center">
                  <FormControl variant="standard">
                    <Select
                      value={c.status}
                      onChange={(e) =>
                        updateMutation.mutate({
                          id: c.id,
                          status: e.target.value as string,
                        })
                      }
                      className={`${classes.selectRoot} ${getStatusStyle(c.status)}`}
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
                    className={classes.btnDelete}
                    onClick={() => handleExcluir(c.id, c.nomeCandidato)}
                    disabled={deleteMutation.isLoading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {candidaturas.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  style={{ padding: "60px", color: "#90A4AE", fontWeight: 500 }}
                >
                  Nenhum candidato inscrito no momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminTable;
