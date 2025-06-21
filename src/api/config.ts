// API 配置
export const API_CONFIG = {
  // 开发环境
  development: {
    host: 'http://localhost:8080',
    version: 'v1'
  },
  // 测试环境
  test: {
    host: 'http://test-api.example.com',
    version: 'v1'
  },
  // 生产环境
  production: {
    host: 'https://api.example.com',
    version: 'v1'
  }
};

// 获取当前环境
const env = import.meta.env.MODE || 'development';

// 导出当前环境的配置
export const currentConfig = API_CONFIG[env as keyof typeof API_CONFIG];

// 构建完整的 API 基础 URL
export const getBaseUrl = () => {
  if (currentConfig.host) {
    return `${currentConfig.host}/api/${currentConfig.version}`;
  }
  // 开发环境使用相对路径
  return `/api/${currentConfig.version}`;
}; 