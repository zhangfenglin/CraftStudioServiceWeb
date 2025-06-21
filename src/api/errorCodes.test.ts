import { ErrorCode, ErrorHandler, ErrorMessages } from './errorCodes';
import type { ErrorCodeType } from './errorCodes';

// 简单的测试函数
export function testErrorCodes() {
  console.log('=== 错误代码系统测试 ===');
  
  // 测试错误代码枚举
  console.log('1. 错误代码枚举测试:');
  console.log('SUCCESS:', ErrorCode.SUCCESS);
  console.log('PROJECT_NOT_FOUND:', ErrorCode.PROJECT_NOT_FOUND);
  console.log('TOKEN_EXPIRED:', ErrorCode.TOKEN_EXPIRED);
  console.log('DATABASE_ERROR:', ErrorCode.DATABASE_ERROR);
  
  // 测试错误消息
  console.log('\n2. 错误消息测试:');
  console.log('SUCCESS 消息:', ErrorMessages[ErrorCode.SUCCESS]);
  console.log('PROJECT_NOT_FOUND 消息:', ErrorMessages[ErrorCode.PROJECT_NOT_FOUND]);
  console.log('TOKEN_EXPIRED 消息:', ErrorMessages[ErrorCode.TOKEN_EXPIRED]);
  
  // 测试错误处理工具
  console.log('\n3. 错误处理工具测试:');
  console.log('获取错误消息:', ErrorHandler.getErrorMessage(ErrorCode.PROJECT_NOT_FOUND));
  console.log('创建 API 错误:', ErrorHandler.createApiError(ErrorCode.VALIDATION_FAILED, '测试详情'));
  
  // 测试错误类型检查
  console.log('\n4. 错误类型检查测试:');
  console.log('PROJECT_NOT_FOUND 是业务错误:', ErrorHandler.isBusinessError(ErrorCode.PROJECT_NOT_FOUND));
  console.log('TOKEN_EXPIRED 是认证错误:', ErrorHandler.isAuthError(ErrorCode.TOKEN_EXPIRED));
  console.log('DATABASE_ERROR 是系统错误:', ErrorHandler.isSystemError(ErrorCode.DATABASE_ERROR));
  
  // 测试 HTTP 状态码映射
  console.log('\n5. HTTP 状态码映射测试:');
  console.log('400 ->', ErrorHandler.getErrorCodeFromHttpStatus(400));
  console.log('401 ->', ErrorHandler.getErrorCodeFromHttpStatus(401));
  console.log('404 ->', ErrorHandler.getErrorCodeFromHttpStatus(404));
  console.log('500 ->', ErrorHandler.getErrorCodeFromHttpStatus(500));
  
  // 测试错误格式化
  console.log('\n6. 错误格式化测试:');
  const testError = {
    code: ErrorCode.PROJECT_NOT_FOUND,
    message: '项目不存在',
    details: '项目ID: 123',
    timestamp: new Date().toISOString()
  };
  console.log('格式化错误:', ErrorHandler.formatErrorForDisplay(testError));
  
  console.log('\n=== 测试完成 ===');
}

// 测试错误代码范围
export function validateErrorCodeRanges() {
  console.log('=== 错误代码范围验证 ===');
  
  const businessErrors = Object.values(ErrorCode).filter(code => 
    typeof code === 'number' && code >= 1000 && code < 5000
  );
  
  const authErrors = Object.values(ErrorCode).filter(code => 
    typeof code === 'number' && code >= 2000 && code < 3000
  );
  
  const systemErrors = Object.values(ErrorCode).filter(code => 
    typeof code === 'number' && code >= 5000
  );
  
  console.log('业务错误数量:', businessErrors.length);
  console.log('认证错误数量:', authErrors.length);
  console.log('系统错误数量:', systemErrors.length);
  
  // 验证所有错误代码都有对应的消息
  const missingMessages = Object.values(ErrorCode).filter(code => 
    typeof code === 'number' && !ErrorMessages[code as ErrorCodeType]
  );
  
  if (missingMessages.length > 0) {
    console.warn('缺少错误消息的代码:', missingMessages);
  } else {
    console.log('所有错误代码都有对应的消息');
  }
}

// 导出测试函数
export const ErrorCodeTests = {
  testErrorCodes,
  validateErrorCodeRanges
}; 