import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import type { Project } from '../api/project.define';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; desc: string }) => Promise<void>;
  project?: Project | null;
  isEdit?: boolean;
  loading?: boolean;
}

const ProjectForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  project, 
  isEdit = false, 
  loading = false 
}: ProjectFormProps) => {
  const [form, setForm] = useState({ name: '', desc: '' });

  // 当项目数据变化时，更新表单
  useEffect(() => {
    if (project && isEdit) {
      setForm({ name: project.name, desc: project.desc });
    } else {
      setForm({ name: '', desc: '' });
    }
  }, [project, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const handleClose = () => {
    setForm({ name: '', desc: '' });
    onClose();
  };

  return (
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
          <Button onClick={handleClose} disabled={loading}>
            取消
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (isEdit ? '更新中...' : '创建中...') : (isEdit ? '更新' : '确定')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm; 