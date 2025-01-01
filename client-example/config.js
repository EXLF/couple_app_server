// API 基础地址配置
export const API_CONFIG = {
  // 开发环境 API 地址
  development: {
    API_URL: 'http://192.168.1.100:5000/api',  // 本地开发时使用本机 IP
  },
  
  // 生产环境 API 地址
  production: {
    API_URL: 'http://your-server-ip:5000/api',  // 服务器部署后的实际 IP 地址
  }
};

// 获取当前环境的配置
export const getApiConfig = () => {
  const isDev = __DEV__;  // React Native 的环境变量
  return isDev ? API_CONFIG.development : API_CONFIG.production;
};

// JWT Token 存储键名
export const TOKEN_KEY = 'couple_app_token';

// API 超时设置（毫秒）
export const API_TIMEOUT = 10000;

// 请求重试次数
export const API_RETRY_COUNT = 3;
