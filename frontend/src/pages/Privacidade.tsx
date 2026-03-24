import React from "react";
import { Container, Typography, Box, Paper, Fade } from "@material-ui/core";

const Privacidade: React.FC = () => {
  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Typography
          variant="h3"
          style={{ fontWeight: 900, color: "#004D40", marginBottom: 30 }}
        >
          Política de Privacidade
        </Typography>

        <Paper
          elevation={0}
          style={{
            padding: 40,
            borderRadius: 20,
            backgroundColor: "#F9FAFB",
            border: "1px solid #E0E0E0",
          }}
        >
          <Box mb={4}>
            <Typography
              variant="h5"
              style={{ fontWeight: 800, color: "#004D40", marginBottom: 15 }}
            >
              1. Coleta de Dados
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ lineHeight: 1.8 }}
            >
              O TalentFlow coleta apenas os dados necessários para otimizar o
              processo de recrutamento, incluindo seu nome completo e e-mail.
              Seus dados são tratados com estreita confidencialidade e
              armazenados de maneira segura em nossos servidores corporativos
              criptografados de ponta a ponta.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography
              variant="h5"
              style={{ fontWeight: 800, color: "#004D40", marginBottom: 15 }}
            >
              2. Uso das Informações
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ lineHeight: 1.8 }}
            >
              As suas informações são estritamente utilizadas para conectá-lo
              com as vagas disponíveis no ecossistema de tecnologia. Não
              vendemos, trocamos ou distribuímos suas informações pessoais
              identificáveis a terceiros sob nenhuma circunstância.
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography
              variant="h5"
              style={{ fontWeight: 800, color: "#004D40", marginBottom: 15 }}
            >
              3. Seus Direitos
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ lineHeight: 1.8 }}
            >
              Você possui controle total sobre suas informações no TalentFlow.
              Você pode, a qualquer instante, solicitar a exclusão da sua
              candidatura à vaga e a remoção completa do seu registro eletrônico
              de nossas bases de dados entrando em contato.
            </Typography>
          </Box>

          <Typography
            variant="body2"
            style={{ color: "#00ACC1", fontWeight: 600, marginTop: 40 }}
          >
            Última atualização: Março de {new Date().getFullYear()}
          </Typography>
        </Paper>
      </Container>
    </Fade>
  );
};

export default Privacidade;
