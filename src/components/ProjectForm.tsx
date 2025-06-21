import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Chip,
  LinearProgress,
  Alert,
  Collapse
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import type { Project } from '../api/project.define';
import { ErrorCode } from '../api/errorCodes';
import type { ApiError, ErrorCodeType } from '../api/errorCodes';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; desc: string }) => Promise<void>;
  project?: Project | null;
  isEdit?: boolean;
  loading?: boolean;
  error?: ApiError | null;
  onClearError?: () => void;
}

const ProjectForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  project, 
  isEdit = false, 
  loading = false,
  error = null,
  onClearError
}: ProjectFormProps) => {
  const [form, setForm] = useState({ name: '', desc: '' });
  const [localError, setLocalError] = useState<ApiError | null>(null);

  // 当项目数据变化时，更新表单
  useEffect(() => {
    if (project && isEdit) {
      setForm({ name: project.name, desc: project.desc });
    } else {
      setForm({ name: '', desc: '' });
    }
  }, [project, isEdit]);

  // 当外部错误状态变化时，更新本地错误状态
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  // 当对话框关闭时，清除错误
  useEffect(() => {
    if (!open) {
      setLocalError(null);
    }
  }, [open]);

  const isNameFieldError = (errorCode: ErrorCodeType): boolean => {
    return ([
      ErrorCode.PROJECT_ALREADY_EXISTS,
      ErrorCode.PROJECT_NAME_INVALID,
      ErrorCode.VALIDATION_FAILED
    ] as ErrorCodeType[]).includes(errorCode);
  };

  const nameFieldError = localError && isNameFieldError(localError.code) ? localError : null;
  const generalError = localError && !isNameFieldError(localError.code) ? localError : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // 当用户开始输入时，清除错误
    if (localError) {
      setLocalError(null);
      onClearError?.();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(form);
    } catch (err) {
      console.error('表单提交失败:', err);
      const apiError: ApiError = {
        code: (err as ApiError).code || ErrorCode.UNKNOWN_ERROR,
        message: (err as Error).message || '提交失败，请稍后重试',
        timestamp: new Date().toISOString()
      };
      setLocalError(apiError);
    }
  };

  const handleClose = () => {
    setForm({ name: '', desc: '' });
    setLocalError(null);
    onClearError?.();
    onClose();
  };

  const handleClearError = () => {
    setLocalError(null);
    onClearError?.();
  };

  const getDescriptionColor = () => {
    const length = form.desc.length;
    if (length > 250) return 'error';
    if (length > 200) return 'warning';
    return 'success';
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }
      }}
    >
      {/* 加载进度条 */}
      {loading && <LinearProgress sx={{ height: 3 }} />}
      
      {/* 错误提示 */}
      <Collapse in={!!generalError}>
        <Box sx={{ p: 2, pb: 0 }}>
          <Alert 
            severity="error" 
            onClose={handleClearError}
            icon={<ErrorIcon />}
            sx={{
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontWeight: 500
              }
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {generalError?.message}
            </Typography>
            {generalError?.details && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {generalError.details}
              </Typography>
            )}
          </Alert>
        </Box>
      </Collapse>
      
      {/* 自定义标题栏 */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3,
        position: 'relative'
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {isEdit ? <EditIcon /> : <AddIcon />}
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {isEdit ? '编辑项目' : '新建项目'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {isEdit ? '修改项目信息' : '创建您的创意项目'}
            </Typography>
          </Box>
        </Stack>
        
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': {
              background: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pb: 2 }}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Stack spacing={3}>
              {/* 项目名称输入 */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <TitleIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    项目名称
                  </Typography>
                  <Chip label="必填" size="small" color="primary" variant="outlined" />
                </Stack>
                <TextField
                  autoFocus
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={loading}
                  placeholder="请输入项目名称..."
                  variant="outlined"
                  error={!!nameFieldError}
                  helperText={nameFieldError?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.9)'
                      },
                      '&.Mui-focused': {
                        background: 'white'
                      }
                    }
                  }}
                />
              </Box>

              {/* 项目描述输入 */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <DescriptionIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    项目描述
                  </Typography>
                  <Chip label="可选" size="small" color="default" variant="outlined" />
                </Stack>
                <TextField
                  name="desc"
                  value={form.desc}
                  onChange={e => {
                    if (e.target.value.length <= 300) {
                      handleChange(e);
                    }
                  }}
                  fullWidth
                  multiline
                  minRows={4}
                  maxRows={8}
                  inputProps={{ maxLength: 300 }}
                  placeholder="请描述您的项目..."
                  variant="outlined"
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.9)'
                      },
                      '&.Mui-focused': {
                        background: 'white'
                      }
                    }
                  }}
                />
                
                {/* 字符计数 */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    详细描述您的项目目标和特点
                  </Typography>
                  <Chip 
                    label={`${form.desc.length}/300`} 
                    size="small" 
                    color={getDescriptionColor()}
                    variant="outlined"
                    sx={{ 
                      minWidth: 60,
                      '& .MuiChip-label': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Stack>
              </Box>

              {/* 提示信息 */}
              <Paper elevation={0} sx={{ 
                p: 2, 
                borderRadius: 2, 
                background: 'linear-gradient(45deg, #e3f2fd 30%, #f3e5f5 90%)',
                border: '1px solid #e1f5fe'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  💡 <strong>提示：</strong>
                  {isEdit 
                    ? '修改项目信息后，相关数据将同步更新。' 
                    : '创建一个有意义的项目名称和详细描述，有助于更好地管理您的项目。'
                  }
                </Typography>
              </Paper>
            </Stack>
          </Paper>
        </DialogContent>

        {/* 操作按钮 */}
        <DialogActions sx={{ 
          p: 3, 
          pt: 1,
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: '#e0e3e7',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                background: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            取消
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !form.name.trim()}
            startIcon={isEdit ? <EditIcon /> : <AddIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                background: '#ccc',
                boxShadow: 'none',
                transform: 'none'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading 
              ? (isEdit ? '更新中...' : '创建中...') 
              : (isEdit ? '更新项目' : '创建项目')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm; 