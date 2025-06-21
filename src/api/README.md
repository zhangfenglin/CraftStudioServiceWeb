# 错误处理系统

这个项目实现了一个完整的 TypeScript 错误处理系统，包括错误代码定义、错误处理工具、React Hooks 和 UI 组件。

## 文件结构

```
src/
├── api/
│   ├── errorCodes.ts          # 错误代码定义和工具类
│   ├── types.ts               # API 类型定义
│   ├── request.ts             # Axios 请求配置和错误拦截
│   └── README.md              # 本文档
├── hooks/
│   └── useErrorHandler.ts     # 错误处理 React Hooks
├── components/
│   └── ErrorDisplay.tsx       # 错误显示组件
└── examples/
    └── ErrorHandlingExample.tsx  # 使用示例
```

## 核心功能

### 1. 错误代码定义 (`errorCodes.ts`)

#### 错误代码枚举
```typescript
export enum ErrorCode {
  // 成功
  SUCCESS = 1,
  
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR = 1000,
  INVALID_PARAMETER = 1001,
  // ...
  
  // 认证授权错误 (2000-2999)
  UNAUTHORIZED = 2000,
  TOKEN_EXPIRED = 2001,
  // ...
  
  // 业务逻辑错误 (3000-3999)
  PROJECT_NOT_FOUND = 3000,
  PROJECT_ALREADY_EXISTS = 3001,
  // ...
  
  // 系统错误 (5000-5999)
  INTERNAL_SERVER_ERROR = 5000,
  DATABASE_ERROR = 5001,
  // ...
}
```

#### 错误处理工具类
```typescript
export class ErrorHandler {
  // 根据错误代码获取错误消息
  static getErrorMessage(code: ErrorCode): string
  
  // 创建 API 错误对象
  static createApiError(code: ErrorCode, details?: string): ApiError
  
  // 根据 HTTP 状态码获取对应的错误代码
  static getErrorCodeFromHttpStatus(status: number): ErrorCode
  
  // 检查错误类型
  static isBusinessError(code: ErrorCode): boolean
  static isSystemError(code: ErrorCode): boolean
  static isAuthError(code: ErrorCode): boolean
  
  // 格式化错误信息用于显示
  static formatErrorForDisplay(error: ApiError): string
}
```

### 2. React Hooks (`useErrorHandler.ts`)

#### 基础错误处理 Hook
```typescript
const { errorState, handleError, clearError, showError } = useErrorHandler();

// 处理错误
handleError(error);

// 清除错误
clearError();

// 显示自定义错误消息
showError('自定义错误消息', ErrorCode.VALIDATION_FAILED);
```

#### 异步操作错误处理 Hook
```typescript
const { errorState, executeAsync, clearError } = useAsyncErrorHandler();

// 执行异步操作
const result = await executeAsync(
  async () => {
    // 异步操作
    return await someAsyncOperation();
  },
  (result) => {
    // 成功回调
    console.log('操作成功:', result);
  },
  (error) => {
    // 错误回调
    console.log('操作失败:', error);
  }
);
```

### 3. 错误显示组件 (`ErrorDisplay.tsx`)

```typescript
import { ErrorDisplay } from '../components/ErrorDisplay';

<ErrorDisplay 
  error={errorState.error}
  onClose={clearError}
  onRetry={retryOperation}
  showDetails={true}
  variant="alert"  // 或 "card"
  severity="error"  // 或 "warning", "info"
/>
```

### 4. API 请求集成 (`request.ts`)

自动处理各种类型的错误：
- 业务错误（非 1 状态码）
- HTTP 错误（4xx, 5xx）
- 网络错误
- 超时错误
- 认证错误（自动跳转登录）

## 使用示例

### 在组件中使用

```typescript
import React from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ErrorCode } from '../api/errorCodes';

const MyComponent = () => {
  const { errorState, handleError, clearError } = useErrorHandler();

  const handleSubmit = async (data: any) => {
    try {
      const response = await apiCall(data);
      if (response.data.code === ErrorCode.SUCCESS) {
        // 处理成功
      } else {
        // 处理业务错误
        handleError({
          code: response.data.code,
          message: response.data.msg,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      // 处理其他错误
      handleError(error);
    }
  };

  return (
    <div>
      {/* 你的组件内容 */}
      
      {/* 错误显示 */}
      <ErrorDisplay 
        error={errorState.error}
        onClose={clearError}
        onRetry={handleSubmit}
      />
    </div>
  );
};
```

### 异步操作处理

```typescript
import { useAsyncErrorHandler } from '../hooks/useErrorHandler';

const MyAsyncComponent = () => {
  const { errorState, executeAsync, clearError } = useAsyncErrorHandler();

  const handleAsyncOperation = async () => {
    await executeAsync(
      async () => {
        // 执行异步操作
        const result = await fetchData();
        return result;
      },
      (result) => {
        // 成功处理
        console.log('操作成功:', result);
      },
      (error) => {
        // 错误处理
        console.log('操作失败:', error);
      }
    );
  };

  return (
    <div>
      <button onClick={handleAsyncOperation}>执行操作</button>
      <ErrorDisplay error={errorState.error} onClose={clearError} />
    </div>
  );
};
```

## 错误类型分类

### 1. 业务错误 (1000-4999)
- 用户输入验证失败
- 业务逻辑错误
- 资源不存在或已存在
- 权限不足

### 2. 认证错误 (2000-2999)
- 未授权访问
- Token 过期或无效
- 账户被锁定或禁用

### 3. 系统错误 (5000+)
- 服务器内部错误
- 数据库错误
- 外部服务调用失败
- 网络连接问题

## 最佳实践

1. **统一错误处理**: 使用 `useErrorHandler` Hook 统一处理组件中的错误
2. **异步操作**: 使用 `useAsyncErrorHandler` Hook 处理异步操作的错误
3. **错误显示**: 使用 `ErrorDisplay` 组件在 UI 中展示错误信息
4. **错误分类**: 根据错误类型使用不同的处理策略
5. **用户友好**: 提供清晰的错误消息和重试选项

## 扩展

### 添加新的错误代码

1. 在 `ErrorCode` 枚举中添加新的错误代码
2. 在 `ErrorMessages` 中添加对应的错误消息
3. 根据需要添加特定的错误处理逻辑

### 自定义错误处理

1. 继承 `ErrorHandler` 类
2. 重写相关方法
3. 在组件中使用自定义的错误处理逻辑

## 注意事项

1. 错误代码应该保持向后兼容
2. 错误消息应该对用户友好
3. 敏感信息不应该在错误消息中暴露
4. 网络错误应该提供重试机制
5. 认证错误应该自动处理登录跳转 