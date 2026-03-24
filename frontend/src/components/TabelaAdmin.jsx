import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container } from '@material-ui/core';

const AdminTable = ({ candidaturas }) => {
  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '20px', color: '#006064' }}>
        Inscrições Recebidas
      </Typography>
      <TableContainer component={Paper} style={{ borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#E0F7FA' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Candidato</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Vaga</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidaturas.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.nomeCandidato}</TableCell>
                <TableCell>{c.emailCandidato}</TableCell>
                <TableCell>{c.vaga?.titulo || "Vaga Removida"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminTable;