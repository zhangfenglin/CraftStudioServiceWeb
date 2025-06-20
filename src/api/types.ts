// 通用响应接口
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  total: number;
  list: T[];
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  size: number;
} 