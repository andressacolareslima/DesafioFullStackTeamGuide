import React from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';

const Loading = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh" width="100%">
    <CircularProgress style={{ color: '#00ACC1', marginBottom: '20px' }} />
    <Typography variant="body1" color="textSecondary">Carregando dados da UFC...</Typography>
  </Box>
);

export default Loading;