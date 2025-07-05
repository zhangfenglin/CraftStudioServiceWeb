import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CreateWorkflow: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/workflows');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {/* Header */}
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
            size="small"
          >
            返回
          </Button>
          <Box>
            <Typography variant="h5" fontWeight="bold">新建工作流</Typography>
            <Typography variant="body2" color="text.secondary">创建新的业务流程工作流</Typography>
          </Box>
        </Stack>
      </Paper>
      
      {/* Content */}
      <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          minHeight: 400
        }}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            工作流创建页面
          </Typography>
          <Typography variant="body2" color="text.secondary">
            这里是新建工作流的页面内容区域
          </Typography>
        </Box>
      </Paper>
      </Box>
  );
};

export default CreateWorkflow; 