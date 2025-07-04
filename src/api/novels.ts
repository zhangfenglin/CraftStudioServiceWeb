import request from './request';
import type { ApiResponse } from './types';
import type { 
  Novel, 
  NovelListParams, 
  NovelListResponse, 
  NovelDetailResponse,
  CreateNovelParams,
  UpdateNovelParams
} from './novel.define';

// 获取小说列表
export const getNovels = (params: NovelListParams = {}) => {
  return request.get<ApiResponse<NovelListResponse>>('/novel/list', { params });
};

// 获取小说详情
export const getNovelDetail = (id: string) => {
  return request.get<ApiResponse<NovelDetailResponse>>(`/novel/${id}`);
};

// 创建小说
export const createNovel = (data: CreateNovelParams) => {
  return request.post<ApiResponse<Novel>>('/novel', data);
};

// 更新小说
export const updateNovel = (id: string, data: UpdateNovelParams) => {
  return request.put<ApiResponse<Novel>>(`/novel/${id}`, data);
};

// 删除小说
export const deleteNovel = (id: string) => {
  return request.delete<ApiResponse<void>>(`/novel/${id}`);
};

// 批量删除小说
export const batchDeleteNovels = (ids: string[]) => {
  return request.delete<ApiResponse<{ success: number; failed: number }>>('/novel/batch', {
    data: { ids }
  });
};

// 更新小说状态
export const updateNovelStatus = (id: string, status: string) => {
  return request.patch<ApiResponse<Novel>>(`/novel/${id}/status`, { status });
}; 