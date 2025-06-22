import request from './request';
import type { Workflow, CreateWorkflowRequest, UpdateWorkflowRequest } from './workflow.define';
import type { ApiResponse, PaginatedResponse } from './types';

// 工作流列表参数
export interface WorkflowListParams {
  page?: number;
  page_size?: number;
  query?: string;
  status?: 'draft' | 'active' | 'inactive';
}

// 工作流详情响应
export interface WorkflowDetailResponse {
  workflow: Workflow;
}

// 获取工作流列表
export const getWorkflows = (params: WorkflowListParams) => {
  return request.get<ApiResponse<PaginatedResponse<Workflow>>>('/workflows', { params });
};

// 获取工作流详情
export const getWorkflow = (id: string) => {
  return request.get<ApiResponse<WorkflowDetailResponse>>(`/workflows/${id}`);
};

// 创建工作流
export const createWorkflow = (data: CreateWorkflowRequest) => {
  return request.post<ApiResponse<Workflow>>('/workflows', data);
};

// 更新工作流
export const updateWorkflow = (id: string, data: UpdateWorkflowRequest) => {
  return request.put<ApiResponse<Workflow>>(`/workflows/${id}`, data);
};

// 删除工作流
export const deleteWorkflow = (id: string) => {
  return request.delete<ApiResponse<void>>(`/workflows/${id}`);
};

// 批量删除工作流
export const batchDeleteWorkflows = (ids: string[]) => {
  return request.delete<ApiResponse<void>>('/workflows/batch', { data: { ids } });
}; 