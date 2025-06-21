import type { ErrorCodeType, ApiError } from './errorCodes';

// 通用响应接口
export interface ApiResponse<T = unknown> {
  code: number | ErrorCodeType;
  msg: string;
  data: T;
  error?: ApiError;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  total: number;
  list: T[];
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  page_size: number;
}

// 排序参数
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// 查询参数（包含分页和排序）
export interface QueryParams extends PaginationParams {
  sort?: SortParams;
  keyword?: string;
  status?: number | string;
  [key: string]: unknown;
}

// 文件上传响应
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// 操作结果响应
export interface OperationResult {
  success: boolean;
  message: string;
  data?: unknown;
}

// 批量操作响应
export interface BatchOperationResponse extends ApiResponse<{
  success: number;
  failed: number;
  errors?: Array<{ id: string; error: string }>;
}> {} 