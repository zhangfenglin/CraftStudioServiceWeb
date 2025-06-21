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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getReleaseOrders } from '../api/release-orders';
import { getProjects } from '../api/projects';
import type { ReleaseOrder, ReleaseOrderStatusType } from '../api/release-order.define';
import type { Project } from '../api/project.define';
import { ReleaseOrderStatus } from '../api/release-order.define';
import { ErrorCode } from '../api/errorCodes';

const ReleaseOrders: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [releaseOrders, setReleaseOrders] = useState<ReleaseOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  
  // 筛选条件
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');

  // 获取发布单列表
  const fetchReleaseOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
        query: searchKeyword || undefined,
        status: statusFilter === '' ? undefined : parseInt(statusFilter, 10) as ReleaseOrderStatusType,
        project_id: projectFilter || undefined
      };

      const response = await getReleaseOrders(params);
      if (response.data?.code === ErrorCode.SUCCESS || response.data?.code === 1) {
        setReleaseOrders(response.data.data.list || []);
        setTotal(response.data.data.total || 0);
      } else {
        console.error('获取发布单列表失败:', response.data?.msg);
      }
    } catch (error) {
      console.error('获取发布单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取项目列表
  const fetchProjects = async () => {
    try {
      const response = await getProjects({ page: 1, page_size: 100 });
      if (response.data?.code === ErrorCode.SUCCESS || response.data?.code === 1) {
        setProjects(response.data.data.list || []);
      }
    } catch (error) {
      console.error('获取项目列表失败:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchReleaseOrders();
    fetchProjects();
  }, [currentPage, searchKeyword, statusFilter, projectFilter]);

  // 刷新数据
  const handleRefresh = () => {
    fetchReleaseOrders();
  };

  // 处理搜索
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurrentPage(1);
      fetchReleaseOrders();
    }
  };

  // 处理筛选
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchReleaseOrders();
  };

  // 获取状态显示文本和颜色
  const getStatusInfo = (status: ReleaseOrderStatusType) => {
    switch (status) {
      case ReleaseOrderStatus.DRAFT:
        return { text: '草稿', color: 'default' as const };
      case ReleaseOrderStatus.PENDING:
        return { text: '待审核', color: 'warning' as const };
      case ReleaseOrderStatus.APPROVED:
        return { text: '已审核', color: 'info' as const };
      case ReleaseOrderStatus.REJECTED:
        return { text: '已拒绝', color: 'error' as const };
      case ReleaseOrderStatus.RELEASING:
        return { text: '发布中', color: 'primary' as const };
      case ReleaseOrderStatus.RELEASED:
        return { text: '已发布', color: 'success' as const };
      case ReleaseOrderStatus.FAILED:
        return { text: '发布失败', color: 'error' as const };
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
    navigate('/release-orders/create');
  };

  const handleView = (id: number) => {
    navigate(`/release-orders/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/release-orders/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    // TODO: 实现删除功能
    console.log('删除发布单:', id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">发布单管理</Typography>
            <Typography variant="body2" color="text.secondary">管理您的所有发布请求和记录</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            新建发布单
          </Button>
        </Stack>
      </Paper>
      
      {/* Toolbar */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="搜索发布单名称..."
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
                const value = e.target.value;
                setStatusFilter(value === '' ? '' : value);
                handleFilterChange();
              }}
            >
              <MenuItem value="">全部</MenuItem>
              <MenuItem value={ReleaseOrderStatus.DRAFT}>草稿</MenuItem>
              <MenuItem value={ReleaseOrderStatus.PENDING}>待审核</MenuItem>
              <MenuItem value={ReleaseOrderStatus.APPROVED}>已审核</MenuItem>
              <MenuItem value={ReleaseOrderStatus.REJECTED}>已拒绝</MenuItem>
              <MenuItem value={ReleaseOrderStatus.RELEASING}>发布中</MenuItem>
              <MenuItem value={ReleaseOrderStatus.RELEASED}>已发布</MenuItem>
              <MenuItem value={ReleaseOrderStatus.FAILED}>发布失败</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>项目</InputLabel>
            <Select 
              label="项目" 
              value={projectFilter}
              onChange={(e) => {
                setProjectFilter(e.target.value);
                handleFilterChange();
              }}
            >
              <MenuItem value="">全部项目</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="筛选">
            <IconButton onClick={handleFilterChange}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="刷新">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
      
      {/* Table */}
      <Paper sx={{ flex: 1, borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  '& .MuiTableCell-root': {
                    backgroundColor: 'grey.100',
                    fontWeight: 'bold',
                  },
                }}
              >
                <TableCell>发布单名称</TableCell>
                <TableCell>项目名称</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>创建时间</TableCell>
                <TableCell>更新时间</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, border: 0 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : releaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, border: 0 }}>
                    <Typography variant="h6" color="text.secondary">
                      暂无发布单
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      点击"新建发布单"开始创建
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                releaseOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {order.name}
                        </Typography>
                        {order.desc && (
                          <Typography variant="caption" color="text.secondary">
                            {order.desc}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.project_info?.name || '未知项目'}
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
                          {formatTime(order.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatTime(order.updated_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="查看">
                            <IconButton size="small" onClick={() => handleView(order.id)}>
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="编辑">
                            <IconButton size="small" onClick={() => handleEdit(order.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton size="small" onClick={() => handleDelete(order.id)}>
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

export default ReleaseOrders; 