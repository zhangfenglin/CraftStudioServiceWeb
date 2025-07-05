import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNovelDetail, updateNovel } from '../api/novels';
import type { Novel, UpdateNovelParams } from '../api/novel.define';
import { Box, Typography, Paper, CircularProgress, Chip, Stack, Button } from '@mui/material';
import NovelForm from '../components/NovelForm';
import { CATEGORIES, CATEGORY_LABELS } from '../api/novel.define';

const NovelDetail: React.FC = () => {
  const { novel_id } = useParams();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<UpdateNovelParams>({});
  const [saving, setSaving] = useState(false);

  // 预设的标签映射
  const TAG_LABELS: Record<string, string> = {
    hot: '热门',
    new: '新书',
    recommended: '推荐',
    completed: '完结',
    ongoing: '连载',
  };

  useEffect(() => {
    if (!novel_id) return;
    setLoading(true);
    getNovelDetail(novel_id)
      .then(res => {
        if (res.data.code === 1 && res.data.data) {
          setNovel(res.data.data);
          setEditData(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [novel_id]);

  // 类型保护
  const getTotalChapters = (novel: Novel) => {
    return (novel as { total_chapters?: number }).total_chapters ?? novel.chapter_count ?? 0;
  };
  const getCoverImage = (novel: Novel) => {
    return (novel as { cover_url?: string; cover_image?: string }).cover_url || (novel as { cover_image?: string }).cover_image;
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData(novel || {});
  };
  const handleCancel = () => {
    setEditMode(false);
    setEditData(novel || {});
  };

  // 非编辑模式下标签渲染
  let tagChips: React.ReactNode = null;
  if (novel) {
    let tags: string[] = [];
    if (Array.isArray(novel.tags)) {
      tags = novel.tags;
    } else if (typeof novel.tags === 'string' && novel.tags) {
      tags = (novel.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    if (tags.length > 0) {
      tagChips = (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tags.map((tag, idx) => (
            <Chip key={idx} label={TAG_LABELS[tag] || tag} color="primary" variant="outlined" />
          ))}
        </Stack>
      );
    } else {
      tagChips = <Typography color="text.secondary">无</Typography>;
    }
  }

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  if (!novel) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>未找到小说信息</Box>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold">
            {editMode ? '编辑小说信息' : novel.title}
          </Typography>
          {!editMode && <Button variant="outlined" onClick={handleEdit}>编辑</Button>}
        </Stack>
        {!editMode && (
          <Stack direction="row" spacing={2} mb={2}>
            <Chip label={`作者：${novel.author}`} />
            <Chip label={`分类：${CATEGORY_LABELS[novel.category] || novel.category || '未分类'}`} />
            <Chip label={`字数：${novel.word_count}`} />
            <Chip label={`章节数：${getTotalChapters(novel)}`} />
          </Stack>
        )}
        {/* 标签编辑 */}
        {!editMode && (
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={500} mb={1}>标签</Typography>
            {tagChips}
          </Box>
        )}
        {!editMode && (
          <Typography variant="body1" color="text.secondary" mb={2}>
            {novel.description}
          </Typography>
        )}
        {!editMode && getCoverImage(novel) && (
          <Box sx={{ my: 2 }}>
            <img src={getCoverImage(novel)} alt="封面" style={{ maxWidth: 200, borderRadius: 8 }} />
          </Box>
        )}
        {editMode && (
          <NovelForm
            mode="edit"
            initialData={editData}
            loading={saving}
            categories={CATEGORIES}
            onSubmit={async (data) => {
              if (!novel_id) return;
              setSaving(true);
              try {
                // 构造接口所需参数
                const payload = {
                  ...data,
                  novel_id: Number(novel_id),
                  cover_image: data.cover_url || '',
                  tags: Array.isArray(data.tags) ? data.tags.join(',') : (data.tags || ''),
                };
                (payload as Record<string, unknown>).cover_url && delete (payload as Record<string, unknown>).cover_url;
                const res = await updateNovel(novel_id, payload);
                if (res.data.code === 1) {
                  alert('保存成功');
                  setEditMode(false);
                  getNovelDetail(novel_id).then(r => {
                    if (r.data.code === 1 && r.data.data) {
                      setNovel(r.data.data);
                      setEditData(r.data.data);
                    }
                  });
                } else {
                  alert(res.data.msg || '保存失败');
                }
              } catch {
                alert('保存失败');
              } finally {
                setSaving(false);
              }
            }}
            onCancel={handleCancel}
          />
        )}
        <Typography variant="body2" color="text.secondary" mb={2}>
          创建时间：{novel.created_at} &nbsp;|&nbsp; 更新时间：{novel.updated_at}
        </Typography>
      </Paper>
    </Box>
  );
};

export default NovelDetail; 