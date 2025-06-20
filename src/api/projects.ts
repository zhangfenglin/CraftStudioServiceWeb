import request from './request';
import type {
  Project,
  ProjectListParams,
  ProjectListResponse,
  ProjectDetailResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  UpdateProjectRequest
} from './project.define';
import type { ApiResponse } from './types';

// 获取项目列表
export const getProjects = (params: ProjectListParams) => {
  return request.get<ApiResponse<ProjectListResponse>>('/projects', { params });
};

// 获取项目详情
export const getProject = (id: string) => {
  return request.get<ApiResponse<ProjectDetailResponse>>(`/projects/${id}`);
};

// 创建项目
export const createProject = (data: CreateProjectRequest) => {
  return request.post<ApiResponse<CreateProjectResponse>>('/projects', data);
};

// 更新项目
export const updateProject = (id: string, data: UpdateProjectRequest) => {
  return request.put<ApiResponse<Project>>(`/projects/${id}`, data);
};

// 删除项目
export const deleteProject = (id: string) => {
  return request.delete<ApiResponse<void>>(`/projects/${id}`);
}; 