import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Stack, 
  Alert, 
  Snackbar,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Checkbox,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Sort as SortIcon,
  AccessTime as TimeIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { createProject, deleteProject, getProjects, updateProject, getProject } from '../api/projects';
import type { Project } from '../api/project.define';
import ProjectDetail from '../components/ProjectDetail';
import ProjectForm from '../components/ProjectForm';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ErrorCode } from '../api/errorCodes';

const Projects = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [listLoading, setListLoading] = useState(false);
  
  // 查看详情相关状态
  const [detailOpen, setDetailOpen] = useState(false);
  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 新增功能状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // 使用错误处理 Hook
  const { errorState, handleError, clearError } = useErrorHandler();

  // 获取项目列表
  const fetchProjects = async () => {
    setListLoading(true);
    clearError(); // 清除之前的错误
    
    try {
      const response = await getProjects({ page: 1, size: 10 });
      if (response.data.code === ErrorCode.SUCCESS || response.data.code === 1) {
        setProjects(response.data.data.list);
      } else {
        // 处理业务错误
        handleError({
          code: response.data.code,
          message: response.data.msg || '获取项目列表失败',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setListLoading(false);
    }
  };

  // 页面加载时获取项目列表
  useEffect(() => {
    fetchProjects();
  }, []);

  // 过滤和搜索项目
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && project.status === 1) ||
                         (filterStatus === 'completed' && project.status === 2);
    return matchesSearch && matchesFilter;
  });

  // 排序项目
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date': {
        // Safely parse dates before comparing
        const dateA = a.created_at ? new Date(a.created_at.split('/').join('-')).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at.split('/').join('-')).getTime() : 0;
        return dateB - dateA;
      }
      default:
        return 0;
    }
  });

  const handleOpen = () => {
    setIsEdit(false);
    setCurrentProject(null);
    setOpen(true);
  };

  const handleEdit = (project: Project) => {
    setIsEdit(true);
    setCurrentProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setCurrentProject(null);
  };

  // 查看项目详情
  const handleViewDetail = async (id: string) => {
    setDetailLoading(true);
    clearError();
    
    try {
      const response = await getProject(id);
      if (response.data.code === ErrorCode.SUCCESS || response.data.code === 1) {
        setProjectDetail(response.data.data);
        setDetailOpen(true);
      } else {
        handleError({
          code: response.data.code,
          message: response.data.msg || '获取项目详情失败',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setProjectDetail(null);
  };

  // 处理表单提交
  const handleSubmit = async (formData: { name: string; desc: string }) => {
    setLoading(true);
    clearError();
    
    console.log('开始提交表单:', { isEdit, formData });
    console.log('当前环境:', import.meta.env.MODE);
    console.log('API BaseURL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1');
    
    try {
      if (isEdit && currentProject) {
        // 编辑项目
        console.log('编辑项目:', currentProject.id, formData);
        console.log('调用接口: PUT /projects/' + currentProject.id);
        const response = await updateProject(currentProject.id, formData);
        console.log('编辑项目响应:', response);
        
        if (response.data.code === ErrorCode.SUCCESS || response.data.code === 1) {
          setSnackbar({
            open: true,
            message: '更新成功',
            severity: 'success'
          });
          handleClose();
          fetchProjects();
        } else {
          handleError({
            code: response.data.code,
            message: response.data.msg || '更新失败',
            timestamp: new Date().toISOString()
          });
        }
      } else {
        // 创建项目
        console.log('创建项目:', formData);
        console.log('调用接口: POST /projects');
        const response = await createProject(formData);
        console.log('创建项目响应:', response);
        
        if (response.data.code === ErrorCode.SUCCESS || response.data.code === 1) {
          setSnackbar({
            open: true,
            message: '创建成功',
            severity: 'success'
          });
          handleClose();
          fetchProjects();
        } else {
          handleError({
            code: response.data.code,
            message: response.data.msg || '创建失败',
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await deleteProject(id);
      if (response.data.code === ErrorCode.SUCCESS || response.data.code === 1) {
        setSnackbar({
          open: true,
          message: '删除成功',
          severity: 'success'
        });
        fetchProjects();
      } else {
        handleError({
          code: response.data.code,
          message: response.data.msg || '删除失败',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedProjects.length === 0) return;
    
    setLoading(true);
    clearError();
    
    try {
      // 这里应该调用批量删除API
      for (const id of selectedProjects) {
        await deleteProject(id);
      }
      setSnackbar({
        open: true,
        message: `成功删除 ${selectedProjects.length} 个项目`,
        severity: 'success'
      });
      setSelectedProjects([]);
      fetchProjects();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 全选/取消全选
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProjects(sortedProjects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  // 选择单个项目
  const handleSelectProject = (id: string) => {
    setSelectedProjects(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 头部区域 */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        mb: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700} mb={1}>
              项目管理
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              管理您的创意作品和项目
            </Typography>
          </Box>
          <Badge badgeContent={projects.length} color="secondary">
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h6" fontWeight={600}>
                项目总数
              </Typography>
            </Box>
          </Badge>
        </Stack>
      </Paper>

      {/* 功能区 */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        borderRadius: 3, 
        background: '#fff',
        mb: 2,
        border: '1px solid #e0e3e7'
      }}>
        <Stack spacing={2}>
          {/* 搜索和操作栏 */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={2}>
            {/* 搜索框 */}
            <TextField
              size="small"
              placeholder="搜索项目名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* 筛选按钮 */}
            <Tooltip title="筛选">
              <IconButton 
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{ border: '1px solid #e0e3e7' }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>

            {/* 排序按钮 */}
            <Tooltip title="排序">
              <IconButton 
                onClick={(e) => setSortAnchorEl(e.currentTarget)}
                sx={{ border: '1px solid #e0e3e7' }}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>

            {/* 视图切换 */}
            <Stack direction="row" spacing={1}>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('table')}
              >
                表格
              </Button>
              <Button
                variant={viewMode === 'card' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('card')}
              >
                卡片
              </Button>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            {/* 操作按钮 */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="刷新">
                <IconButton onClick={fetchProjects} disabled={listLoading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              {selectedProjects.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleBatchDelete}
                  disabled={loading}
                >
                  批量删除 ({selectedProjects.length})
                </Button>
              )}
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  }
                }}
              >
                新建项目
              </Button>
            </Stack>
          </Stack>

          {/* 筛选菜单 */}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            <MenuItem onClick={() => { setFilterStatus('all'); setFilterAnchorEl(null); }}>
              全部项目
            </MenuItem>
            <MenuItem onClick={() => { setFilterStatus('active'); setFilterAnchorEl(null); }}>
              活跃项目
            </MenuItem>
            <MenuItem onClick={() => { setFilterStatus('completed'); setFilterAnchorEl(null); }}>
              已完成
            </MenuItem>
          </Menu>

          {/* 排序菜单 */}
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={() => setSortAnchorEl(null)}
          >
            <MenuItem onClick={() => { setSortBy('name'); setSortAnchorEl(null); }}>
              按名称排序
            </MenuItem>
            <MenuItem onClick={() => { setSortBy('date'); setSortAnchorEl(null); }}>
              按创建时间排序
            </MenuItem>
          </Menu>

          {/* 统计信息 */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              label={`共 ${projects.length} 个项目`} 
              color="primary" 
              variant="outlined" 
            />
            {searchTerm && (
              <Chip 
                label={`搜索结果: ${filteredProjects.length} 个`} 
                color="secondary" 
                variant="outlined"
                onDelete={() => setSearchTerm('')}
              />
            )}
            {filterStatus !== 'all' && (
              <Chip 
                label={`筛选: ${filterStatus}`} 
                color="info" 
                variant="outlined"
                onDelete={() => setFilterStatus('all')}
              />
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* 内容区域 */}
      <Paper elevation={0} sx={{ 
        flex: 1, 
        borderRadius: 3, 
        background: '#fff',
        border: '1px solid #e0e3e7',
        overflow: 'hidden'
      }}>
        {listLoading && <LinearProgress />}
        
        {viewMode === 'table' ? (
          <TableContainer sx={{ height: '100%' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedProjects.length > 0 && selectedProjects.length < sortedProjects.length}
                      checked={selectedProjects.length > 0 && selectedProjects.length === sortedProjects.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>项目名称</TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>创建时间</TableCell>
                  <TableCell>更新时间</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="text.secondary" mb={1}>
                        {searchTerm ? '没有找到匹配的项目' : '暂无项目数据'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? '请尝试调整搜索条件' : '点击"新建项目"开始创建您的第一个项目'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProjects.map((project) => (
                    <TableRow 
                      key={project.id}
                      hover
                      selected={selectedProjects.includes(project.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => handleSelectProject(project.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {project.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {project.desc}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={project.status === 1 ? '进行中' : '已完成'} 
                          size="small"
                          color={project.status === 2 ? 'success' : 'primary'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {project.created_at ? new Date(project.created_at.split('/').join('-')).toLocaleString() : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {project.updated_at ? new Date(project.updated_at.split('/').join('-')).toLocaleString() : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="查看详情">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetail(project.id)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="编辑">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(project)}
                              color="info"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(project.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // 卡片视图
          <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            {sortedProjects.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" mb={1}>
                  {searchTerm ? '没有找到匹配的项目' : '暂无项目数据'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? '请尝试调整搜索条件' : '点击"新建项目"开始创建您的第一个项目'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {sortedProjects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Checkbox
                            checked={selectedProjects.includes(project.id)}
                            onChange={() => handleSelectProject(project.id)}
                          />
                          <Chip 
                            label={project.status === 1 ? '进行中' : '已完成'} 
                            size="small"
                            color={project.status === 2 ? 'success' : 'primary'}
                          />
                        </Stack>
                        
                        <Typography variant="h6" fontWeight={600} mb={1} noWrap>
                          {project.name}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" mb={2} sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {project.desc}
                        </Typography>
                        
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                           <Stack direction="row" alignItems="center" spacing={0.5}>
                             <TimeIcon sx={{ fontSize: '0.875rem' }} color="action" />
                             <Typography variant="caption" color="text.secondary" display="block">
                               {project.created_at ? new Date(project.created_at.split('/').join('-')).toLocaleDateString() : '-'}
                             </Typography>
                           </Stack>
                           <Stack direction="row" alignItems="center" spacing={0.5}>
                            <UpdateIcon sx={{ fontSize: '0.875rem' }} color="action" />
                             <Typography variant="caption" color="text.secondary" display="block">
                               {project.updated_at ? new Date(project.updated_at.split('/').join('-')).toLocaleDateString() : '-'}
                             </Typography>
                           </Stack>
                         </Stack>
                        
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="查看详情">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetail(project.id)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="编辑">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(project)}
                              color="info"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(project.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Paper>
      
      {/* 项目表单组件 */}
      <ProjectForm
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        project={currentProject}
        isEdit={isEdit}
        loading={loading}
        error={errorState.error}
        onClearError={clearError}
      />

      {/* 项目详情组件 */}
      <ProjectDetail
        open={detailOpen}
        onClose={handleDetailClose}
        project={projectDetail}
        loading={detailLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* 错误显示组件 */}
      <ErrorDisplay 
        error={errorState.error}
        onClose={clearError}
        onRetry={fetchProjects}
        showDetails={false}
      />
    </Box>
  );
};

export default Projects; 