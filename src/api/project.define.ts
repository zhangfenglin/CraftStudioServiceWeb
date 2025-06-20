import type { PaginatedResponse } from './types';

// 项目状态常量
export const ProjectStatus = {
  SERIALIZING: 1,
  COMPLETED: 2
} as const;

// 项目状态类型
export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];

// 项目基础模型
export interface Project {
  id: string;
  name: string;
  desc: string;
  status: ProjectStatusType;
}

// 创建项目请求模型
export interface CreateProjectRequest {
  name: string;
  desc: string;
}

// 创建项目响应模型
export interface CreateProjectResponse {
  id: string;
}

// 更新项目请求模型
export interface UpdateProjectRequest {
  name?: string;
  desc?: string;
  status?: ProjectStatusType;
}

// 分页请求参数模型
export interface ProjectListParams {
  page: number;
  size: number;
  status?: ProjectStatusType;
  keyword?: string;
}

// 项目列表响应模型
export type ProjectListResponse = PaginatedResponse<Project>;

// 项目详情响应模型
export type ProjectDetailResponse = Project; 