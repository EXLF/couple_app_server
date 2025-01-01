import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class ApiService {
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(ApiConfig.tokenKey);
    return {
      'Content-Type': 'application/json',
      'Authorization': token != null ? 'Bearer $token' : '',
    };
  }

  // 登录
  static Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        // 保存 token
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(ApiConfig.tokenKey, data['token']);
      }
      return data;
    } catch (e) {
      print('登录失败: $e');
      rethrow;
    }
  }

  // 获取纪念日列表
  static Future<List<dynamic>> getAnniversaries() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/anniversaries'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('获取纪念日列表失败');
    } catch (e) {
      print('获取纪念日列表失败: $e');
      rethrow;
    }
  }

  // 添加纪念日
  static Future<Map<String, dynamic>> addAnniversary(Map<String, dynamic> anniversary) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/anniversaries'),
        headers: await _getHeaders(),
        body: jsonEncode(anniversary),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      throw Exception('添加纪念日失败');
    } catch (e) {
      print('添加纪念日失败: $e');
      rethrow;
    }
  }

  // ... 其他 API 方法
}
