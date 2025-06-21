// 错误代码定义
export const ErrorCode = {
  // 成功
  SUCCESS: 1,
  
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR: 1000,
  INVALID_PARAMETER: 1001,
  MISSING_PARAMETER: 1002,
  INVALID_FORMAT: 1003,
  DATA_NOT_FOUND: 1004,
  OPERATION_FAILED: 1005,
  PERMISSION_DENIED: 1006,
  RESOURCE_EXISTS: 1007,
  RESOURCE_NOT_FOUND: 1008,
  VALIDATION_FAILED: 1009,
  
  // 认证授权错误 (2000-2999)
  UNAUTHORIZED: 2000,
  TOKEN_EXPIRED: 2001,
  TOKEN_INVALID: 2002,
  TOKEN_MISSING: 2003,
  INVALID_CREDENTIALS: 2004,
  ACCOUNT_LOCKED: 2005,
  ACCOUNT_DISABLED: 2006,
  INSUFFICIENT_PERMISSIONS: 2007,
  
  // 业务逻辑错误 (3000-3999)
  PROJECT_NOT_FOUND: 3000,
  PROJECT_ALREADY_EXISTS: 3001,
  PROJECT_NAME_INVALID: 3002,
  PROJECT_DESCRIPTION_TOO_LONG: 3003,
  PROJECT_STATUS_INVALID: 3004,
  PROJECT_OPERATION_FAILED: 3005,
  
  // 系统错误 (5000-5999)
  INTERNAL_SERVER_ERROR: 5000,
  DATABASE_ERROR: 5001,
  EXTERNAL_SERVICE_ERROR: 5002,
  NETWORK_ERROR: 5003,
  TIMEOUT_ERROR: 5004,
  RATE_LIMIT_EXCEEDED: 5005,
  
  // HTTP 状态码映射
  HTTP_BAD_REQUEST: 400,
  HTTP_UNAUTHORIZED: 401,
  HTTP_FORBIDDEN: 403,
  HTTP_NOT_FOUND: 404,
  HTTP_METHOD_NOT_ALLOWED: 405,
  HTTP_CONFLICT: 409,
  HTTP_UNPROCESSABLE_ENTITY: 422,
  HTTP_TOO_MANY_REQUESTS: 429,
  HTTP_INTERNAL_SERVER_ERROR: 500,
  HTTP_BAD_GATEWAY: 502,
  HTTP_SERVICE_UNAVAILABLE: 503,
  HTTP_GATEWAY_TIMEOUT: 504
} as const;

// 错误代码类型
export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

// 错误消息映射
export const ErrorMessages: Record<ErrorCodeType, string> = {
  [ErrorCode.SUCCESS]: '操作成功',
  
  // 通用错误消息
  [ErrorCode.UNKNOWN_ERROR]: '未知错误',
  [ErrorCode.INVALID_PARAMETER]: '参数无效',
  [ErrorCode.MISSING_PARAMETER]: '缺少必要参数',
  [ErrorCode.INVALID_FORMAT]: '数据格式错误',
  [ErrorCode.DATA_NOT_FOUND]: '数据不存在',
  [ErrorCode.OPERATION_FAILED]: '操作失败',
  [ErrorCode.PERMISSION_DENIED]: '权限不足',
  [ErrorCode.RESOURCE_EXISTS]: '资源已存在',
  [ErrorCode.RESOURCE_NOT_FOUND]: '资源不存在',
  [ErrorCode.VALIDATION_FAILED]: '数据验证失败',
  
  // 认证授权错误消息
  [ErrorCode.UNAUTHORIZED]: '未授权访问',
  [ErrorCode.TOKEN_EXPIRED]: '访问令牌已过期',
  [ErrorCode.TOKEN_INVALID]: '访问令牌无效',
  [ErrorCode.TOKEN_MISSING]: '缺少访问令牌',
  [ErrorCode.INVALID_CREDENTIALS]: '用户名或密码错误',
  [ErrorCode.ACCOUNT_LOCKED]: '账户已被锁定',
  [ErrorCode.ACCOUNT_DISABLED]: '账户已被禁用',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: '权限不足',
  
  // 业务逻辑错误消息
  [ErrorCode.PROJECT_NOT_FOUND]: '项目不存在',
  [ErrorCode.PROJECT_ALREADY_EXISTS]: '项目名称已存在',
  [ErrorCode.PROJECT_NAME_INVALID]: '项目名称无效',
  [ErrorCode.PROJECT_DESCRIPTION_TOO_LONG]: '项目描述过长',
  [ErrorCode.PROJECT_STATUS_INVALID]: '项目状态无效',
  [ErrorCode.PROJECT_OPERATION_FAILED]: '项目操作失败',
  
  // 系统错误消息
  [ErrorCode.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ErrorCode.DATABASE_ERROR]: '数据库操作错误',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: '外部服务调用失败',
  [ErrorCode.NETWORK_ERROR]: '网络连接错误',
  [ErrorCode.TIMEOUT_ERROR]: '请求超时',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: '请求频率超限',
  
  // HTTP 状态码消息
  [ErrorCode.HTTP_BAD_REQUEST]: '请求参数错误',
  [ErrorCode.HTTP_UNAUTHORIZED]: '未授权访问',
  [ErrorCode.HTTP_FORBIDDEN]: '禁止访问',
  [ErrorCode.HTTP_NOT_FOUND]: '资源不存在',
  [ErrorCode.HTTP_METHOD_NOT_ALLOWED]: '请求方法不允许',
  [ErrorCode.HTTP_CONFLICT]: '资源冲突',
  [ErrorCode.HTTP_UNPROCESSABLE_ENTITY]: '请求数据无法处理',
  [ErrorCode.HTTP_TOO_MANY_REQUESTS]: '请求过于频繁',
  [ErrorCode.HTTP_INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ErrorCode.HTTP_BAD_GATEWAY]: '网关错误',
  [ErrorCode.HTTP_SERVICE_UNAVAILABLE]: '服务不可用',
  [ErrorCode.HTTP_GATEWAY_TIMEOUT]: '网关超时'
};

