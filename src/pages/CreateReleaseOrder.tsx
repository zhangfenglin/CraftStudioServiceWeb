import { Box, Typography, Paper, Breadcrumbs, Link as MuiLink, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Add as AddIcon, Home as HomeIcon } from '@mui/icons-material';

const CreateReleaseOrder = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      {/* Header */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Breadcrumbs 
          aria-label="breadcrumb"
          sx={{
            mb: 2,
            '& .MuiBreadcrumbs-separator': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          <MuiLink
            component={RouterLink}
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                color: 'white',
                textDecoration: 'none'
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            首页
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to="/release-orders"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                color: 'white',
                textDecoration: 'none'
              }
            }}
          >
            发布单管理
          </MuiLink>
          <Typography color="white">新建发布单</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">新建发布单</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>在这里填写并提交您的发布请求</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            保存草稿
          </Button>
        </Box>
      </Paper>

      {/* Form Area */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
        <Typography variant="h6">发布内容（占位）</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          这里将是未来填充表单元素的区域，例如选择项目、填写版本号、添加发布说明等。
        </Typography>
      </Paper>
    </Box>
  );
};

export default CreateReleaseOrder; 