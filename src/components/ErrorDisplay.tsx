import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  Button, 
  Collapse, 
  Typography 
} from '@mui/material';
import { Close as CloseIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import type { ApiError } from '../api/errorCodes';
import { ErrorHandler } from '../api/errorCodes';

// 错误显示组件的属性
export interface ErrorDisplayProps {
  error: ApiError | null;
  onClose?: () => void;
  onRetry?: () => void;
  showDetails?: boolean;
  variant?: 'alert' | 'card';
  severity?: 'error' | 'warning' | 'info';
}

/**
 * 错误显示组件
 * 用于在 UI 中展示错误信息
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onClose,
  onRetry,
  showDetails = false,
  variant = 'alert',
  severity = 'error'
}) => {
  if (!error) {
    return null;
  }

  const isSystemError = ErrorHandler.isSystemError(error.code);
  const isAuthError = ErrorHandler.isAuthError(error.code);
  const isBusinessError = ErrorHandler.isBusinessError(error.code);

  // 根据错误类型确定严重程度
  const getSeverity = (): 'error' | 'warning' | 'info' => {
    if (isSystemError) return 'error';
    if (isAuthError) return 'warning';
    if (isBusinessError) return 'info';
    return severity;
  };

  // 获取错误图标
  const getErrorIcon = () => {
    if (isSystemError) return '🚨';
    if (isAuthError) return '🔐';
    if (isBusinessError) return '⚠️';
    return '❌';
  };

  const errorSeverity = getSeverity();
  const errorIcon = getErrorIcon();

  if (variant === 'card') {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: `${errorSeverity}.main`,
          borderRadius: 1,
          p: 2,
          mb: 2,
          backgroundColor: `${errorSeverity}.light`,
          color: `${errorSeverity}.dark`
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" component="span">
              {errorIcon}
            </Typography>
            <Typography variant="h6" component="span">
              {error.message}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            {onRetry && (
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={onRetry}
                variant="outlined"
              >
                重试
              </Button>
            )}
            {onClose && (
              <Button
                size="small"
                startIcon={<CloseIcon />}
                onClick={onClose}
                variant="outlined"
              >
                关闭
              </Button>
            )}
          </Box>
        </Box>
        
        {showDetails && error.details && (
          <Collapse in={showDetails}>
            <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
              {error.details}
            </Typography>
          </Collapse>
        )}
        
        {error.timestamp && (
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
            时间: {new Date(error.timestamp).toLocaleString()}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Alert
      severity={errorSeverity}
      onClose={onClose}
      action={
        <Box display="flex" gap={1}>
          {onRetry && (
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              variant="outlined"
            >
              重试
            </Button>
          )}
        </Box>
      }
      sx={{ mb: 2 }}
    >
      <AlertTitle>
        {errorIcon} {error.message}
      </AlertTitle>
      
      {showDetails && error.details && (
        <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
          {error.details}
        </Typography>
      )}
      
      {error.timestamp && (
        <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
          时间: {new Date(error.timestamp).toLocaleString()}
        </Typography>
      )}
    </Alert>
  );
};

/**
 * 错误边界组件
 * 用于捕获 React 组件树中的 JavaScript 错误
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} />;
      }

      return (
        <ErrorDisplay
          error={{
            code: 1000, // UNKNOWN_ERROR
            message: this.state.error?.message || '组件渲染错误',
            details: this.state.error?.stack,
            timestamp: new Date().toISOString()
          }}
          showDetails={true}
        />
      );
    }

    return this.props.children;
  }
} 