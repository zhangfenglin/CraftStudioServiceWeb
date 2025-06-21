import type { PaginatedResponse } from './types';

// 发布单状态常量
export const ReleaseOrderStatus = {
  DRAFT: 0,        // 草稿
  PENDING: 1,      // 待审核
  APPROVED: 2,     // 已审核
  REJECTED: 3,     // 已拒绝
  RELEASING: 4,    // 发布中
  RELEASED: 5,     // 已发布
  FAILED: 6        // 发布失败
} as const;

// 发布单状态类型
export type ReleaseOrderStatusType = typeof ReleaseOrderStatus[keyof typeof ReleaseOrderStatus];

// 项目信息模型
export interface ProjectInfo {
  id: string;
  name: string;
  desc: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// 发布单基础模型
export interface ReleaseOrder {
  id: number;
  project_info: ProjectInfo;
  name: string;
  desc: string;
  status: ReleaseOrderStatusType;
  created_at: string;
  updated_at: string;
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
  name?: string;
  desc?: string;
  project_id?: number;
  status?: ReleaseOrderStatusType;
}

// 发布单列表请求参数模型
export interface ReleaseOrderListParams {
  page: number;
  page_size: number;
  status?: ReleaseOrderStatusType;
  project_id?: string;
  keyword?: string;
  created_by?: string;
}

// 发布单列表响应模型
export type ReleaseOrderListResponse = PaginatedResponse<ReleaseOrder>;

// 发布单详情响应模型
export type ReleaseOrderDetailResponse = ReleaseOrder; 