// 错误类型定义
export interface ApiError {
  code: ErrorCodeType;
  message: string;
  details?: string;
  timestamp?: string;
  path?: string;
}

// 错误处理工具类
export class ErrorHandler {
  /**
   * 根据错误代码获取错误消息
   */
  static getErrorMessage(code: ErrorCodeType): string {
    return ErrorMessages[code] || ErrorMessages[ErrorCode.UNKNOWN_ERROR];
  }

  /**
   * 创建 API 错误对象
   */
  static createApiError(code: ErrorCodeType, details?: string): ApiError {
    return {
      code,
      message: this.getErrorMessage(code),
      details,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 根据 HTTP 状态码获取对应的错误代码
   */
  static getErrorCodeFromHttpStatus(status: number): ErrorCodeType {
    switch (status) {
      case 400:
        return ErrorCode.HTTP_BAD_REQUEST;
      case 401:
        return ErrorCode.HTTP_UNAUTHORIZED;
      case 403:
        return ErrorCode.HTTP_FORBIDDEN;
      case 404:
        return ErrorCode.HTTP_NOT_FOUND;
      case 405:
        return ErrorCode.HTTP_METHOD_NOT_ALLOWED;
      case 409:
        return ErrorCode.HTTP_CONFLICT;
      case 422:
        return ErrorCode.HTTP_UNPROCESSABLE_ENTITY;
      case 429:
        return ErrorCode.HTTP_TOO_MANY_REQUESTS;
      case 500:
        return ErrorCode.HTTP_INTERNAL_SERVER_ERROR;
      case 502:
        return ErrorCode.HTTP_BAD_GATEWAY;
      case 503:
        return ErrorCode.HTTP_SERVICE_UNAVAILABLE;
      case 504:
        return ErrorCode.HTTP_GATEWAY_TIMEOUT;
      default:
        return ErrorCode.UNKNOWN_ERROR;
    }
  }

  /**
   * 检查是否为业务错误
   */
  static isBusinessError(code: ErrorCodeType): boolean {
    return code >= 1000 && code < 5000;
  }

  /**
   * 检查是否为系统错误
   */
  static isSystemError(code: ErrorCodeType): boolean {
    return code >= 5000;
  }

  /**
   * 检查是否为认证错误
   */
  static isAuthError(code: ErrorCodeType): boolean {
    return code >= 2000 && code < 3000;
  }

  /**
   * 格式化错误信息用于显示
   */
  static formatErrorForDisplay(error: ApiError): string {
    if (error.details) {
      return `${error.message}: ${error.details}`;
    }
    return error.message;
  }
}

// 错误代码常量（用于向后兼容）
export const ERROR_CODES = {
  SUCCESS: ErrorCode.SUCCESS,
  UNKNOWN_ERROR: ErrorCode.UNKNOWN_ERROR,
  INVALID_PARAMETER: ErrorCode.INVALID_PARAMETER,
  UNAUTHORIZED: ErrorCode.UNAUTHORIZED,
  PROJECT_NOT_FOUND: ErrorCode.PROJECT_NOT_FOUND,
  INTERNAL_SERVER_ERROR: ErrorCode.INTERNAL_SERVER_ERROR
} as const; 