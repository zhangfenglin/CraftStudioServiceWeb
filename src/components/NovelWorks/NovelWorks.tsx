import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  InputAdornment,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Book as BookIcon,
  Create as CreateIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { getNovels, deleteNovel, batchDeleteNovels } from '../../api/novels';
import { ErrorCode } from '../../api/errorCodes';
import type { Novel, NovelListParams } from '../../api/novel.define';
import { NovelStatus } from '../../api/novel.define';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay } from '../ErrorDisplay';
import { useNavigate } from 'react-router-dom';

const NovelWorks: React.FC = () => {
  const navigate = useNavigate();
  // 状态管理
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 筛选条件
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // const [tagsFilter, setTagsFilter] = useState('');

  // 视图模式
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedNovels, setSelectedNovels] = useState<string[]>([]);

  // 对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [novelToDelete, setNovelToDelete] = useState<Novel | null>(null);

  // 消息提示
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // 使用错误处理 Hook
  const { errorState, handleError, clearError } = useErrorHandler();

  // 获取小说列表
  const fetchNovels = useCallback(async () => {
    setLoading(true);
    clearError();
    
    try {
      const params: NovelListParams = {
        page: currentPage,
        page_size: pageSize,
        title: searchTitle || undefined,
        author: searchAuthor || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        // tags: tagsFilter || undefined
      };

      const response = await getNovels(params);
      if (response.data?.code === ErrorCode.SUCCESS || response.data?.code === 1) {
        // 适配接口返回的字段到 Novel 类型
        const list = Array.isArray(response.data.data?.list) ? response.data.data.list : [];
        setNovels(list.map((item) => ({
          id: String(item.id),
          title: String(item.title ?? ''),
          author: String(item.author ?? ''),
          category: String(item.category ?? ''),
          tags: typeof item.tags === 'string'
            ? (item.tags as string).split(/[,，;；\s]+/).filter((t: string) => !!t)
            : Array.isArray(item.tags) ? (item.tags as string[]) : [],
          status: Object.values(NovelStatus).includes(item.status as NovelStatus)
            ? item.status as NovelStatus
            : NovelStatus.DRAFT,
          cover_url: String((item as { cover_image?: string }).cover_image ?? ''),
          description: String(item.description ?? ''),
          word_count: Number(item.word_count ?? 0),
          chapter_count: Number((item as { total_chapters?: number }).total_chapters ?? 0),
          view_count: Number(item.view_count ?? 0),
          like_count: Number(item.like_count ?? 0),
          created_at: String(item.created_at ?? ''),
          updated_at: String(item.updated_at ?? ''),
          last_chapter_at: String(item.last_chapter_at ?? ''),
        })));
        setTotal(Number(response.data.data.total) || list.length);
      } else {
        console.error('获取小说列表失败:', response.data?.msg);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTitle, searchAuthor, categoryFilter, statusFilter, handleError, clearError]);

  // 初始化数据
  useEffect(() => {
    fetchNovels();
  }, [fetchNovels]);

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1);
    fetchNovels();
  };

  // 处理筛选
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchNovels();
  };

  // 处理分页
  // const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
  //   setCurrentPage(page);
  // };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  // 批量选择
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedNovels(novels.map(novel => novel.id));
    } else {
      setSelectedNovels([]);
    }
  };

  const handleSelectNovel = (id: string) => {
    setSelectedNovels(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // 删除小说
  const handleDelete = async (novel: Novel) => {
    setNovelToDelete(novel);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!novelToDelete) return;
    
    try {
      await deleteNovel(novelToDelete.id);
      setSnackbar({
        open: true,
        message: '小说删除成功',
        severity: 'success'
      });
      fetchNovels();
    } catch (error) {
      handleError(error);
    } finally {
      setDeleteDialogOpen(false);
      setNovelToDelete(null);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedNovels.length === 0) return;
    
    try {
      await batchDeleteNovels(selectedNovels);
      setSnackbar({
        open: true,
        message: `成功删除 ${selectedNovels.length} 部小说`,
        severity: 'success'
      });
      setSelectedNovels([]);
      fetchNovels();
    } catch (error) {
      handleError(error);
    }
  };

  // 更新状态
  // const handleStatusChange = async (novel: Novel, newStatus: string) => {
  //   try {
  //     await updateNovelStatus(novel.id, newStatus);
  //     setSnackbar({
  //       open: true,
  //       message: '状态更新成功',
  //       severity: 'success'
  //     });
  //     fetchNovels();
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  // 获取状态显示信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case NovelStatus.DRAFT:
        return { text: '草稿', color: 'default' as const, icon: <CreateIcon /> };
      case NovelStatus.PUBLISHING:
        return { text: '连载中', color: 'primary' as const, icon: <PlayIcon /> };
      case NovelStatus.COMPLETED:
        return { text: '已完结', color: 'success' as const, icon: <CheckCircleIcon /> };
      case NovelStatus.PAUSED:
        return { text: '暂停', color: 'warning' as const, icon: <PauseIcon /> };
      case NovelStatus.DELETED:
        return { text: '已删除', color: 'error' as const, icon: <DeleteIcon /> };
      default:
        return { text: '未知', color: 'default' as const, icon: <BookIcon /> };
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

  // 渲染表格视图
  const renderTableView = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedNovels.length > 0 && selectedNovels.length < novels.length}
                checked={novels.length > 0 && selectedNovels.length === novels.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>标题</TableCell>
            <TableCell>作者</TableCell>
            <TableCell>分类</TableCell>
            <TableCell>状态</TableCell>
            <TableCell>字数</TableCell>
            <TableCell>章节数</TableCell>
            <TableCell>更新时间</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {novels.map((novel) => {
            const statusInfo = getStatusInfo(novel.status);
            const isSelected = selectedNovels.includes(novel.id);
            return (
              <TableRow key={novel.id} selected={isSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleSelectNovel(novel.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {novel.title}
                  </Typography>
                </TableCell>
                <TableCell>{novel.author}</TableCell>
                <TableCell>{novel.category}</TableCell>
                <TableCell>
                  <Chip
                    icon={statusInfo.icon}
                    label={statusInfo.text}
                    color={statusInfo.color}
                    size="small"
                  />
                </TableCell>
                <TableCell>{novel.word_count?.toLocaleString?.() ?? novel.word_count ?? 0}</TableCell>
                <TableCell>{novel.chapter_count ?? 0}</TableCell>
                <TableCell>{formatTime(novel.updated_at)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="查看">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(novel)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // 渲染卡片视图
  const renderCardView = () => (
    <Grid container spacing={3}>
      {novels.map((novel) => {
        const statusInfo = getStatusInfo(novel.status);
        const isSelected = selectedNovels.includes(novel.id);
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={novel.id}>
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
                ...(isSelected && {
                  boxShadow: 3,
                  borderColor: 'primary.main',
                })
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleSelectNovel(novel.id)}
                    size="small"
                  />
                  <Chip
                    icon={statusInfo.icon}
                    label={statusInfo.text}
                    color={statusInfo.color}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Stack>
                <Typography variant="h6" fontWeight="bold" mb={1} noWrap>
                  {novel.title}
                </Typography>
                
                <Stack spacing={1} mb={2}>
                  <Typography variant="body2">
                    <strong>作者:</strong> {novel.author}
                  </Typography>
                  <Typography variant="body2">
                    <strong>分类:</strong> {novel.category}
                  </Typography>
                  <Typography variant="body2">
                    <strong>字数:</strong> {novel.word_count?.toLocaleString?.() ?? novel.word_count ?? 0}
                  </Typography>
                  <Typography variant="body2">
                    <strong>章节:</strong> {novel.chapter_count ?? 0}
                  </Typography>
                </Stack>
                
                {novel.tags && novel.tags.length > 0 && (
                  <Stack direction="row" spacing={0.5} mb={2} flexWrap="wrap" useFlexGap>
                    {novel.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                    {novel.tags.length > 3 && (
                      <Chip label={`+${novel.tags.length - 3}`} size="small" variant="outlined" />
                    )}
                  </Stack>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<ViewIcon />}>
                  查看
                </Button>
                <Button size="small" startIcon={<EditIcon />}>
                  编辑
                </Button>
                <Button 
                  size="small" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(novel)}
                >
                  删除
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">我的作品</Typography>
            <Typography variant="body2" color="text.secondary">管理您的小说作品</Typography>
          </Box>
          <Badge badgeContent={total} color="primary">
            <Typography variant="h6">作品总数</Typography>
          </Badge>
        </Stack>
      </Paper>

      {/* Toolbar */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <TextField
              placeholder="搜索标题"
              variant="outlined"
              size="small"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            <TextField
              placeholder="搜索作者"
              variant="outlined"
              size="small"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              sx={{ minWidth: 150 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>分类</InputLabel>
              <Select
                label="分类"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">全部分类</MenuItem>
                <MenuItem value="玄幻">玄幻</MenuItem>
                <MenuItem value="都市">都市</MenuItem>
                <MenuItem value="历史">历史</MenuItem>
                <MenuItem value="科幻">科幻</MenuItem>
                <MenuItem value="游戏">游戏</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>状态</InputLabel>
              <Select
                label="状态"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">全部状态</MenuItem>
                <MenuItem value={NovelStatus.DRAFT}>草稿</MenuItem>
                <MenuItem value={NovelStatus.PUBLISHING}>连载中</MenuItem>
                <MenuItem value={NovelStatus.COMPLETED}>已完结</MenuItem>
                <MenuItem value={NovelStatus.PAUSED}>暂停</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSearch}>
              搜索
            </Button>
            <Button variant="outlined" onClick={handleFilterChange}>
              筛选
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
            >
              表格
            </Button>
            <Button
              variant={viewMode === 'card' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('card')}
            >
              卡片
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/novels/create')}>
              新建小说
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchNovels}>
              刷新
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              disabled={selectedNovels.length === 0}
            >
              删除 ({selectedNovels.length})
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <ErrorDisplay error={errorState.error} />

      {/* Content */}
      <Paper sx={{ flex: 1, minHeight: 0, borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: viewMode === 'card' ? 3 : 0 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                加载中...
              </Typography>
            </Box>
          ) : novels.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" mb={1}>
                暂无小说作品
              </Typography>
              <Typography variant="body2" color="text.secondary">
                点击"新建小说"开始创作您的第一部作品
              </Typography>
            </Box>
          ) : viewMode === 'table' ? (
            renderTableView()
          ) : (
            renderCardView()
          )}
        </Box>

        {/* 分页 */}
        {total > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <TablePagination
              component="div"
              count={total}
              page={currentPage - 1}
              onPageChange={(_, page) => setCurrentPage(page + 1)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 20, 50, 100]}
              labelRowsPerPage="每页显示"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            />
          </Box>
        )}
      </Paper>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除小说 "{novelToDelete?.title}" 吗？此操作不可恢复。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NovelWorks; 