// 工作流相关类型定义

export interface WorkflowNode {
  id: string;
  name: string;
  type: 'start' | 'process' | 'decision' | 'end';
  position: {
    x: number;
    y: number;
  };
  data?: Record<string, unknown>;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'inactive';
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  nodes?: WorkflowNode[];
  connections?: WorkflowConnection[];
  status?: 'draft' | 'active' | 'inactive';
} 