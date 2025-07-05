import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Divider, Avatar, Stack } from '@mui/material';
import type { Project } from '../../api/project.define';

interface ProjectDetailProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  loading: boolean;
}

// 格式化时间的辅助函数
const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return '未知时间';
  }
};

const ProjectDetail = ({ open, onClose, project, loading }: ProjectDetailProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
          📝
        </Avatar>
        <Box>
          <Typography variant="h6">项目详情</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            查看项目的详细信息
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                加载中...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                正在获取项目信息
              </Typography>
            </Box>
          </Box>
        ) : project ? (
          <Box>
            {/* 项目基本信息卡片 */}
            <Paper elevation={0} sx={{ 
              m: 3, 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '1px solid #e0e3e7'
            }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: 60, 
                  height: 60,
                  fontSize: '1.5rem'
                }}>
                  {project.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {project.name}
                  </Typography>
                  <Chip 
                    label={project.status === 1 ? '连载中' : '已完结'}
                    color={project.status === 1 ? 'success' : 'default'}
                    variant="filled"
                    size="small"
                  />
                </Box>
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.secondary">
                项目描述
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 3, 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.7)', 
                borderRadius: 2,
                lineHeight: 1.6
              }}>
                {project.desc}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    项目ID
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    #{project.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    创建时间
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDateTime(project.created_at)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    最后更新
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDateTime(project.updated_at)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
            
            {/* 项目统计信息 */}
            <Paper elevation={0} sx={{ 
              mx: 3, 
              mb: 3, 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)' }}>
                项目统计
              </Typography>
              <Stack direction="row" spacing={4}>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    章节数
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    字数
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    阅读量
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetail; 