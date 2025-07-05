import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  Article as ChapterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createNovel } from '../api/novels';
import { useAsyncErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';
import type { CreateNovelParams } from '../api/novel.define';

// 预设的分类选项
const CATEGORIES = [
  { value: 'fantasy', label: '奇幻' },
  { value: 'romance', label: '言情' },
  { value: 'mystery', label: '悬疑' },
  { value: 'scifi', label: '科幻' },
  { value: 'historical', label: '历史' },
  { value: 'urban', label: '都市' },
  { value: 'martial', label: '武侠' },
  { value: 'game', label: '游戏' },
  { value: 'other', label: '其他' }
];

// 预设的标签选项
const PRESET_TAGS = [
  { value: 'hot', label: '热门', color: '#f44336' },
  { value: 'new', label: '新书', color: '#2196f3' },
  { value: 'recommended', label: '推荐', color: '#4caf50' },
  { value: 'completed', label: '完结', color: '#ff9800' },
  { value: 'ongoing', label: '连载', color: '#9c27b0' }
];

const CreateNovel: React.FC = () => {
  const navigate = useNavigate();
  const { errorState, clearError } = useAsyncErrorHandler();
  
  const [formData, setFormData] = useState<CreateNovelParams>({
    title: '',
    author: '',
    category: '',
    tags: [],
    description: '',
    cover_url: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [customTag, setCustomTag] = useState('');

  // 处理输入变化
  const handleInputChange = (field: keyof CreateNovelParams) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // 处理分类选择
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      category: event.target.value
    }));
  };

  // 处理标签变化
  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      tags: typeof value === 'string' ? value.split(',') : value
    }));
  };

  // 添加自定义标签
  const handleAddCustomTag = () => {
    if (customTag.trim() && !formData.tags?.includes(customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), customTag.trim()]
      }));
      setCustomTag('');
    }
  };

  // 删除标签
  const handleDeleteTag = (tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete) || []
    }));
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      alert('请输入小说标题');
      return false;
    }
    if (!formData.author.trim()) {
      alert('请输入作者名称');
      return false;
    }
    if (!formData.category) {
      alert('请选择小说分类');
      return false;
    }
    return true;
  };

  // 提交表单
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await createNovel(formData);
      const resData = response.data;
      if (resData.code === 1 && resData.data && resData.data.id) {
        alert('小说创建成功！');
        const novelId = resData.data.id;
        navigate(`/novels/${novelId}/chapters/create`, {
          state: {
            novelTitle: formData.title
          }
        });
      } else {
        alert(resData.msg || '创建失败');
      }
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null) {
        const err = error as { msg?: string; message?: string };
        alert(err.msg || err.message || '创建失败');
      } else {
        alert('创建失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 跳转到章节创建页面
  const handleCreateChapter = () => {
    if (!formData.title.trim()) {
      alert('请先填写小说标题');
      return;
    }
    // 这里可以跳转到章节创建页面，或者先保存草稿
    navigate('/chapters/create', { 
      state: { 
        novelTitle: formData.title,
        novelData: formData 
      } 
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        <BookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        创建新小说
      </Typography>

      {/* 错误显示 */}
      {errorState.hasError && (
        <ErrorDisplay
          error={errorState.error}
          onClose={clearError}
          variant="alert"
        />
      )}

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 基本信息 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本信息
              </Typography>
            </Grid>

            {/* 标题 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="小说标题"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
                placeholder="请输入小说标题"
                variant="outlined"
              />
            </Grid>

            {/* 作者 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="作者"
                value={formData.author}
                onChange={handleInputChange('author')}
                required
                placeholder="请输入作者名称"
                variant="outlined"
              />
            </Grid>

            {/* 分类 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>分类</InputLabel>
                <Select
                  value={formData.category}
                  label="分类"
                  onChange={handleCategoryChange}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 标签 */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>标签</InputLabel>
                <Select
                  multiple
                  value={formData.tags || []}
                  onChange={handleTagsChange}
                  input={<OutlinedInput label="标签" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const tag = PRESET_TAGS.find(t => t.value === value);
                        return (
                          <Chip
                            key={value}
                            label={tag ? tag.label : value}
                            onDelete={() => handleDeleteTag(value)}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {PRESET_TAGS.map((tag) => (
                    <MenuItem key={tag.value} value={tag.value}>
                      {tag.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 自定义标签 */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="添加自定义标签"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="输入自定义标签"
                  size="small"
                  sx={{ flexGrow: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddCustomTag}
                  startIcon={<AddIcon />}
                  disabled={!customTag.trim()}
                >
                  添加
                </Button>
              </Box>
            </Grid>

            {/* 描述 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="小说简介"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={4}
                placeholder="请输入小说简介..."
                variant="outlined"
              />
            </Grid>

            {/* 封面图片 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="封面图片URL"
                value={formData.cover_url}
                onChange={handleInputChange('cover_url')}
                placeholder="请输入封面图片链接"
                variant="outlined"
                helperText="支持网络图片链接"
              />
            </Grid>

            {/* 封面预览 */}
            {formData.cover_url && (
              <Grid item xs={12}>
                <Card sx={{ maxWidth: 200 }}>
                  <CardMedia
                    component="img"
                    height="280"
                    image={formData.cover_url}
                    alt="封面预览"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        封面预览
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setFormData(prev => ({ ...prev, cover_url: '' }))}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* 操作按钮 */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <BookIcon />}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? '创建中...' : '创建小说'}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleCreateChapter}
                  startIcon={<ChapterIcon />}
                  sx={{ minWidth: 120 }}
                >
                  创建章节
                </Button>
                
                <Button
                  variant="text"
                  size="large"
                  onClick={() => navigate('/novels')}
                >
                  返回列表
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* 提示信息 */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>提示：</strong>
          创建小说后，您可以立即开始添加章节内容。章节创建功能可以帮助您更好地组织小说结构。
        </Typography>
      </Alert>
    </Box>
  );
};

export default CreateNovel; 