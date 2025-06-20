import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Snackbar } from '@mui/material';
import { createProject, deleteProject, getProjects, updateProject } from '../api/projects';
import type { Project } from '../api/project.define';

const Projects = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: '', desc: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // 获取项目列表
  const fetchProjects = async () => {
    setListLoading(true);
    try {
      const response = await getProjects({ page: 1, size: 10 });
      if (response.data.code === 1) {
        setProjects(response.data.data.list);
      } else {
        setSnackbar({
          open: true,
          message: response.data.msg || '获取项目列表失败',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('获取项目列表失败:', error);
      setSnackbar({
        open: true,
        message: '获取项目列表失败，请稍后重试',
        severity: 'error'
      });
    } finally {
      setListLoading(false);
    }
  };

  // 页面加载时获取项目列表
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpen = () => {
    setIsEdit(false);
    setCurrentProject(null);
    setForm({ name: '', desc: '' });
    setOpen(true);
  };

  const handleEdit = (project: Project) => {
    setIsEdit(true);
    setCurrentProject(project);
    setForm({ name: project.name, desc: project.desc });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setCurrentProject(null);
    setForm({ name: '', desc: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && currentProject) {
        // 编辑项目
        const response = await updateProject(currentProject.id, form);
        if (response.data.code === 1) {
          setSnackbar({
            open: true,
            message: '更新成功',
            severity: 'success'
          });
          handleClose();
          fetchProjects();
        } else {
          setSnackbar({
            open: true,
            message: response.data.msg || '更新失败',
            severity: 'error'
          });
        }
      } else {
        // 创建项目
        const response = await createProject(form);
        if (response.data.code === 1) {
          setSnackbar({
            open: true,
            message: '创建成功',
            severity: 'success'
          });
          handleClose();
          fetchProjects();
        } else {
          setSnackbar({
            open: true,
            message: response.data.msg || '创建失败',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error(isEdit ? '更新项目失败:' : '创建项目失败:', error);
      setSnackbar({
        open: true,
        message: isEdit ? '更新失败，请稍后重试' : '创建失败，请稍后重试',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteProject(id);
      setLoading(false);
      if (response.data.code === 1) {
        setSnackbar({
          open: true,
          message: '删除成功',
          severity: 'success'
        });
        fetchProjects();
      } else {
        setSnackbar({
          open: true,
          message: response.data.msg || '删除失败',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('删除项目失败:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 获取状态文本
  const getStatusText = (status: number) => {
    return status === 1 ? '连载中' : '已完结';
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(90deg, #f7f8fa 60%, #e9f1ff 100%)', width: '100%', height: '100%', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>作品管理</Typography>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={2} spacing={2}
          sx={{ border: '1px solid #e0e3e7', borderRadius: 2, p: 2, background: '#fff' }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>新建</Button>
        </Stack>
        <TableContainer sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2, width: '100%', height: '100%', background: 'transparent', boxShadow: 'none', minWidth: 0 }}>
          <Table sx={{ height: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>作品名称</TableCell>
                <TableCell>描述</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">加载中...</TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">暂无数据</TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.desc}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">查看</Button>
                      <Button size="small" variant="outlined" sx={{ ml: 1 }} onClick={() => handleEdit(project)}>编辑</Button>
                      <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => handleDelete(project.id)}>删除</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{isEdit ? '编辑项目' : '新建项目'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="名称"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              margin="dense"
              label="描述"
              name="desc"
              value={form.desc}
              onChange={e => {
                if (e.target.value.length <= 300) {
                  handleChange(e);
                }
              }}
              fullWidth
              multiline
              minRows={5}
              inputProps={{ maxLength: 300 }}
              helperText={`${form.desc.length}/300`}
              disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>取消</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? (isEdit ? '更新中...' : '创建中...') : (isEdit ? '更新' : '确定')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
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
    </Box>
  );
};

export default Projects; 