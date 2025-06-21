import request from './request';
import type {
  ReleaseOrder,
  ReleaseOrderListParams,
  ReleaseOrderListResponse,
  ReleaseOrderDetailResponse,
  CreateReleaseOrderRequest,
  CreateReleaseOrderResponse,
  UpdateReleaseOrderRequest
} from './release-order.define';
import type { ApiResponse } from './types';

// 创建发布单
export const createReleaseOrder = (data: CreateReleaseOrderRequest) => {
  return request.post<ApiResponse<CreateReleaseOrderResponse>>('/release/order', data);
};

// 获取发布单列表
export const getReleaseOrders = (params: ReleaseOrderListParams) => {
  return request.get<ApiResponse<ReleaseOrderListResponse>>('/release/orders', { params });
};

// 获取发布单详情
export const getReleaseOrder = (id: string) => {
  return request.get<ApiResponse<ReleaseOrderDetailResponse>>(`/release/order/${id}`);
};

// 更新发布单
export const updateReleaseOrder = (id: string, data: UpdateReleaseOrderRequest) => {
  return request.put<ApiResponse<ReleaseOrder>>(`/release/order/${id}`, data);
};

// 删除发布单
export const deleteReleaseOrder = (id: string) => {
  return request.delete<ApiResponse<void>>(`/release/order/${id}`);
};

// 提交发布单审核
export const submitReleaseOrder = (id: string) => {
  return request.post<ApiResponse<void>>(`/release/order/${id}/submit`);
};

// 审核发布单
export const reviewReleaseOrder = (id: string, approved: boolean, comment?: string) => {
  return request.post<ApiResponse<void>>(`/release/order/${id}/review`, {
    approved,
    comment
  });
};

// 执行发布
export const executeRelease = (id: string) => {
  return request.post<ApiResponse<void>>(`/api/v1/release/order/${id}/execute`);
}; 