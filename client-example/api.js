import { getApiConfig, TOKEN_KEY, API_TIMEOUT } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API 基础配置
const { API_URL } = getApiConfig();

// 创建通用请求头
const getHeaders = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// API 请求工具
export const api = {
  // 登录
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        // 保存 token
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
      }
      return data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 获取纪念日列表
  getAnniversaries: async () => {
    try {
      const response = await fetch(`${API_URL}/anniversaries`, {
        headers: await getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('获取纪念日列表失败:', error);
      throw error;
    }
  },

  // 添加纪念日
  addAnniversary: async (anniversary) => {
    try {
      const response = await fetch(`${API_URL}/anniversaries`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(anniversary)
      });
      return await response.json();
    } catch (error) {
      console.error('添加纪念日失败:', error);
      throw error;
    }
  }
  
  // ... 其他 API 方法
};
