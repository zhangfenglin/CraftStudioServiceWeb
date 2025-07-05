import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CreateNovel: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <Paper sx={{ p: 6, borderRadius: 2, minWidth: 320, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          创建小说
        </Typography>
        <Typography variant="body1" color="text.secondary">
          敬请期待
        </Typography>
      </Paper>
    </Box>
  );
};

export default CreateNovel; 