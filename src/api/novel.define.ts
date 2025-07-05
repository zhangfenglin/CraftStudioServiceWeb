// 小说状态枚举
export enum NovelStatus {
  DRAFT = 'draft',           // 草稿
  PUBLISHING = 'publishing', // 连载中
  COMPLETED = 'completed',   // 已完结
  PAUSED = 'paused',         // 暂停
  DELETED = 'deleted'        // 已删除
}

// 小说分类
export interface NovelCategory {
  id: string;
  name: string;
  description?: string;
}

// 小说标签
export interface NovelTag {
  id: string;
  name: string;
  color?: string;
}

// 小说基本信息
export interface Novel {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  status: NovelStatus;
  cover_url?: string;
  description?: string;
  word_count: number;
  chapter_count: number;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  last_chapter_at?: string;
}

// 小说列表查询参数
export interface NovelListParams {
  page?: number;
  page_size?: number;
  title?: string;
  author?: string;
  category?: string;
  tags?: string;
  status?: string;
}

// 小说列表响应
export interface NovelListResponse {
  total: number;
  list: Novel[];
}

// 小说章节
export interface NovelChapter {
  id: string;
  novel_id: string;
  title: string;
  content?: string;
  word_count: number;
  chapter_number: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// 创建小说参数
export interface CreateNovelParams {
  title: string;
  author: string;
  category: string;
  tags?: string[];
  description?: string;
  cover_url?: string;
}

// 更新小说参数
export interface UpdateNovelParams {
  title?: string;
  author?: string;
  category?: string;
  tags?: string[];
  description?: string;
  cover_url?: string;
  status?: NovelStatus;
}

// 小说分类选项（全局复用）
export const CATEGORIES = [
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

// 分类 value => label 映射
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(CATEGORIES.map(c => [c.value, c.label]));

// 预设的标签选项（全局复用）
export const PRESET_TAGS = [
  { value: 'hot', label: '热门', color: '#f44336' },
  { value: 'new', label: '新书', color: '#2196f3' },
  { value: 'recommended', label: '推荐', color: '#4caf50' },
  { value: 'completed', label: '完结', color: '#ff9800' },
  { value: 'ongoing', label: '连载', color: '#9c27b0' }
];

// 标签 value => label 映射
export const TAG_LABELS: Record<string, string> = Object.fromEntries(PRESET_TAGS.map(t => [t.value, t.label])); 