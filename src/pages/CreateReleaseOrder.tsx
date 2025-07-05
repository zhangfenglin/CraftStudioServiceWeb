import { Box, Typography, Paper, Breadcrumbs, Link as MuiLink, Button, FormControl, InputLabel, Select, MenuItem, TextField, Grid, Alert, Snackbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Add as AddIcon, Home as HomeIcon } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../api/projects';
import { createReleaseOrder } from '../api/release-orders';
import type { Project } from '../api/project.define';
import { ErrorCode } from '../api/errorCodes';

const CreateReleaseOrder = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [releaseTitle, setReleaseTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [pageSize] = useState<number>(10);

  // 获取项目列表
  const fetchProjects = async (page: number = 1, append: boolean = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await getProjects({ page, page_size: pageSize });
      if (response.data?.code === ErrorCode.SUCCESS || response.data?.code === 1) {
        if (response.data?.data?.list) {
          const newProjects = response.data.data.list;
          if (append) {
            setProjects(prev => [...prev, ...newProjects]);
          } else {
            setProjects(newProjects);
          }
          
          // 检查是否还有更多数据
          const total = response.data.data.total || 0;
          const currentTotal = append ? projects.length + newProjects.length : newProjects.length;
          setHasMore(currentTotal < total);
          console.log(`加载第${page}页，共${newProjects.length}个项目，总计${currentTotal}/${total}`);
        }
      } else {
        console.error('获取项目列表失败:', response.data?.msg);
      }
    } catch (error) {
      console.error('获取项目列表失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 加载更多项目
  const loadMoreProjects = useCallback(() => {
    if (!loadingMore && hasMore) {
      console.log('触发加载更多');
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProjects(nextPage, true);
    }
  }, [loadingMore, hasMore, currentPage]);

  // 监听菜单滚动事件 - 现在使用Material-UI的内置onScroll属性
  useEffect(() => {
    if (isMenuOpen) {
      console.log('菜单已打开，准备监听滚动事件');
    }
  }, [isMenuOpen]);

  useEffect(() => {
    fetchProjects(1, false);
  }, []);

  // 提交发布单
  const handleSubmit = async () => {
    if (!releaseTitle.trim()) {
      setSnackbar({
        open: true,
        message: '请输入发布单标题',
        severity: 'error'
      });
      return;
    }

    if (!selectedProject) {
      setSnackbar({
        open: true,
        message: '请选择项目',
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);
    try {
      const requestData = {
        name: releaseTitle.trim(),
        desc: '',
        project_id: parseInt(selectedProject, 10)
      };

      const response = await createReleaseOrder(requestData);
      if (response.data?.code === ErrorCode.SUCCESS || response.data?.code === 1) {
        setSnackbar({
          open: true,
          message: '发布单创建成功！',
          severity: 'success'
        });
        // 清空表单
        setReleaseTitle('');
        setSelectedProject('');
      } else {
        setSnackbar({
          open: true,
          message: response.data?.msg || '创建失败',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('创建发布单失败:', error);
      setSnackbar({
        open: true,
        message: '创建发布单失败，请重试',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    if (!releaseTitle.trim() && !selectedProject) {
      setSnackbar({
        open: true,
        message: '请至少填写标题或选择项目',
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);
    try {
      const requestData = {
        name: releaseTitle.trim() || '草稿',
        desc: '',
        project_id: selectedProject ? parseInt(selectedProject, 10) : 0
      };

      const response = await createReleaseOrder(requestData);
      if (response.data?.code === ErrorCode.SUCCESS || response.data?.code === 1) {
        setSnackbar({
          open: true,
          message: '草稿保存成功！',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data?.msg || '保存失败',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('保存草稿失败:', error);
      setSnackbar({
        open: true,
        message: '保存草稿失败，请重试',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
            onClick={handleSaveDraft}
            disabled={submitting}
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
            {submitting ? '保存中...' : '保存草稿'}
          </Button>
        </Box>
      </Paper>

      {/* Form Area */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>发布内容</Typography>
        
        <Grid container spacing={3}>
          {/* 发布单标题 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="release-title"
              label="发布单标题"
              variant="outlined"
              placeholder="请输入发布单标题"
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
            />
          </Grid>
          
          {/* 项目选择 */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="project-select-label">选择项目</InputLabel>
              <Select
                labelId="project-select-label"
                id="project-select"
                label="选择项目"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={loading}
                onOpen={() => {
                  setIsMenuOpen(true);
                  // 当下拉框打开时，如果还没有数据且不在加载中，则加载第一页
                  if (projects.length === 0 && !loading) {
                    fetchProjects(1, false);
                  }
                }}
                onClose={() => {
                  setIsMenuOpen(false);
                }}
                MenuProps={{
                  PaperProps: {
                    onScroll: (e: React.UIEvent<HTMLElement>) => {
                      const target = e.target as HTMLElement;
                      const { scrollTop, scrollHeight, clientHeight } = target;
                      const scrollThreshold = 20;
                      
                      console.log('滚动事件:', {
                        scrollTop,
                        scrollHeight,
                        clientHeight,
                        remaining: scrollHeight - scrollTop - clientHeight,
                        loadingMore,
                        hasMore
                      });
                      
                      if (scrollHeight - scrollTop - clientHeight < scrollThreshold && !loadingMore && hasMore) {
                        console.log('触发滚动加载');
                        loadMoreProjects();
                      }
                    },
                    style: {
                      maxHeight: 300 // 设置下拉框最大高度
                    }
                  }
                }}
              >
                <MenuItem value="">
                  <em>请选择项目</em>
                </MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
                {loadingMore && (
                  <MenuItem 
                    value="loading" 
                    disabled
                    sx={{ 
                      justifyContent: 'center',
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    }}
                  >
                    加载中...
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* 操作按钮 */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleSaveDraft}
            disabled={submitting}
          >
            {submitting ? '保存中...' : '保存草稿'}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !releaseTitle.trim() || !selectedProject}
          >
            {submitting ? '提交中...' : '提交发布单'}
          </Button>
        </Box>
      </Paper>
      
      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
  );
};

export default CreateReleaseOrder; 