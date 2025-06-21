import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Stack,
  Alert
} from '@mui/material';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ErrorCode } from '../api/errorCodes';
import ProjectForm from '../components/ProjectForm';

/**
 * 项目创建错误处理示例
 * 展示如何处理各种创建项目的错误情况
 */
export const ProjectCreationErrorExample: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errorState, handleError, clearError } = useErrorHandler();

  // 模拟创建项目的 API 调用
  const simulateCreateProject = async (formData: { name: string; desc: string }) => {
    setLoading(true);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟不同的错误情况
    if (formData.name === 'error') {
      throw new Error('网络连接失败');
    }
    
    if (formData.name === 'duplicate') {
      // 模拟项目名称重复错误
      const error = {
        code: ErrorCode.PROJECT_ALREADY_EXISTS,
        message: '项目名称已存在',
        details: '请使用其他项目名称',
        timestamp: new Date().toISOString()
      };
      throw error;
    }
    
    if (formData.name === 'validation') {
      // 模拟参数验证错误
      const error = {
        code: ErrorCode.VALIDATION_FAILED,
        message: '项目名称格式不正确',
        details: '项目名称不能包含特殊字符',
        timestamp: new Date().toISOString()
      };
      throw error;
    }
    
    if (formData.name === 'server') {
      // 模拟服务器错误
      const error = {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: '服务器内部错误',
        details: '请稍后重试',
        timestamp: new Date().toISOString()
      };
      throw error;
    }
    
    if (formData.name === 'auth') {
      // 模拟认证错误
      const error = {
        code: ErrorCode.TOKEN_EXPIRED,
        message: '登录已过期',
        details: '请重新登录',
        timestamp: new Date().toISOString()
      };
      throw error;
    }
    
    // 成功情况
    return { success: true, data: { id: '123', ...formData } };
  };

  // 处理表单提交
  const handleSubmit = async (formData: { name: string; desc: string }) => {
    try {
      clearError();
      const result = await simulateCreateProject(formData);
      
      if (result.success) {
        console.log('项目创建成功:', result.data);
        setFormOpen(false);
        // 这里可以显示成功提示
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // 测试不同的错误场景
  const testErrorScenarios = [
    {
      name: '网络错误',
      description: '输入 "error" 作为项目名称',
      errorType: 'Network Error'
    },
    {
      name: '项目名称重复',
      description: '输入 "duplicate" 作为项目名称',
      errorType: 'Business Error'
    },
    {
      name: '参数验证失败',
      description: '输入 "validation" 作为项目名称',
      errorType: 'Validation Error'
    },
    {
      name: '服务器错误',
      description: '输入 "server" 作为项目名称',
      errorType: 'System Error'
    },
    {
      name: '认证错误',
      description: '输入 "auth" 作为项目名称',
      errorType: 'Auth Error'
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        项目创建错误处理示例
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={4}>
        这个示例展示了如何处理项目创建过程中的各种错误情况。
      </Typography>

      {/* 错误场景说明 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            测试错误场景
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            在项目创建表单中输入以下名称来测试不同的错误情况：
          </Typography>
          
          <Stack spacing={2}>
            {testErrorScenarios.map((scenario, index) => (
              <Box key={index} sx={{ 
                p: 2, 
                border: '1px solid #e0e3e7', 
                borderRadius: 2,
                background: '#f8f9fa'
              }}>
                <Typography variant="subtitle2" fontWeight={600} color="primary">
                  {scenario.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scenario.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  错误类型: {scenario.errorType}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            操作
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              打开创建项目表单
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={clearError}
            >
              清除错误
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* 错误显示 */}
      {errorState.hasError && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              错误信息
            </Typography>
            <ErrorDisplay 
              error={errorState.error}
              onClose={clearError}
              showDetails={true}
              variant="card"
            />
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            使用说明
          </Typography>
          <Stack spacing={2}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>错误处理流程：</strong>
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                1. 用户在表单中输入数据并提交
              </Typography>
              <Typography variant="body2" component="div">
                2. 系统调用 API 创建项目
              </Typography>
              <Typography variant="body2" component="div">
                3. 如果发生错误，错误信息会显示在表单顶部
              </Typography>
              <Typography variant="body2" component="div">
                4. 用户可以查看错误详情并重新提交
              </Typography>
            </Alert>
            
            <Alert severity="success">
              <Typography variant="body2">
                <strong>错误类型处理：</strong>
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                • <strong>业务错误：</strong> 项目名称重复、参数验证失败等
              </Typography>
              <Typography variant="body2" component="div">
                • <strong>系统错误：</strong> 服务器内部错误、数据库错误等
              </Typography>
              <Typography variant="body2" component="div">
                • <strong>网络错误：</strong> 连接超时、网络中断等
              </Typography>
              <Typography variant="body2" component="div">
                • <strong>认证错误：</strong> Token 过期、权限不足等
              </Typography>
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      {/* 项目创建表单 */}
      <ProjectForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={loading}
        error={errorState.error}
        onClearError={clearError}
      />
    </Box>
  );
};

export default ProjectCreationErrorExample; 