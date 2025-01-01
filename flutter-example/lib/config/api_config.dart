class ApiConfig {
  static const bool isDev = true; // 在发布时改为 false

  // API 地址配置
  static const String devApiUrl = 'http://192.168.1.100:5000/api'; // 开发环境（本地开发时使用本机IP）
  static const String prodApiUrl = 'http://your-server-ip:5000/api'; // 生产环境（服务器实际IP）

  // 获取当前环境的 API 地址
  static String get baseUrl => isDev ? devApiUrl : prodApiUrl;

  // Token 存储键名
  static const String tokenKey = 'couple_app_token';

  // API 超时设置（秒）
  static const int timeout = 10;
}
