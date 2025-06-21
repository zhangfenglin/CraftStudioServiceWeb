import React from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ReleaseOrders: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/release-orders/create');
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
            <Select label="状态" defaultValue="">
              <MenuItem value="">全部</MenuItem>
              <MenuItem value="draft">草稿</MenuItem>
              <MenuItem value="pending">待审核</MenuItem>
              <MenuItem value="approved">已通过</MenuItem>
              <MenuItem value="rejected">已拒绝</MenuItem>
              <MenuItem value="published">已发布</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>项目</InputLabel>
            <Select label="项目" defaultValue="">
              <MenuItem value="">全部项目</MenuItem>
              <MenuItem value="project1">项目A</MenuItem>
              <MenuItem value="project2">项目B</MenuItem>
              <MenuItem value="project3">项目C</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="筛选">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="刷新">
            <IconButton>
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
              {/* Placeholder for no data */}
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
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ReleaseOrders; 