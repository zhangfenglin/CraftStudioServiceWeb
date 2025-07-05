import request from './request';
import type { ApiResponse } from './types';
import type { 
  Novel, 
  NovelListParams, 
  NovelListResponse, 
  CreateNovelParams,
  NovelChapter
} from './novel.define';

// 获取小说列表
export const getNovels = (params: NovelListParams = {}) => {
  return request.get<ApiResponse<NovelListResponse>>('/novels/list', { params });
};

// 获取小说详情
export const getNovelDetail = (novelId: string) => {
  return request.get<ApiResponse<Novel>>(`/novels/${novelId}`);
};

// 创建小说
export const createNovel = (data: CreateNovelParams) => {
  return request.post<ApiResponse<{ id: string }>>('/novels/create', data);
};

// 更新小说
export function updateNovel(novel_id: string | number, data: Record<string, unknown>) {
  return request.put(`/novels/${novel_id}`, data);
}

// 删除小说
export const deleteNovel = (id: string) => {
  return request.delete<ApiResponse<void>>(`/novels/${id}`);
};

// 批量删除小说
export const batchDeleteNovels = (ids: string[]) => {
  return request.delete<ApiResponse<{ success: number; failed: number }>>('/novels/batch', {
    data: { ids }
  });
};

// 更新小说状态
export const updateNovelStatus = (id: string, status: string) => {
  return request.patch<ApiResponse<Novel>>(`/novels/${id}/status`, { status });
};

// 获取小说章节列表（分页）
export const getNovelChapters = (novelId: string, params: { page?: number; page_size?: number } = {}) => {
  return request.get<ApiResponse<{ list: NovelChapter[]; total: number }>>(`/novels/${novelId}/chapters/list`, { params });
};

// 创建章节
export const createNovelChapter = (
  novelId: string,
  data: { title: string; content: string; chapter_id?: number | string }
) => {
  return request.post<ApiResponse<{ id: string }>>(`/novels/${novelId}/chapters/save`, {
    novel_id: Number(novelId),
    title: data.title,
    content: data.content,
    ...(data.chapter_id ? { chapter_id: data.chapter_id } : {})
  });
}; 