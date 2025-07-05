import React, { useState } from 'react';
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
import { useParams, useLocation } from 'react-router-dom';

// mock 章节数据
const initialChapters = [
  { id: 1, title: '第一章 意外的访客', content: '这里是第一章内容...' },
  { id: 2, title: '第二章 神秘的信件', content: '这里是第二章内容...' },
];

const CreateChapter: React.FC = () => {
  const { novelId } = useParams();
  const location = useLocation();
  const novelTitle = location.state?.novelTitle;
  const [chapters, setChapters] = useState(initialChapters);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [mdValue, setMdValue] = useState<string>('');

  const handleSelectChapter = (id: number) => {
    setSelectedChapterId(id);
    const chapter = chapters.find(c => c.id === id);
    setMdValue(chapter ? chapter.content : '');
  };

  const handleAddChapter = () => {
    setDialogOpen(true);
  };

  const handleDialogOk = () => {
    if (newChapterTitle.trim()) {
      const newId = chapters.length ? Math.max(...chapters.map(c => c.id)) + 1 : 1;
      setChapters([...chapters, { id: newId, title: newChapterTitle, content: '' }]);
      setNewChapterTitle('');
      setDialogOpen(false);
    }
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setNewChapterTitle('');
  };

  const handleSaveContent = () => {
    if (selectedChapterId !== null) {
      setChapters(chapters.map(c => c.id === selectedChapterId ? { ...c, content: mdValue } : c));
    }
  };

  const selectedChapter = chapters.find(c => c.id === selectedChapterId);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f7f8fa' }}>
      {/* 左侧章节列表 */}
      <Paper elevation={1} sx={{ width: 260, p: 2, borderRadius: 0, borderRight: '1px solid #eee', bgcolor: '#fff' }}>
        <Button variant="contained" fullWidth onClick={handleAddChapter} sx={{ mb: 2 }}>
          新建章节
        </Button>
        <Divider sx={{ mb: 2 }} />
        <List>
          {chapters.map((item) => (
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
        {selectedChapter ? (
          <Stack spacing={3}>
            <TextField
              label="章节标题"
              value={selectedChapter.title}
              InputProps={{ readOnly: true }}
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
              <Button variant="contained" onClick={handleSaveContent}>保存正文</Button>
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