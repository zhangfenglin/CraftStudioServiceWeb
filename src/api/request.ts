import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { getBaseUrl } from './config';
import { ErrorCode, ErrorHandler, type ApiError } from './errorCodes';

// 创建 axios 实例
const request = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    
    // 检查业务状态码
    if (data.code === ErrorCode.SUCCESS || data.code === 1) {
      return response;
    }
    
    // 处理业务错误
    const errorCode = data.code || ErrorCode.UNKNOWN_ERROR;
    const errorMessage = data.msg || ErrorHandler.getErrorMessage(errorCode);
    
    const apiError: ApiError = {
      code: errorCode,
      message: errorMessage,
      details: data.details,
      timestamp: new Date().toISOString(),
      path: response.config.url
    };
    
    return Promise.reject(apiError);
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;
      const errorCode = ErrorHandler.getErrorCodeFromHttpStatus(status);
      
      // 特殊处理认证错误
      if (ErrorHandler.isAuthError(errorCode)) {
        // 清除本地存储的 token
        localStorage.removeItem('token');
        // 跳转到登录页
        window.location.href = '/login';
        return Promise.reject(ErrorHandler.createApiError(errorCode, '请重新登录'));
      }
      
      // 处理其他 HTTP 错误
      const apiError: ApiError = {
        code: errorCode,
        message: data?.msg || ErrorHandler.getErrorMessage(errorCode),
        details: data?.details || `HTTP ${status}`,
        timestamp: new Date().toISOString(),
        path: error.config?.url
      };
      
      return Promise.reject(apiError);
    }
    
    // 处理网络错误
    if (error.request) {
      const apiError: ApiError = {
        code: ErrorCode.NETWORK_ERROR,
        message: ErrorHandler.getErrorMessage(ErrorCode.NETWORK_ERROR),
        details: '无法连接到服务器，请检查网络连接',
        timestamp: new Date().toISOString(),
        path: error.config?.url
      };
      
      return Promise.reject(apiError);
    }
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED') {
      const apiError: ApiError = {
        code: ErrorCode.TIMEOUT_ERROR,
        message: ErrorHandler.getErrorMessage(ErrorCode.TIMEOUT_ERROR),
        details: '请求超时，请稍后重试',
        timestamp: new Date().toISOString(),
        path: error.config?.url
      };
      
      return Promise.reject(apiError);
    }
    
    // 处理其他未知错误
    const apiError: ApiError = {
      code: ErrorCode.UNKNOWN_ERROR,
      message: ErrorHandler.getErrorMessage(ErrorCode.UNKNOWN_ERROR),
      details: error.message || '未知错误',
      timestamp: new Date().toISOString(),
      path: error.config?.url
    };
    
    return Promise.reject(apiError);
  }
);

export default request; 