import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import MDEditor from '@uiw/react-md-editor';
import { useParams } from 'react-router-dom';
import { getNovelChapters, createNovelChapter } from '../api/novels';
import type { NovelChapter } from '../api/novel.define';

const CreateChapter: React.FC = () => {
  const { novelId } = useParams();
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [mdValue, setMdValue] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');

  useEffect(() => {
    if (!novelId) return;
    setLoading(true);
    getNovelChapters(novelId, { page, page_size: pageSize })
      .then(res => {
        if (res.data.code === 1 && res.data.data) {
          setChapters(res.data.data.list);
          setTotal(res.data.data.total);
          if (selectedChapterId) {
            const chapter = res.data.data.list.find((c: NovelChapter) => c.id === selectedChapterId);
            setChapterTitle(chapter ? chapter.title : '');
            setMdValue(chapter ? chapter.content || '' : '');
          }
        }
      })
      .finally(() => setLoading(false));
  }, [novelId, page, pageSize, selectedChapterId]);

  const handleSelectChapter = (id: string) => {
    setSelectedChapterId(id);
    setIsCreating(false);
    const chapter = chapters.find(c => c.id === id);
    setMdValue(chapter ? chapter.content || '' : '');
    setChapterTitle(chapter ? chapter.title : '');
  };

  const handleAddChapter = () => {
    setIsCreating(true);
    setSelectedChapterId(null);
    setMdValue('');
    setChapterTitle('');
  };

  const handleDialogOk = () => {
    setDialogOpen(false);
    setIsCreating(true);
    setSelectedChapterId(null);
    setMdValue('');
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setNewChapterTitle('');
  };

  const handleSaveContent = async () => {
    if (!novelId) return;
    if (isCreating) {
      if (!chapterTitle.trim()) {
        alert('请输入章节标题');
        return;
      }
      setSaving(true);
      try {
        const res = await createNovelChapter(novelId, { title: chapterTitle, content: mdValue });
        if (res.data.code === 1 && res.data.data?.id) {
          alert('章节创建成功！');
          setIsCreating(false);
          setChapterTitle('');
          getNovelChapters(novelId, { page, page_size: pageSize }).then(r => {
            if (r.data.code === 1 && r.data.data) {
              setChapters(r.data.data.list);
              setTotal(r.data.data.total);
              setSelectedChapterId(res.data.data.id);
              const chapter = r.data.data.list.find((c: NovelChapter) => c.id === res.data.data.id);
              setMdValue(chapter ? chapter.content || '' : '');
            }
          });
        } else {
          alert(res.data.msg || '创建失败');
        }
      } catch {
        alert('创建失败');
      } finally {
        setSaving(false);
      }
    } else if (selectedChapterId) {
      const chapter = chapters.find(c => c.id === selectedChapterId);
      if (!chapter) return;
      setSaving(true);
      try {
        const res = await createNovelChapter(novelId, {
          title: chapterTitle,
          content: mdValue,
          chapter_id: chapter.id as unknown as number
        });
        if (res.data.code === 1) {
          alert('章节保存成功！');
          getNovelChapters(novelId, { page, page_size: pageSize }).then(r => {
            if (r.data.code === 1 && r.data.data) {
              setChapters(r.data.data.list);
              setTotal(r.data.data.total);
              setSelectedChapterId(chapter.id);
              const updated = r.data.data.list.find((c: NovelChapter) => c.id === chapter.id);
              setMdValue(updated ? updated.content || '' : '');
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
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f7f8fa' }}>
      {/* 左侧章节列表 */}
      <Paper elevation={1} sx={{ width: 260, p: 2, borderRadius: 0, borderRight: '1px solid #eee', bgcolor: '#fff' }}>
        <Button variant="contained" fullWidth onClick={handleAddChapter} sx={{ mb: 2 }}>
          新建章节
        </Button>
        <Divider sx={{ mb: 2 }} />
        <List>
          {loading ? (
            <ListItem><ListItemText primary="加载中..." /></ListItem>
          ) : chapters.length === 0 ? (
            <ListItem><ListItemText primary="暂无章节" /></ListItem>
          ) : chapters.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedChapterId === item.id}
                onClick={() => handleSelectChapter(item.id)}
              >
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* 分页 */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)} size="small">上一页</Button>
          <Box sx={{ mx: 1, alignSelf: 'center' }}>{page} / {Math.ceil(total / pageSize) || 1}</Box>
          <Button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)} size="small">下一页</Button>
        </Box>
        <Dialog open={dialogOpen} onClose={handleDialogCancel} maxWidth="xs" fullWidth>
          <DialogTitle>新建章节</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="章节标题"
              fullWidth
              value={newChapterTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChapterTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCancel}>取消</Button>
            <Button onClick={handleDialogOk} variant="contained">确定</Button>
          </DialogActions>
        </Dialog>
      </Paper>
      {/* 右侧编辑区 */}
      <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
        {isCreating ? (
          <Stack spacing={3}>
            <TextField
              label="章节标题"
              value={chapterTitle}
              onChange={e => setChapterTitle(e.target.value)}
              sx={{ fontSize: 18, width: 400 }}
              inputProps={{ maxLength: 100 }}
              autoFocus
            />
            <Box>
              <MDEditor
                value={mdValue}
                height={400}
                onChange={(v: string | undefined) => setMdValue(v || '')}
                previewOptions={{
                  style: { background: '#fff' }
                }}
              />
            </Box>
            <Box>
              <Button variant="contained" onClick={handleSaveContent} disabled={saving}>
                {saving ? '保存中...' : '保存章节'}
              </Button>
            </Box>
          </Stack>
        ) : selectedChapterId ? (
          <Stack spacing={3}>
            <TextField
              label="章节标题"
              value={chapterTitle}
              onChange={e => setChapterTitle(e.target.value)}
              inputProps={{ maxLength: 100 }}
              sx={{ fontSize: 18, width: 400 }}
            />
            <Box>
              <MDEditor
                value={mdValue}
                height={400}
                onChange={(v: string | undefined) => setMdValue(v || '')}
                previewOptions={{
                  style: { background: '#fff' }
                }}
              />
            </Box>
            <Box>
              <Button variant="contained" onClick={handleSaveContent} disabled={saving}>
                {saving ? '保存中...' : '保存正文'}
              </Button>
            </Box>
          </Stack>
        ) : (
          <Box sx={{ color: '#aaa', mt: 8, textAlign: 'center' }}>请选择左侧章节或新建章节</Box>
        )}
      </Box>
    </Box>
  );
};

export default CreateChapter; 