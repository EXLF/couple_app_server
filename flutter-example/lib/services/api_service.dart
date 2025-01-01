import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:get_storage/get_storage.dart';
import '../config/api_config.dart';
import '../models/anniversary_model.dart';
import '../models/user_model.dart';

class ApiService {
  static final _storage = GetStorage();

  static Future<Map<String, String>> _getHeaders() async {
    final token = _storage.read(ApiConfig.tokenKey);
    return {
      'Content-Type': 'application/json',
      'Authorization': token != null ? 'Bearer $token' : '',
    };
  }

  // 登录
  static Future<User> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      if (response.statusCode != 200) {
        throw HttpException('登录失败', response.statusCode, response.body);
      }

      final data = jsonDecode(response.body);
      await _storage.write(ApiConfig.tokenKey, data['token']);
      
      return User.fromJson(data['user']);
    } catch (e) {
      if (e is HttpException) {
        throw e;
      }
      throw HttpException('登录失败', 500, e.toString());
    }
  }

  // 获取纪念日列表
  static Future<List<Anniversary>> getAnniversaries() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/anniversaries'),
        headers: await _getHeaders(),
      );

      if (response.statusCode != 200) {
        throw HttpException('获取纪念日列表失败', response.statusCode, response.body);
      }

      final List<dynamic> data = jsonDecode(response.body);
      return data.map((item) => Anniversary.fromJson(item)).toList();
    } catch (e) {
      if (e is HttpException) {
        throw e;
      }
      throw HttpException('获取纪念日列表失败', 500, e.toString());
    }
  }

  // 添加纪念日
  static Future<Anniversary> addAnniversary(Anniversary anniversary) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/anniversaries'),
        headers: await _getHeaders(),
        body: jsonEncode(anniversary.toJson()),
      );

      if (response.statusCode != 201) {
        throw HttpException('添加纪念日失败', response.statusCode, response.body);
      }

      return Anniversary.fromJson(jsonDecode(response.body));
    } catch (e) {
      if (e is HttpException) {
        throw e;
      }
      throw HttpException('添加纪念日失败', 500, e.toString());
    }
  }
}

class HttpException implements Exception {
  final String message;
  final int statusCode;
  final String body;

  HttpException(this.message, this.statusCode, this.body);

  @override
  String toString() => '$message [${statusCode}]: $body';
}
