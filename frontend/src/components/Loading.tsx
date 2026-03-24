import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    width: "100%",
  },
  text: {
    marginTop: "20px",
    fontWeight: 600,
    color: "#006064",
    letterSpacing: "1px",
    animation: "$pulse 1.5s infinite ease-in-out",
  },

  "@keyframes pulse": {
    "0%": { opacity: 0.5 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0.5 },
  },
}));

const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.loadingContainer}>
      <CircularProgress size={50} thickness={5} style={{ color: "#00ACC1" }} />
      <Typography variant="body1" className={classes.text}>
        Sincronizando TalentFlow...
      </Typography>
    </Box>
  );
};

export default Loading;
