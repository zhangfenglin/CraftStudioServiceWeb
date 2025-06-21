import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Stack
} from '@mui/material';
import { useErrorHandler, useAsyncErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ErrorCode } from '../api/errorCodes';

/**
 * 错误处理使用示例组件
 * 展示如何使用新的错误处理系统
 */
export const ErrorHandlingExample: React.FC = () => {
  // 基础错误处理 Hook
  const { errorState, handleError, clearError, showError } = useErrorHandler();
  
  // 异步操作错误处理 Hook
  const { errorState: asyncErrorState, executeAsync, clearError: clearAsyncError } = useAsyncErrorHandler();

  // 模拟不同类型的错误
  const simulateBusinessError = () => {
    handleError({
      code: ErrorCode.PROJECT_NOT_FOUND,
      message: '项目不存在',
      details: '尝试访问ID为123的项目时发现该项目已被删除',
      timestamp: new Date().toISOString()
    });
  };

  const simulateAuthError = () => {
    handleError({
      code: ErrorCode.TOKEN_EXPIRED,
      message: '访问令牌已过期',
      details: '您的登录会话已过期，请重新登录',
      timestamp: new Date().toISOString()
    });
  };

  const simulateSystemError = () => {
    handleError({
      code: ErrorCode.DATABASE_ERROR,
      message: '数据库操作错误',
      details: '连接数据库时发生超时错误',
      timestamp: new Date().toISOString()
    });
  };

  const simulateNetworkError = () => {
    handleError({
      code: ErrorCode.NETWORK_ERROR,
      message: '网络连接错误',
      details: '无法连接到服务器，请检查网络连接',
      timestamp: new Date().toISOString()
    });
  };

  // 模拟异步操作
  const simulateAsyncOperation = async (shouldFail: boolean = false) => {
    return executeAsync(
      async () => {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (shouldFail) {
          throw new Error('模拟的异步操作失败');
        }
        
        return { success: true, data: '操作成功完成' };
      },
      (result) => {
        console.log('异步操作成功:', result);
      },
      (error) => {
        console.log('异步操作失败:', error);
      }
    );
  };

  // 模拟自定义错误消息
  const simulateCustomError = () => {
    showError('这是一个自定义错误消息', ErrorCode.VALIDATION_FAILED);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        错误处理系统使用示例
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={4}>
        这个示例展示了如何使用新的错误处理系统来处理各种类型的错误。
      </Typography>

      {/* 基础错误处理示例 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            基础错误处理
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            使用 useErrorHandler Hook 处理各种类型的错误
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <Button 
              variant="outlined" 
              color="info"
              onClick={simulateBusinessError}
            >
              业务错误
            </Button>
            <Button 
              variant="outlined" 
              color="warning"
              onClick={simulateAuthError}
            >
              认证错误
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={simulateSystemError}
            >
              系统错误
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={simulateNetworkError}
            >
              网络错误
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={simulateCustomError}
            >
              自定义错误
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={clearError}
            >
              清除错误
            </Button>
          </Stack>

          {/* 错误显示 */}
          <Box sx={{ mt: 3 }}>
            <ErrorDisplay 
              error={errorState.error}
              onClose={clearError}
              showDetails={true}
              variant="card"
            />
          </Box>
        </CardContent>
      </Card>

      {/* 异步错误处理示例 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            异步操作错误处理
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            使用 useAsyncErrorHandler Hook 处理异步操作的错误
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => simulateAsyncOperation(false)}
            >
              成功操作
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => simulateAsyncOperation(true)}
            >
              失败操作
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={clearAsyncError}
            >
              清除错误
            </Button>
          </Stack>

          {/* 异步错误显示 */}
          <Box sx={{ mt: 3 }}>
            <ErrorDisplay 
              error={asyncErrorState.error}
              onClose={clearAsyncError}
              onRetry={() => simulateAsyncOperation(false)}
              showDetails={true}
            />
          </Box>
        </CardContent>
      </Card>

      {/* 错误代码使用示例 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            错误代码使用示例
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            展示如何使用预定义的错误代码和错误处理工具
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                错误代码枚举
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1,
                fontSize: '0.875rem'
              }}>
{`ErrorCode.SUCCESS = ${ErrorCode.SUCCESS}
ErrorCode.PROJECT_NOT_FOUND = ${ErrorCode.PROJECT_NOT_FOUND}
ErrorCode.TOKEN_EXPIRED = ${ErrorCode.TOKEN_EXPIRED}
ErrorCode.DATABASE_ERROR = ${ErrorCode.DATABASE_ERROR}`}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                错误处理工具
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1,
                fontSize: '0.875rem'
              }}>
{`// 获取错误消息
ErrorHandler.getErrorMessage(ErrorCode.PROJECT_NOT_FOUND)

// 检查错误类型
ErrorHandler.isBusinessError(code)
ErrorHandler.isSystemError(code)
ErrorHandler.isAuthError(code)`}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorHandlingExample; 