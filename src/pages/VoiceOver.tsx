import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  RecordVoiceOver as VoiceIcon,
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getNovels, getNovelChapters } from '../api/novels';
import MDEditor from '@uiw/react-md-editor';

// 类型定义
interface Novel {
  id: string;
  title: string;
  author: string;
  category: string;
}

interface Character {
  name: string;
  voice_id: string;
  voice_name: string;
  gender: string;
  age_group: string;
  character_type: string;
  personality: string;
  background: string;
  voice_characteristics: {
    tone: string;
    speed: string;
    volume: string;
    emotion_range: string;
  };
  audio_settings: {
    default_speed: number;
    default_volume: number;
    pitch_adjustment: number;
    rate_adjustment: number;
  };
}

interface DialogueItem {
  id: string;
  content_type: 'dialogue' | 'narration';
  speaker?: string;
  content: string;
  voice_config: {
    voice_id: string;
    speed: number;
    pitch: number;
    volume: number;
    emotion: string;
  };
  estimated_duration: number;
  pause_after: number;
}

const VoiceOver: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  
  // 选择状态
  const [novelList, setNovelList] = useState<Novel[]>([]);
  const [novelLoading, setNovelLoading] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<string>('');
  const [chapterList, setChapterList] = useState<any[]>([]);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [chapterContent, setChapterContent] = useState<string>('');
  
  // 分析状态
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editingAnalysis, setEditingAnalysis] = useState<any>(null);
  
  // 对话框状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<'character' | 'dialogue'>('character');
  const [editIndex, setEditIndex] = useState<number>(-1);

  // 获取小说列表
  useEffect(() => {
    setNovelLoading(true);
    getNovels({ page: 1, page_size: 100 }).then(res => {
      if (res.data && res.data.code === 1 && res.data.data?.list) {
        setNovelList(res.data.data.list);
      }
    }).finally(() => setNovelLoading(false));
  }, []);

  // 获取章节列表
  useEffect(() => {
    if (selectedNovel) {
      setChapterLoading(true);
      getNovelChapters(selectedNovel, { page: 1, page_size: 100 }).then(res => {
        if (res.data && res.data.code === 1 && res.data.data?.list) {
          setChapterList(res.data.data.list);
        } else {
          setChapterList([]);
        }
      }).finally(() => setChapterLoading(false));
    } else {
      setChapterList([]);
    }
    setSelectedChapter('');
    setChapterContent('');
  }, [selectedNovel]);

  // 获取章节内容
  useEffect(() => {
    if (selectedChapter) {
      const chapter = chapterList.find(c => c.id === selectedChapter);
      if (chapter) {
        setChapterContent(chapter.content || '');
      } else {
        setChapterContent('');
      }
    } else {
      setChapterContent('');
    }
  }, [selectedChapter, chapterList]);

  // 模拟角色分析
  const handleAnalyzeContent = async () => {
    if (!chapterContent.trim()) {
      alert('请先选择章节内容');
      return;
    }

    setIsAnalyzing(true);
    
    // 模拟API调用
    setTimeout(() => {
      setAnalysisResult(mockCharacterAnalysis);
      setEditingAnalysis(JSON.parse(JSON.stringify(mockCharacterAnalysis))); // 深拷贝
      setIsAnalyzing(false);
    }, 2000);
  };

  // 编辑角色或对话
  const handleEdit = (type: 'character' | 'dialogue', index: number) => {
    setEditTarget(type);
    setEditIndex(index);
    setEditDialogOpen(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editIndex >= 0) {
      setEditingAnalysis((prev: any) => {
        const newData = JSON.parse(JSON.stringify(prev));
        if (editTarget === 'character') {
          newData.characters[editIndex] = { ...newData.characters[editIndex] };
        } else {
          newData.dialogue_items[editIndex] = { ...newData.dialogue_items[editIndex] };
        }
        return newData;
      });
    }
    setEditDialogOpen(false);
  };

  const renderNovelSelection = () => (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        选择小说和章节
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>选择小说</InputLabel>
            <Select
              value={selectedNovel}
              label="选择小说"
              onChange={(e) => setSelectedNovel(e.target.value)}
              disabled={novelLoading}
            >
              {novelList.map((novel) => (
                <MenuItem key={novel.id} value={novel.id}>
                  {novel.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth disabled={!selectedNovel}>
            <InputLabel>选择章节</InputLabel>
            <Select
              value={selectedChapter}
              label="选择章节"
              onChange={(e) => setSelectedChapter(e.target.value)}
              disabled={chapterLoading || !selectedNovel}
            >
              {chapterList.map((chapter) => (
                <MenuItem key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {chapterContent && (
        <MarkdownPreviewWithMaximize content={chapterContent} onAnalyze={handleAnalyzeContent} analyzing={isAnalyzing} />
      )}
    </Paper>
  );

  const renderAnalysisResult = () => (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          角色分析结果
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setEditingAnalysis(JSON.parse(JSON.stringify(analysisResult)))}
          startIcon={<RefreshIcon />}
        >
          重置修改
        </Button>
      </Stack>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="角色配置" />
        <Tab label="对话拆解" />
        <Tab label="旁白配置" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Typography variant="subtitle1" mb={2}>角色列表</Typography>
          {editingAnalysis?.characters.map((character: Character, index: number) => (
            <Card key={character.name} sx={{ mb: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {character.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {character.character_type} - {character.personality}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip label={character.voice_name} size="small" />
                      <Chip label={character.gender} size="small" />
                      <Chip label={character.age_group} size="small" />
                    </Stack>
                  </Box>
                  <IconButton onClick={() => handleEdit('character', index)}>
                    <EditIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="subtitle1" mb={2}>对话拆解</Typography>
          {editingAnalysis?.dialogue_items.map((item: DialogueItem, index: number) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} mb={1}>
                      <Chip 
                        label={item.content_type === 'dialogue' ? '对话' : '旁白'} 
                        size="small" 
                        color={item.content_type === 'dialogue' ? 'primary' : 'secondary'}
                      />
                      {item.speaker && (
                        <Chip label={item.speaker} size="small" variant="outlined" />
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {item.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      预估时长: {item.estimated_duration}秒 | 停顿: {item.pause_after}秒
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleEdit('dialogue', index)}>
                    <EditIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="subtitle1" mb={2}>旁白配置</Typography>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{editingAnalysis?.narrator.voice_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {editingAnalysis?.narrator.description}
                  </Typography>
                </Box>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f8fa', py: 6, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header 已移除 */}

      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={1} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 4, boxShadow: '0 2px 16px rgba(25,118,210,0.04)' }}>
          {renderNovelSelection()}
        </Paper>

        {analysisResult && (
          <Paper elevation={1} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 4, boxShadow: '0 2px 16px rgba(25,118,210,0.04)' }}>
            {renderAnalysisResult()}
          </Paper>
        )}
      </Box>

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          编辑{editTarget === 'character' ? '角色' : '对话'}配置
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            这里可以编辑{editTarget === 'character' ? '角色' : '对话'}的详细配置信息
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={JSON.stringify(
              editTarget === 'character' 
                ? editingAnalysis?.characters[editIndex] 
                : editingAnalysis?.dialogue_items[editIndex], 
              null, 
              2
            )}
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            保存修改
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Markdown 预览及最大化组件
function MarkdownPreviewWithMaximize({ content, onAnalyze, analyzing }: { content: string; onAnalyze: () => void; analyzing: boolean }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" mb={2}>
        章节内容预览
      </Typography>
      <MDEditor
        value={content}
        preview="preview"
        height={320}
        data-color-mode="light"
        style={{ background: '#fafbfc', minHeight: 180 }}
      />
      <Button
        variant="contained"
        onClick={onAnalyze}
        disabled={analyzing}
        startIcon={analyzing ? <CircularProgress size={20} /> : <VoiceIcon />}
        sx={{ mt: 2 }}
      >
        {analyzing ? '分析中...' : '开始角色分析'}
      </Button>
    </Box>
  );
}

export default VoiceOver; 