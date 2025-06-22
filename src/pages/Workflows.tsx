import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
  Chip,
  Pagination,
  CircularProgress,
  Checkbox,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getWorkflows } from '../api/workflows';
import type { Workflow } from '../api/workflow.define';
import { ErrorCode } from '../api/errorCodes';

const Workflows: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  
  // 筛选条件
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 新增功能状态
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // 获取工作流列表
  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
        query: searchKeyword || undefined,
        status: statusFilter === '' ? undefined : statusFilter as 'draft' | 'active' | 'inactive'
      };

      const response = await getWorkflows(params);
      if (response.data?.code === ErrorCode.SUCCESS || response.data?.code === 1) {
        setWorkflows(response.data.data.list || []);
        setTotal(response.data.data.total || 0);
      } else {
        console.error('获取工作流列表失败:', response.data?.msg);
      }
    } catch (error) {
      console.error('获取工作流列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchWorkflows();
  }, [currentPage, searchKeyword, statusFilter]);

  // 刷新数据
  const handleRefresh = () => {
    fetchWorkflows();
  };

  // 处理搜索
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurrentPage(1);
      fetchWorkflows();
    }
  };

  // 处理筛选
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchWorkflows();
  };

  // 批量选择相关函数
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedWorkflows(workflows.map(workflow => workflow.id));
    } else {
      setSelectedWorkflows([]);
    }
  };

  const handleSelectWorkflow = (id: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    // TODO: 实现批量删除功能
    console.log('批量删除工作流:', selectedWorkflows);
  };

  // 获取状态显示文本和颜色
  const getStatusInfo = (status: 'draft' | 'active' | 'inactive') => {
    switch (status) {
      case 'draft':
        return { text: '草稿', color: 'default' as const };
      case 'active':
        return { text: '活跃', color: 'success' as const };
      case 'inactive':
        return { text: '停用', color: 'error' as const };
      default:
        return { text: '未知', color: 'default' as const };
    }
  };

  // 格式化时间
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN');
    } catch {
      return timeStr;
    }
  };

  const handleCreate = () => {
    navigate('/workflows/create');
  };

  const handleView = (id: string) => {
    navigate(`/workflows/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/workflows/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    // TODO: 实现删除功能
    console.log('删除工作流:', id);
  };

  // 渲染表格视图
  const renderTable = () => (
    <TableContainer>
      <Table stickyHeader>
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
                indeterminate={selectedWorkflows.length > 0 && selectedWorkflows.length < workflows.length}
                checked={selectedWorkflows.length > 0 && selectedWorkflows.length === workflows.length}
                onChange={handleSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell sx={{ width: '20%' }}>工作流名称</TableCell>
            <TableCell sx={{ width: '20%' }}>描述</TableCell>
            <TableCell sx={{ width: '10%' }}>状态</TableCell>
            <TableCell sx={{ width: '15%' }}>创建时间</TableCell>
            <TableCell sx={{ width: '15%' }}>更新时间</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8, border: 0 }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : workflows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8, border: 0 }}>
                <Typography variant="h6" color="text.secondary">
                  暂无工作流
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  点击"新建工作流"开始创建
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            workflows.map((workflow) => {
              const statusInfo = getStatusInfo(workflow.status);
              return (
                <TableRow 
                  key={workflow.id} 
                  hover
                  selected={selectedWorkflows.includes(workflow.id)}
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
                      checked={selectedWorkflows.includes(workflow.id)}
                      onChange={() => handleSelectWorkflow(workflow.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {workflow.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {workflow.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={statusInfo.text} 
                      color={statusInfo.color} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {workflow.nodes.length}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatTime(workflow.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatTime(workflow.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="查看">
                        <IconButton size="small" onClick={() => handleView(workflow.id)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="编辑">
                        <IconButton size="small" onClick={() => handleEdit(workflow.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton size="small" onClick={() => handleDelete(workflow.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // 渲染卡片视图
  const renderCardView = () => (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : workflows.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" mb={1}>
            暂无工作流
          </Typography>
          <Typography variant="body2" color="text.secondary">
            点击"新建工作流"开始创建
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {workflows.map((workflow) => {
            const statusInfo = getStatusInfo(workflow.status);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={workflow.id}>
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
                    ...(selectedWorkflows.includes(workflow.id) && {
                      boxShadow: 3,
                      borderColor: 'primary.main',
                    })
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Checkbox
                        checked={selectedWorkflows.includes(workflow.id)}
                        onChange={() => handleSelectWorkflow(workflow.id)}
                        color="primary"
                        sx={{ p: 0, m: 1 }}
                      />
                      <Chip 
                        label={statusInfo.text} 
                        color={statusInfo.color} 
                        size="small" 
                      />
                    </Stack>
                    
                    <Typography variant="h6" fontWeight={600} mb={1} noWrap>
                      {workflow.name}
                    </Typography>
                    
                    {workflow.description && (
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {workflow.description}
                      </Typography>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      节点数: {workflow.nodes.length}
                    </Typography>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <TimeIcon sx={{ fontSize: '0.875rem' }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(workflow.createdAt).split(' ')[0]}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <UpdateIcon sx={{ fontSize: '0.875rem' }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(workflow.updatedAt).split(' ')[0]}
                        </Typography>
                      </Stack>
                    </Stack>
                    
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="查看">
                        <IconButton 
                          size="small" 
                          onClick={() => handleView(workflow.id)}
                          color="default"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="编辑">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(workflow.id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(workflow.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">工作流管理</Typography>
            <Typography variant="body2" color="text.secondary">管理您的业务流程和工作流</Typography>
          </Box>
          <Badge badgeContent={total} color="primary">
            <Typography variant="h6">工作流总数</Typography>
          </Badge>
        </Stack>
      </Paper>
      
      {/* Toolbar */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <TextField
              placeholder="搜索工作流名称..."
              variant="outlined"
              size="small"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>状态</InputLabel>
              <Select 
                label="状态" 
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  handleFilterChange();
                }}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="draft">草稿</MenuItem>
                <MenuItem value="active">活跃</MenuItem>
                <MenuItem value="inactive">停用</MenuItem>
              </Select>
            </FormControl>
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
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
              新建工作流
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              disabled={selectedWorkflows.length === 0}
            >
              删除 ({selectedWorkflows.length})
            </Button>
          </Stack>
          {(searchKeyword || statusFilter) && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">筛选条件:</Typography>
              {searchKeyword && <Chip label={`搜索: "${searchKeyword}"`} onDelete={() => setSearchKeyword('')} />}
              {statusFilter && <Chip label={`状态: ${getStatusInfo(statusFilter as 'draft' | 'active' | 'inactive').text}`} onDelete={() => setStatusFilter('')} />}
            </Stack>
          )}
        </Stack>
      </Paper>
      
      {/* Content */}
      <Paper sx={{ flex: 1, minHeight: 0, borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {loading ? (
            <LinearProgress />
          ) : viewMode === 'table' ? (
            renderTable()
          ) : (
            renderCardView()
          )}
        </Box>
        
        {/* Pagination */}
        {total > 0 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(total / pageSize)}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Workflows; 