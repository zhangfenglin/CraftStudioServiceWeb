import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
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
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Menu,
  Paper,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  Update as UpdateIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
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
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  // 使用错误处理 Hook
  const { errorState, handleError, clearError } = useErrorHandler();

  // 获取项目列表
  const fetchProjects = async (page = pagination.page, size = pagination.size) => {
    setListLoading(true);
    clearError(); // 清除之前的错误
    
    try {
      const response = await getProjects({ page, page_size: size });
      if (response.data.code === ErrorCode.SUCCESS || response.data.code === 1) {
        setProjects(response.data.data.list);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.total,
          page: page,
          size: size,
        }));
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
        // Check if it's the last item on a page > 1
        if (sortedProjects.length === 1 && pagination.page > 1) {
          fetchProjects(pagination.page - 1, pagination.size);
        } else {
          fetchProjects(pagination.page, pagination.size);
        }
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
      const promises = selectedProjects.map(id => deleteProject(id));
      // This will throw if any of the promises reject
      await Promise.all(promises);

      setSnackbar({
        open: true,
        message: `成功删除 ${selectedProjects.length} 个项目`,
        severity: 'success'
      });

      // Check if all items on the current page were deleted on a page > 1
      if (selectedProjects.length === sortedProjects.length && pagination.page > 1) {
        fetchProjects(pagination.page - 1, pagination.size);
      } else {
        fetchProjects(pagination.page, pagination.size);
      }
      setSelectedProjects([]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 全选/取消全选
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProjects(sortedProjects.map((p) => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  // 选择单个项目
  const handleSelectProject = (id: string) => {
    setSelectedProjects(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    fetchProjects(newPage, pagination.size);
  };

  const handleRowsPerPageChange = (event: { target: { value: string } }) => {
    const newSize = parseInt(event.target.value, 10);
    fetchProjects(1, newSize);
  };

  const handleRefresh = () => {
    fetchProjects(pagination.page, pagination.size);
    setSnackbar({ open: true, message: '列表已刷新', severity: 'success' });
  };

  const renderTable = () => (
    <TableContainer>
      <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                backgroundColor: 'grey.100',
                fontWeight: 'bold',
                color: 'grey.700',
                borderBottom: '2px solid',
                borderColor: 'divider',
              },
            }}
          >
            <TableCell padding="checkbox" sx={{ width: '5%' }}>
              <Checkbox
                indeterminate={selectedProjects.length > 0 && selectedProjects.length < sortedProjects.length}
                checked={selectedProjects.length > 0 && selectedProjects.length === sortedProjects.length}
                onChange={handleSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell sx={{ width: '23%' }}>项目名称</TableCell>
            <TableCell sx={{ width: '20%' }}>描述</TableCell>
            <TableCell sx={{ width: '10%' }}>状态</TableCell>
            <TableCell sx={{ width: '15%' }}>创建时间</TableCell>
            <TableCell sx={{ width: '15%' }}>更新时间</TableCell>
            <TableCell align="center" sx={{ width: '10%' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 8, border: 0 }}>
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
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => handleSelectProject(project.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={project.name} arrow>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {project.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={project.desc} arrow>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {project.desc}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={project.status === 1 ? '进行中' : '已完成'} 
                    size="small"
                    color={project.status === 1 ? 'info' : 'success'}
                    variant="filled"
                    sx={{
                      color: 'white',
                      fontWeight: 500
                    }}
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
                        color="default"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(project)}
                        color="primary"
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
  );

  const renderCardView = () => (
    <Box sx={{ p: 3 }}>
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
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                    borderColor: 'primary.main',
                  },
                  ...(selectedProjects.includes(project.id) && {
                    boxShadow: 3,
                    borderColor: 'primary.main',
                  })
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      color="primary"
                      sx={{ p: 0, m: 1 }}
                    />
                    <Chip 
                      label={project.status === 1 ? '进行中' : '已完成'} 
                      size="small"
                      color={project.status === 1 ? 'info' : 'success'}
                      variant="filled"
                      sx={{ color: 'white', fontWeight: 500 }}
                    />
                  </Stack>
                  
                  <Typography variant="h6" fontWeight={600} mb={1} noWrap>
                    {project.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" mb={2} sx={{
                    flexGrow: 1,
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
                        color="default"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(project)}
                        color="primary"
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
  );

  const totalPages = Math.ceil(pagination.total / pagination.size);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">项目管理</Typography>
            <Typography variant="body2" color="text.secondary">管理您的创意作品和项目</Typography>
          </Box>
          <Badge badgeContent={pagination.total} color="primary">
            <Typography variant="h6">项目总数</Typography>
          </Badge>
        </Stack>
      </Paper>

      {/* Toolbar */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <TextField
              placeholder="搜索项目"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <Tooltip title="筛选">
              <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="排序">
              <IconButton onClick={(e) => setSortAnchorEl(e.currentTarget)}>
                <SortIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              size="small"
            >
              表格
            </Button>
            <Button
              variant={viewMode === 'card' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('card')}
              size="small"
            >
              卡片
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
              新建
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              disabled={selectedProjects.length === 0}
            >
              删除 ({selectedProjects.length})
            </Button>
          </Stack>
          {(searchTerm || filterStatus !== 'all') && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">筛选条件:</Typography>
              {searchTerm && <Chip label={`搜索: "${searchTerm}"`} onDelete={() => setSearchTerm('')} />}
              {filterStatus !== 'all' && <Chip label={`状态: ${filterStatus}`} onDelete={() => setFilterStatus('all')} />}
            </Stack>
          )}
        </Stack>
      </Paper>

      <ErrorDisplay error={errorState.error} />

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem onClick={() => { setFilterStatus('all'); setFilterAnchorEl(null); }}>全部</MenuItem>
        <MenuItem onClick={() => { setFilterStatus('active'); setFilterAnchorEl(null); }}>活跃</MenuItem>
        <MenuItem onClick={() => { setFilterStatus('completed'); setFilterAnchorEl(null); }}>完成</MenuItem>
      </Menu>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        <MenuItem onClick={() => { setSortBy('name'); setSortAnchorEl(null); }}>按名称</MenuItem>
        <MenuItem onClick={() => { setSortBy('date'); setSortAnchorEl(null); }}>按日期</MenuItem>
      </Menu>

      <Paper sx={{ flex: 1, minHeight: 0, borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {listLoading ? (
            <LinearProgress />
          ) : viewMode === 'table' ? (
            renderTable()
          ) : (
            renderCardView()
          )}
        </Box>

        {totalPages > 0 && (
          <Stack 
            direction="row" 
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'center', p: 2, borderTop: '1px solid #e0e0e0' }}
          >
            <Pagination
              count={totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="rows-per-page-label">每页显示</InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={String(pagination.size)}
                label="每页显示"
                onChange={(e) => handleRowsPerPageChange(e)}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
      </Paper>

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

      <ProjectDetail 
        open={detailOpen}
        onClose={handleDetailClose}
        project={projectDetail}
        loading={detailLoading}
      />
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Projects; 