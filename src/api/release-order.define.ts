import type { PaginatedResponse } from './types';

// 发布单状态常量
export const ReleaseOrderStatus = {
  DRAFT: 1,        // 草稿
  PENDING: 2,      // 待审核
  APPROVED: 3,     // 已审核
  REJECTED: 4,     // 已拒绝
  RELEASING: 5,    // 发布中
  RELEASED: 6,     // 已发布
  FAILED: 7        // 发布失败
} as const;

// 发布单状态类型
export type ReleaseOrderStatusType = typeof ReleaseOrderStatus[keyof typeof ReleaseOrderStatus];

// 发布单基础模型
export interface ReleaseOrder {
  id: string;
  title: string;
  project_id: string;
  project_name: string;
  version: string;
  description: string;
  status: ReleaseOrderStatusType;
  created_by: string;
  created_at: string;
  updated_at: string;
  released_at?: string;
  reviewer?: string;
  review_comment?: string;
}

// 创建发布单请求模型
export interface CreateReleaseOrderRequest {
  name: string;
  desc: string;
  project_id: number;
}

// 创建发布单响应模型
export interface CreateReleaseOrderResponse {
  id: string;
}

// 更新发布单请求模型
export interface UpdateReleaseOrderRequest {
  title?: string;
  project_id?: string;
  version?: string;
  description?: string;
  status?: ReleaseOrderStatusType;
}

// 发布单列表请求参数模型
export interface ReleaseOrderListParams {
  page: number;
  size: number;
  status?: ReleaseOrderStatusType;
  project_id?: string;
  keyword?: string;
  created_by?: string;
}

// 发布单列表响应模型
export type ReleaseOrderListResponse = PaginatedResponse<ReleaseOrder>;

// 发布单详情响应模型
export type ReleaseOrderDetailResponse = ReleaseOrder; 