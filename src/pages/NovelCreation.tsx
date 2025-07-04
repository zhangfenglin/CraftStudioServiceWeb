import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Create as CreateIcon,
  Book as BookIcon,
  AutoStories as AutoStoriesIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NovelCreation: React.FC = () => {
  const navigate = useNavigate();

  const handleMyWorks = () => {
    navigate('/novel-creation/works');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">小说创作</Typography>
            <Typography variant="body2" color="text.secondary">创作您的小说作品</Typography>
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
            小说创作页面
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            这里是小说创作的功能区域
          </Typography>
          
          {/* 功能卡片 */}
          <Grid container spacing={3} maxWidth={800}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <CreateIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" mb={1}>新建小说</Typography>
                  <Typography variant="body2" color="text.secondary">
                    开始创作您的新小说
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  '&:hover': {
                    boxShadow: 6,
                    borderColor: 'primary.main',
                  },
                }}
                onClick={handleMyWorks}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleMyWorks(); }}
              >
                <CardContent>
                  <BookIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" mb={1}>我的作品</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    查看和管理您的小说作品
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <AutoStoriesIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" mb={1}>AI助手</Typography>
                  <Typography variant="body2" color="text.secondary">
                    使用AI辅助创作
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default NovelCreation; 