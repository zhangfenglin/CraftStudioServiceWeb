import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { CreateNovelParams, UpdateNovelParams } from '../api/novel.define';
import type { SelectChangeEvent } from '@mui/material/Select';

export interface NovelFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateNovelParams & UpdateNovelParams>;
  loading?: boolean;
  categories: { value: string; label: string }[];
  onSubmit: (data: CreateNovelParams | UpdateNovelParams) => void;
  onCancel?: () => void;
  error?: string;
}

const PRESET_TAGS = [
  { value: 'hot', label: '热门', color: '#f44336' },
  { value: 'new', label: '新书', color: '#2196f3' },
  { value: 'recommended', label: '推荐', color: '#4caf50' },
  { value: 'completed', label: '完结', color: '#ff9800' },
  { value: 'ongoing', label: '连载', color: '#9c27b0' }
];

const NovelForm: React.FC<NovelFormProps> = ({
  mode,
  initialData = {},
  loading = false,
  categories,
  onSubmit,
  onCancel,
  error
}) => {
  const [formData, setFormData] = useState<CreateNovelParams & UpdateNovelParams>({
    title: '',
    author: '',
    category: '',
    tags: [],
    description: '',
    cover_url: '',
    ...((initialData && typeof initialData.cover_url === 'undefined' && 'cover_image' in initialData && (initialData as { cover_image?: string }).cover_image)
      ? { cover_url: (initialData as { cover_image?: string }).cover_image }
      : {}),
    ...initialData
  });
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        cover_url: initialData.cover_url || ('cover_image' in initialData ? (initialData as { cover_image?: string }).cover_image : '') || ''
      }));
    }
  }, [initialData]);

  // 处理输入变化
  const handleInputChange = (field: keyof (CreateNovelParams & UpdateNovelParams)) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // 处理分类选择
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      category: event.target.value as string
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
    setFormData(prev => {
      let tagsArr: string[] = [];
      if (Array.isArray(prev.tags)) {
        tagsArr = prev.tags;
      } else if (typeof prev.tags === 'string' && prev.tags) {
        tagsArr = (prev.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean);
      }
      return {
        ...prev,
        tags: tagsArr.filter(tag => tag !== tagToDelete)
      };
    });
  };

  // 校验
  const validateForm = (): boolean => {
    if (!formData.title?.trim()) {
      alert('请输入小说标题');
      return false;
    }
    if (!formData.author?.trim()) {
      alert('请输入作者名称');
      return false;
    }
    if (!formData.category) {
      alert('请选择小说分类');
      return false;
    }
    return true;
  };

  // 提交
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
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
              {categories.map((category) => (
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
              value={Array.isArray(formData.tags) ? formData.tags : typeof formData.tags === 'string' && formData.tags ? (formData.tags as string).split(',').map((t: string) => t.trim()) : []}
              onChange={handleTagsChange}
              input={<OutlinedInput label="标签" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected)
                    ? selected.map((value) => {
                        const tag = PRESET_TAGS.find(t => t.value === value);
                        return (
                          <Chip
                            key={value}
                            label={tag ? tag.label : value}
                            onMouseDown={e => e.stopPropagation()}
                            onDelete={mode === 'edit' ? (() => handleDeleteTag(value)) : undefined}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        );
                      })
                    : null}
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
              onChange={e => setCustomTag(e.target.value)}
              placeholder="输入自定义标签"
              size="small"
              sx={{ flexGrow: 1 }}
              onKeyPress={e => {
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
        {/* 简介 */}
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
        {/* 操作按钮 */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {mode === 'create' ? '创建小说' : '保存修改'}
            </Button>
            {onCancel && (
              <Button variant="outlined" size="large" onClick={onCancel} disabled={loading}>
                取消
              </Button>
            )}
          </Stack>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error" align="center">{error}</Typography>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default NovelForm; 