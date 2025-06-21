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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

const ReleaseOrders: React.FC = () => {
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(90deg, #f7f8fa 60%, #e9f1ff 100%)', width: '100%', height: '100%', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>发布单管理</Typography>
        
        {/* 功能区 */}
        <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={2}>
            {/* 搜索框 */}
            <TextField
              size="small"
              placeholder="搜索发布单名称..."
              sx={{ minWidth: 200 }}
            />
            
            {/* 状态筛选 */}
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
            
            {/* 项目筛选 */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>项目</InputLabel>
              <Select label="项目" defaultValue="">
                <MenuItem value="">全部项目</MenuItem>
                <MenuItem value="project1">项目A</MenuItem>
                <MenuItem value="project2">项目B</MenuItem>
                <MenuItem value="project3">项目C</MenuItem>
              </Select>
            </FormControl>
            
            {/* 操作按钮组 */}
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Tooltip title="筛选">
                <IconButton size="small" sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="刷新">
                <IconButton size="small" sx={{ bgcolor: 'grey.200', '&:hover': { bgcolor: 'grey.300' } }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                新建发布单
              </Button>
            </Box>
          </Stack>
        </Paper>
        
        <TableContainer sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2, width: '100%', height: '100%', background: 'transparent', boxShadow: 'none', minWidth: 0 }}>
          <Table sx={{ height: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>发布单名称</TableCell>
                <TableCell>项目名称</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>创建时间</TableCell>
                <TableCell>更新时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ReleaseOrders; 