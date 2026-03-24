import React from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  Grid,
  Fade,
  makeStyles,
} from "@material-ui/core";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "react-query";
import api from "../services/api";
import Loading from "../components/Loading";

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: "25px",
    padding: "30px",
    border: "1px solid #E0F2F1",
    boxShadow: "0px 10px 30px rgba(0, 172, 193, 0.05)",
    backgroundColor: "#FFFFFF",
  },
  title: { fontWeight: 900, color: "#004D40", marginBottom: 20 },
  chartContainer: { height: 300, width: "100%" },
}));

const COLORS = [
  "#00ACC1",
  "#4CAF50",
  "#F57F17",
  "#C62828",
  "#8E24AA",
  "#039BE5",
];

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const { data: vagasData = [], isLoading: loadVagas, isError: errorVagas } = useQuery(
    "estatisticasVagas",
    async () => {
      const res = await api.get("/estatisticas/vagas");
      return res.data;
    },
    { retry: 1 }
  );

  const { data: statusData = [], isLoading: loadStatus, isError: errorStatus } = useQuery(
    "estatisticasStatus",
    async () => {
      const res = await api.get("/estatisticas/status");

      return res.data.map((d: any) => ({
        ...d,
        rotulo:
          d.rotulo === "em_analise"
            ? "Em Análise"
            : d.rotulo === "aprovado"
              ? "Aprovados"
              : d.rotulo === "reprovado"
                ? "Reprovados"
                : d.rotulo,
      }));
    },
    { retry: 1 }
  );

  if (loadVagas || loadStatus) return <Loading />;

  const hasVagas = vagasData.length > 0;
  const isError = errorVagas || errorStatus;

  return (
    <Fade in={true}>
      <Container maxWidth="md" style={{ marginTop: 50, marginBottom: 80 }}>
        <Typography
          variant="h3"
          style={{ fontWeight: 900, color: "#004D40", marginBottom: 30 }}
        >
          Dashboard
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
        ) : !hasVagas ? (
          <Box textAlign="center" py={10} style={{ backgroundColor: "#F9FBFB", borderRadius: 35, border: "2px dashed #B2EBF2" }}>
            <Box fontSize={50} mb={2}>
              📊
            </Box>
            <Typography
              variant="h5"
              style={{ fontWeight: 800, color: "#004D40" }}
            >
              Ainda não há dados suficientes
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Crie vagas e adicione currículos para popular o Dashboard Analítico.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card className={classes.card} elevation={0}>
                <Typography variant="h5" className={classes.title}>
                  Candidaturas por Vaga
                </Typography>
                <Box className={classes.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={vagasData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <XAxis
                        dataKey="rotulo"
                        tick={{
                          fill: "#546E7A",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={120}
                      />
                      <YAxis allowDecimals={false} tick={{ fill: "#546E7A" }} />
                      <Tooltip
                        cursor={{ fill: "rgba(0,172,193,0.1)" }}
                        contentStyle={{
                          borderRadius: 15,
                          border: "none",
                          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="quantidade"
                        fill="#00ACC1"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card className={classes.card} elevation={0}>
                <Typography variant="h5" className={classes.title}>
                  Status das Inscrições
                </Typography>
                <Box className={classes.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="quantidade"
                        nameKey="rotulo"
                      >
                        {statusData.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 15,
                          border: "none",
                          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Fade>
  );
};

export default Dashboard;
