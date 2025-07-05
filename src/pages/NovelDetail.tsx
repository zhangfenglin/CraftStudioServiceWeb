import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNovelDetail } from '../api/novels';
import type { Novel } from '../api/novel.define';
import { Box, Typography, Paper, CircularProgress, Chip, Stack } from '@mui/material';

const NovelDetail: React.FC = () => {
  const { novel_id } = useParams();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!novel_id) return;
    setLoading(true);
    getNovelDetail(novel_id)
      .then(res => {
        if (res.data.code === 1 && res.data.data) {
          setNovel(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [novel_id]);

  // 类型保护
  const getTotalChapters = (novel: Novel) => {
    return (novel as { total_chapters?: number }).total_chapters ?? novel.chapter_count ?? 0;
  };
  const getCoverImage = (novel: Novel) => {
    return (novel as { cover_image?: string }).cover_image;
  };

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  if (!novel) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>未找到小说信息</Box>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {novel.title}
        </Typography>
        <Stack direction="row" spacing={2} mb={2}>
          <Chip label={`作者：${novel.author}`} />
          <Chip label={`分类：${novel.category}`} />
          <Chip label={`字数：${novel.word_count}`} />
          <Chip label={`章节数：${getTotalChapters(novel)}`} />
        </Stack>
        <Typography variant="body1" color="text.secondary" mb={2}>
          {novel.description}
        </Typography>
        {getCoverImage(novel) && (
          <Box sx={{ my: 2 }}>
            <img src={getCoverImage(novel)} alt="封面" style={{ maxWidth: 200, borderRadius: 8 }} />
          </Box>
        )}
        <Typography variant="body2" color="text.secondary">
          创建时间：{novel.created_at} &nbsp;|&nbsp; 更新时间：{novel.updated_at}
        </Typography>
      </Paper>
    </Box>
  );
};

export default NovelDetail; 