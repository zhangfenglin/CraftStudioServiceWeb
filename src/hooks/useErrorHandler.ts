import { useState, useCallback } from 'react';
import type { ApiError, ErrorCodeType } from '../api/errorCodes';
import { ErrorHandler } from '../api/errorCodes';

// 错误状态接口
export interface ErrorState {
  hasError: boolean;
  error: ApiError | null;
  message: string;
}

// 错误处理 Hook 的返回值
export interface UseErrorHandlerReturn {
  errorState: ErrorState;
  handleError: (error: unknown) => void;
  clearError: () => void;
  showError: (message: string, code?: number) => void;
  isBusinessError: (error: ApiError) => boolean;
  isSystemError: (error: ApiError) => boolean;
  isAuthError: (error: ApiError) => boolean;
}

/**
 * 错误处理 Hook
 * 提供统一的错误处理逻辑
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    message: ''
  });

  // 处理错误
  const handleError = useCallback((error: unknown) => {
    console.error('Error occurred:', error);

    let apiError: ApiError;

    // 如果已经是 ApiError 类型
    if (error && typeof error === 'object' && 'code' in error) {
      apiError = error as ApiError;
    } else {
      // 转换为 ApiError
      apiError = {
        code: 1000, // UNKNOWN_ERROR
        message: error instanceof Error ? error.message : '未知错误',
        details: error instanceof Error ? error.stack : String(error),
        timestamp: new Date().toISOString()
      };
    }

    const message = ErrorHandler.formatErrorForDisplay(apiError);

    setErrorState({
      hasError: true,
      error: apiError,
      message
    });

    // 特殊处理认证错误
    if (ErrorHandler.isAuthError(apiError.code)) {
      // 认证错误已经在 request.ts 中处理了跳转
      // 这里可以添加额外的处理逻辑
    }
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      message: ''
    });
  }, []);

  // 显示自定义错误消息
  const showError = useCallback((message: string, code: number = 1000) => {
    const apiError: ApiError = {
      code: code as ErrorCodeType,
      message,
      timestamp: new Date().toISOString()
    };

    setErrorState({
      hasError: true,
      error: apiError,
      message
    });
  }, []);

  // 检查是否为业务错误
  const isBusinessError = useCallback((error: ApiError): boolean => {
    return ErrorHandler.isBusinessError(error.code);
  }, []);

  // 检查是否为系统错误
  const isSystemError = useCallback((error: ApiError): boolean => {
    return ErrorHandler.isSystemError(error.code);
  }, []);

  // 检查是否为认证错误
  const isAuthError = useCallback((error: ApiError): boolean => {
    return ErrorHandler.isAuthError(error.code);
  }, []);

  return {
    errorState,
    handleError,
    clearError,
    showError,
    isBusinessError,
    isSystemError,
    isAuthError
  };
};

/**
 * 异步操作错误处理 Hook
 * 专门用于处理异步操作的错误
 */
export const useAsyncErrorHandler = () => {
  const { errorState, handleError, clearError } = useErrorHandler();

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: unknown) => void
  ): Promise<T | null> => {
    try {
      clearError();
      const result = await asyncFn();
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (error) {
      handleError(error);
      if (onError) {
        onError(error);
      }
      return null;
    }
  }, [handleError, clearError]);

  return {
    errorState,
    executeAsync,
    clearError
  };
}; 