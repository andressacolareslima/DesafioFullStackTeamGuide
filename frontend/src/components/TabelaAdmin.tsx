import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Container, makeStyles 
} from '@material-ui/core';

// Definindo a interface para a Candidatura (Essencial para o TS)
interface Candidatura {
  id: number;
  nomeCandidato: string;
  emailCandidato: string;
  vaga?: {
    titulo: string;
  };
}

interface AdminTableProps {
  candidaturas: Candidatura[];
}

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '40px',
    marginBottom: '40px',
  },
  tableContainer: {
    borderRadius: '25px', // Seguindo o padrão arredondado do TalentFlow
    boxShadow: '0px 10px 30px rgba(0, 172, 193, 0.08)',
    overflow: 'hidden', // Garante que o fundo colorido não escape das bordas arredondadas
    border: '1px solid #E0F2F1',
  },
  headerCell: {
    fontWeight: 900,
    color: '#004D40',
    fontSize: '1rem',
    borderBottom: '2px solid #B2EBF2',
  },
  row: {
    '&:hover': {
      backgroundColor: '#F9FBFB',
    },
  },
  vagaText: {
    fontWeight: 700,
    color: '#00ACC1',
  }
}));

const AdminTable: React.FC<AdminTableProps> = ({ candidaturas }) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h4" style={{ fontWeight: 900, marginBottom: '30px', color: '#004D40' }}>
        Inscrições Recebidas
      </Typography>
      
      <TableContainer component={Paper} className={classes.tableContainer} elevation={0}>
        <Table>
          <TableHead style={{ backgroundColor: '#E0F7FA' }}>
            <TableRow>
              <TableCell className={classes.headerCell}>Candidato</TableCell>
              <TableCell className={classes.headerCell}>E-mail</TableCell>
              <TableCell className={classes.headerCell}>Vaga Alvo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidaturas.map((c) => (
              <TableRow key={c.id} className={classes.row}>
                <TableCell style={{ fontWeight: 500 }}>{c.nomeCandidato}</TableCell>
                <TableCell>{c.emailCandidato}</TableCell>
                <TableCell className={classes.vagaText}>
                  {c.vaga?.titulo || "Vaga Removida"}
                </TableCell>
              </TableRow>
            ))}
            {candidaturas.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" style={{ padding: '40px', color: '#999' }}>
                  Nenhuma inscrição encontrada no momento.
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