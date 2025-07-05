import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Drawer,
  Fab,
  Zoom,
} from '@mui/material';
import {
  Book as BookIcon,
  Lightbulb as LightbulbIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  RecordVoiceOver as VoiceIcon,
  FormatListBulleted as OutlineIcon,
  Description as ChapterIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '../api/novel.define';

const NovelCreation: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 模拟数据
  const recentWorks = [
    {
      id: '1',
      title: '星辰大海',
      cover: 'https://via.placeholder.com/120x160/e3f2fd/1976d2?text=星辰',
      progress: 75,
      status: '连载中',
      category: 'scifi',
      wordCount: 125000,
      lastUpdate: '2024-01-15',
      rating: 4.8,
    },
    {
      id: '2',
      title: '都市修仙传',
      cover: 'https://via.placeholder.com/120x160/f3e5f5/7b1fa2?text=修仙',
      progress: 45,
      status: '连载中',
      category: 'martial',
      wordCount: 89000,
      lastUpdate: '2024-01-14',
      rating: 4.6,
    },
    {
      id: '3',
      title: '推理小说集',
      cover: 'https://via.placeholder.com/120x160/e8f5e8/388e3c?text=推理',
      progress: 100,
      status: '已完结',
      category: 'mystery',
      wordCount: 156000,
      lastUpdate: '2024-01-10',
      rating: 4.9,
    },
    {
      id: '4',
      title: '都市情感',
      cover: 'https://via.placeholder.com/120x160/fff3e0/f57c00?text=情感',
      progress: 30,
      status: '连载中',
      category: 'urban',
      wordCount: 45000,
      lastUpdate: '2024-01-12',
      rating: 4.5,
    },
  ];

  const stats = {
    totalWorks: 12,
    totalWords: 1250000,
    monthlyWords: 45000,
    completionRate: 68,
    averageRating: 4.7,
  };

  const handleMyWorks = () => {
    navigate('/novel-creation/works');
  };

  const handleCreateNovel = () => {
    navigate('/novels/create');
  };

  const handleVoiceOver = () => {
    // 处理智能配音逻辑
    navigate('/voice-over');
  };

  const handleInspiration = () => {
    // 处理灵感获取逻辑
    console.log('获取灵感');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderQuickActions = () => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e8 100%)',
        border: '1px solid rgba(25, 118, 210, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231976d2" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
        }
      }}
    >
      <Stack spacing={{ xs: 2, md: 3 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1} color="text.primary" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            开始您的创作之旅
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
            释放您的想象力，创作出精彩的故事
          </Typography>
        </Box>
        
        <Grid container spacing={{ xs: 1, md: 2 }}>
          <Grid item xs={6} sm={3}>
            <Card 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.8)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: { xs: 120, md: 140 },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderColor: 'rgba(25, 118, 210, 0.2)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                }
              }}
              onClick={handleCreateNovel}
            >
              <CardContent sx={{ textAlign: 'center', p: { xs: 1, md: 2 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AddIcon sx={{ fontSize: { xs: 32, md: 40 }, mb: 1, color: '#1976d2' }} />
                <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}>新建小说</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  从零开始创作
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.8)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: { xs: 120, md: 140 },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderColor: 'rgba(25, 118, 210, 0.2)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                }
              }}
              onClick={handleMyWorks}
            >
              <CardContent sx={{ textAlign: 'center', p: { xs: 1, md: 2 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <BookIcon sx={{ fontSize: { xs: 32, md: 40 }, mb: 1, color: '#7b1fa2' }} />
                <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}>我的作品</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  管理现有作品
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.8)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: { xs: 120, md: 140 },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderColor: 'rgba(25, 118, 210, 0.2)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                }
              }}
              onClick={handleVoiceOver}
            >
              <CardContent sx={{ textAlign: 'center', p: { xs: 1, md: 2 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <VoiceIcon sx={{ fontSize: { xs: 32, md: 40 }, mb: 1, color: '#388e3c' }} />
                <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}>智能配音</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  为小说生成配音
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.8)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: { xs: 120, md: 140 },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  borderColor: 'rgba(25, 118, 210, 0.2)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                }
              }}
              onClick={handleInspiration}
            >
              <CardContent sx={{ textAlign: 'center', p: { xs: 1, md: 2 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <LightbulbIcon sx={{ fontSize: { xs: 32, md: 40 }, mb: 1, color: '#f57c00' }} />
                <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}>灵感获取</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  激发创作灵感
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );

  const renderStats = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
      <Typography variant="h5" fontWeight="bold" mb={3} color="text.primary">
        创作统计
      </Typography>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center" sx={{ p: { xs: 1, md: 2 } }}>
            <Typography variant="h3" fontWeight="bold" color="#1976d2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {stats.totalWorks}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              总作品数
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center" sx={{ p: { xs: 1, md: 2 } }}>
            <Typography variant="h3" fontWeight="bold" color="#7b1fa2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {(stats.totalWords / 10000).toFixed(1)}万
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              总字数
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center" sx={{ p: { xs: 1, md: 2 } }}>
            <Typography variant="h3" fontWeight="bold" color="#388e3c" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {stats.completionRate}%
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              完成率
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center" sx={{ p: { xs: 1, md: 2 } }}>
            <Typography variant="h3" fontWeight="bold" color="#f57c00" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {stats.averageRating}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              平均评分
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderRecentWorks = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          最近作品
        </Typography>
        <Button 
          variant="outlined" 
          size="medium"
          onClick={handleMyWorks}
          startIcon={<ViewIcon />}
          sx={{
            borderColor: 'rgba(25, 118, 210, 0.3)',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1976d2',
              bgcolor: 'rgba(25, 118, 210, 0.04)',
            }
          }}
        >
          查看全部
        </Button>
      </Stack>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {recentWorks.map((work, index) => (
          <Grid item xs={12} sm={6} lg={3} key={work.id}>
            <Grow in timeout={500 + index * 100}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: 'rgba(25, 118, 210, 0.2)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <img 
                    src={work.cover} 
                    alt={work.title}
                    style={{ 
                      width: '100%', 
                      height: 200, 
                      objectFit: 'cover',
                      borderTopLeftRadius: theme.shape.borderRadius,
                      borderTopRightRadius: theme.shape.borderRadius,
                    }}
                  />
                  <Chip
                    label={work.status}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: work.status === '已完结' ? '#e8f5e8' : '#fff3e0',
                      color: work.status === '已完结' ? '#388e3c' : '#f57c00',
                      fontWeight: 'bold',
                      border: '1px solid',
                      borderColor: work.status === '已完结' ? '#c8e6c9' : '#ffe0b2',
                    }}
                  />
                </Box>
                
                <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                  <Typography variant="h6" fontWeight="bold" mb={1} noWrap color="text.primary">
                    {work.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
                    <Chip 
                      label={CATEGORY_LABELS[work.category] || work.category} 
                      size="small" 
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(25, 118, 210, 0.3)',
                        color: '#1976d2',
                      }}
                    />
                    <Chip 
                      label={`${(work.wordCount / 10000).toFixed(1)}万字`} 
                      size="small" 
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(123, 31, 162, 0.3)',
                        color: '#7b1fa2',
                      }}
                    />
                  </Stack>
                  
                  <Box mb={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        进度
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {work.progress}%
                      </Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={work.progress}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#1976d2',
                        }
                      }}
                    />
                  </Box>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      更新: {work.lastUpdate}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <StarIcon sx={{ fontSize: 16, color: '#f57c00' }} />
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {work.rating}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  <Stack direction="row" spacing={1}>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />} 
                      variant="outlined" 
                      fullWidth
                      sx={{
                        borderColor: 'rgba(25, 118, 210, 0.3)',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1976d2',
                          bgcolor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                    >
                      编辑
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<ViewIcon />} 
                      variant="outlined" 
                      fullWidth
                      sx={{
                        borderColor: 'rgba(123, 31, 162, 0.3)',
                        color: '#7b1fa2',
                        '&:hover': {
                          borderColor: '#7b1fa2',
                          bgcolor: 'rgba(123, 31, 162, 0.04)',
                        }
                      }}
                    >
                      预览
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderTools = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
      <Typography variant="h5" fontWeight="bold" mb={3} color="text.primary">
        创作工具
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <Card sx={{ 
            height: '100%', 
            cursor: 'pointer', 
            transition: 'all 0.3s ease', 
            border: '1px solid rgba(0,0,0,0.05)',
            '&:hover': { 
              transform: 'translateY(-2px)', 
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderColor: 'rgba(25, 118, 210, 0.2)',
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <OutlineIcon sx={{ fontSize: { xs: 40, md: 48 }, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1} color="text.primary">大纲编辑器</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  创建和管理小说大纲
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                size="medium"
                sx={{
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  }
                }}
              >
                开始使用
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={4}>
          <Card sx={{ 
            height: '100%', 
            cursor: 'pointer', 
            transition: 'all 0.3s ease', 
            border: '1px solid rgba(0,0,0,0.05)',
            '&:hover': { 
              transform: 'translateY(-2px)', 
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderColor: 'rgba(123, 31, 162, 0.2)',
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <ChapterIcon sx={{ fontSize: { xs: 40, md: 48 }, color: '#7b1fa2', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1} color="text.primary">章节管理</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  组织和管理章节内容
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                size="medium"
                sx={{
                  bgcolor: '#7b1fa2',
                  '&:hover': {
                    bgcolor: '#6a1b9a',
                  }
                }}
              >
                开始使用
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={4}>
          <Card sx={{ 
            height: '100%', 
            cursor: 'pointer', 
            transition: 'all 0.3s ease', 
            border: '1px solid rgba(0,0,0,0.05)',
            '&:hover': { 
              transform: 'translateY(-2px)', 
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              borderColor: 'rgba(56, 142, 60, 0.2)',
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <TimelineIcon sx={{ fontSize: { xs: 40, md: 48 }, color: '#388e3c', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1} color="text.primary">进度跟踪</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  跟踪创作进度和目标
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                size="medium"
                sx={{
                  bgcolor: '#388e3c',
                  '&:hover': {
                    bgcolor: '#2e7d32',
                  }
                }}
              >
                开始使用
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer}
      PaperProps={{
        sx: { 
          width: 280, 
          p: 2,
          bgcolor: 'white',
          border: '1px solid rgba(0,0,0,0.05)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary">创作工具</Typography>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        <ListItemButton onClick={handleCreateNovel}>
          <ListItemIcon>
            <AddIcon sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText primary="新建小说" />
        </ListItemButton>
        
        <ListItemButton onClick={handleMyWorks}>
          <ListItemIcon>
            <BookIcon sx={{ color: '#7b1fa2' }} />
          </ListItemIcon>
          <ListItemText primary="我的作品" />
        </ListItemButton>
        
        <ListItemButton onClick={handleVoiceOver}>
          <ListItemIcon>
            <VoiceIcon sx={{ color: '#388e3c' }} />
          </ListItemIcon>
          <ListItemText primary="智能配音" />
        </ListItemButton>
        
        <ListItemButton onClick={handleInspiration}>
          <ListItemIcon>
            <LightbulbIcon sx={{ color: '#f57c00' }} />
          </ListItemIcon>
          <ListItemText primary="灵感获取" />
        </ListItemButton>
      </List>
    </Drawer>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: { xs: 2, md: 3 }, 
      flex: 1, 
      pb: 3,
      width: '100%',
    }}>
      {/* 移动端悬浮按钮 */}
      {isMobile && (
        <Zoom in>
          <Fab
            color="primary"
            aria-label="创作工具"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              }
            }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </Fab>
        </Zoom>
      )}

      {/* 主要内容 */}
      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        <Stack spacing={{ xs: 2, md: 3 }} sx={{ width: '100%' }}>
          {/* 快速操作区域 */}
          <Fade in timeout={500}>
            <Box sx={{ width: '100%' }}>
              {renderQuickActions()}
            </Box>
          </Fade>

          {/* 统计信息 */}
          <Fade in timeout={700}>
            <Box sx={{ width: '100%' }}>
              {renderStats()}
            </Box>
          </Fade>

          {/* 最近作品 */}
          <Fade in timeout={900}>
            <Box sx={{ width: '100%' }}>
              {renderRecentWorks()}
            </Box>
          </Fade>

          {/* 创作工具 */}
          <Fade in timeout={1100}>
            <Box sx={{ width: '100%' }}>
              {renderTools()}
            </Box>
          </Fade>
        </Stack>
      </Box>

      {/* 移动端抽屉 */}
      {renderMobileDrawer()}
    </Box>
  );
};

export default NovelCreation; 