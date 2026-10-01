import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_config.dart';
import '../models/food_item.dart';
import '../models/order.dart';
import '../models/coupon.dart';
import '../models/review.dart';
import '../models/user_profile.dart';

class ApiService {
  static const String _tokenKey = 'nv404_token';
  static const String _userKey = 'nv404_customer_user';

  static String? _cachedToken;
  static UserProfile? _memoryUser;

  static Future<String?> getToken() async {
    if (_cachedToken != null) return _cachedToken;
    try {
      final prefs = await SharedPreferences.getInstance();
      _cachedToken = prefs.getString(_tokenKey);
    } catch (_) {}
    return _cachedToken;
  }

  static Future<void> saveToken(String token) async {
    _cachedToken = token;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, token);
    } catch (_) {}
  }

  static Future<void> clearAuth() async {
    _cachedToken = null;
    _memoryUser = null;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_userKey);
    } catch (_) {}
  }

  static Future<void> saveCachedUser(UserProfile user) async {
    _memoryUser = user;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_userKey, jsonEncode(user.toJson()));
    } catch (_) {}
  }

  static Future<UserProfile?> getCachedUser() async {
    if (_memoryUser != null) return _memoryUser;
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_userKey);
      if (raw != null) {
        final Map<String, dynamic> json = jsonDecode(raw);
        _memoryUser = UserProfile.fromJson(json);
        return _memoryUser;
      }
    } catch (_) {}
    return null;
  }

  static Future<Map<String, dynamic>> _request(
    String endpoint, {
    String method = 'GET',
    Map<String, dynamic>? body,
  }) async {
    final baseUrl = ApiConfig.baseUrl;
    final url = Uri.parse('$baseUrl$endpoint');
    final token = await getToken();

    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };

    http.Response response;
    try {
      if (method == 'POST') {
        response = await http
            .post(url, headers: headers, body: jsonEncode(body ?? {}))
            .timeout(const Duration(seconds: 10));
      } else if (method == 'PUT') {
        response = await http
            .put(url, headers: headers, body: jsonEncode(body ?? {}))
            .timeout(const Duration(seconds: 10));
      } else if (method == 'DELETE') {
        response = await http
            .delete(url, headers: headers)
            .timeout(const Duration(seconds: 10));
      } else {
        response = await http
            .get(url, headers: headers)
            .timeout(const Duration(seconds: 10));
      }
    } catch (e) {
      throw Exception('Network connection error to $url: $e');
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } catch (_) {
      throw Exception(
        'Server returned non-JSON response (${response.statusCode})',
      );
    }

    if (response.statusCode >= 400 ||
        (decoded is Map && decoded['success'] == false)) {
      final msg =
          (decoded is Map ? decoded['message'] ?? decoded['error'] : null) ??
          'HTTP error ${response.statusCode}';
      throw Exception(msg);
    }

    return decoded is Map<String, dynamic> ? decoded : {'data': decoded};
  }

  // ==========================================
  // 1. HEALTH & SETTINGS
  // ==========================================
  static Future<bool> checkHealth() async {
    try {
      final res = await _request('/health');
      return res['status'] == 'ONLINE';
    } catch (_) {
      return false;
    }
  }

  static Future<Map<String, dynamic>> getSettings() async {
    return _request('/settings');
  }

  // ==========================================
  // 2. AUTHENTICATION
  // ==========================================
  static Future<UserProfile> login(String email, String password) async {
    final res = await _request(
      '/auth/login',
      method: 'POST',
      body: {'email': email, 'password': password},
    );

    final token = res['token']?.toString();
    if (token != null) {
      await saveToken(token);
    }

    final custData = res['customer'] ?? res['data'] ?? {};
    final user = UserProfile.fromJson(Map<String, dynamic>.from(custData));
    await saveCachedUser(user);
    return user;
  }

  static Future<UserProfile> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final res = await _request(
      '/auth/register',
      method: 'POST',
      body: {
        'name': name,
        'email': email,
        'phone': phone,
        'password': password,
      },
    );

    final token = res['token']?.toString();
    if (token != null) {
      await saveToken(token);
    }

    final custData = res['customer'] ?? res['data'] ?? {};
    final user = UserProfile.fromJson(Map<String, dynamic>.from(custData));
    await saveCachedUser(user);
    return user;
  }

  static Future<UserProfile?> getMe() async {
    final token = await getToken();
    if (token == null) return null;

    try {
      final res = await _request('/auth/me');
      final custData = res['customer'] ?? res['data'] ?? {};
      final user = UserProfile.fromJson(Map<String, dynamic>.from(custData));
      await saveCachedUser(user);
      return user;
    } catch (_) {
      return null;
    }
  }

  // ==========================================
  // 3. MENU ITEMS & CATEGORIES
  // ==========================================
  static Future<List<FoodItem>> getMenu({
    String? category,
    String? search,
    String? spice,
    bool? featured,
  }) async {
    final params = <String>[];
    if (category != null && category != 'All') {
      params.add('category=${Uri.encodeComponent(category)}');
    }
    if (search != null && search.isNotEmpty) {
      params.add('search=${Uri.encodeComponent(search)}');
    }
    if (spice != null && spice != 'All') {
      params.add('spice=${Uri.encodeComponent(spice)}');
    }
    if (featured == true) {
      params.add('featured=true');
    }

    final query = params.isNotEmpty ? '?${params.join('&')}' : '';
    final res = await _request('/menu$query');

    final dataList = res['data'] as List? ?? [];
    return dataList.map((item) {
      final map = Map<String, dynamic>.from(item as Map);
      // Format image URL
      if (map['image'] != null) {
        map['image'] = ApiConfig.formatImageUrl(map['image'].toString());
      }
      return FoodItem.fromJson(map);
    }).toList();
  }

  static Future<List<String>> getCategories() async {
    try {
      final res = await _request('/menu/categories/all');
      final dataList = res['data'] as List? ?? [];
      final names = dataList
          .map((c) => (c as Map)['name']?.toString() ?? '')
          .where((n) => n.isNotEmpty)
          .toList();
      if (!names.contains('All')) {
        names.insert(0, 'All');
      }
      return names;
    } catch (_) {
      return [
        'All',
        'Biryani',
        'Chicken',
        'Mutton',
        'Kebabs & Tandoor',
        'Burgers',
        'Starters',
        'Main Course',
        'Desserts',
        'Beverages',
      ];
    }
  }

  // ==========================================
  // 4. ORDERS (Live synced with Admin Panel)
  // ==========================================
  static Future<Map<String, dynamic>> createOrder(
    Map<String, dynamic> payload,
  ) async {
    return _request('/orders', method: 'POST', body: payload);
  }

  static Future<Order> getOrderById(String orderId) async {
    final res = await _request('/orders/$orderId');
    final orderData = res['data'] ?? res['order'] ?? {};
    return Order.fromJson(Map<String, dynamic>.from(orderData as Map));
  }

  static Future<List<Order>> getMyOrders() async {
    try {
      final res = await _request('/orders/customer/my-orders');
      final list = res['orders'] ?? res['data'] ?? [];
      if (list is List) {
        return list.map((item) {
          return Order.fromJson(Map<String, dynamic>.from(item as Map));
        }).toList();
      }
    } catch (_) {}
    return [];
  }

  // ==========================================
  // 5. TABLE RESERVATIONS (Synced with Admin)
  // ==========================================
  static Future<String> createReservation(Map<String, dynamic> payload) async {
    final res = await _request('/reservations', method: 'POST', body: payload);
    return res['reservationId']?.toString() ??
        res['id']?.toString() ??
        'RES-CONFIRMED';
  }

  // ==========================================
  // 6. COUPONS
  // ==========================================
  static Future<List<Coupon>> getCoupons() async {
    try {
      final res = await _request('/coupons');
      final list = res['data'] as List? ?? [];
      return list
          .map((c) => Coupon.fromJson(Map<String, dynamic>.from(c as Map)))
          .toList();
    } catch (_) {
      return [];
    }
  }

  static Future<Map<String, dynamic>> validateCoupon(
    String code,
    double orderTotal,
  ) async {
    return _request(
      '/coupons/validate',
      method: 'POST',
      body: {'code': code.toUpperCase(), 'orderTotal': orderTotal},
    );
  }

  // ==========================================
  // 7. REVIEWS
  // ==========================================
  static Future<List<Review>> getReviews() async {
    try {
      final res = await _request('/reviews');
      final list = res['data'] ?? res['reviews'] ?? [];
      if (list is List) {
        return list.map((r) {
          final map = Map<String, dynamic>.from(r as Map);
          return Review(
            id: map['id']?.toString() ?? '',
            author:
                map['author']?.toString() ??
                map['customer_name']?.toString() ??
                'Developer',
            role:
                map['role']?.toString() ??
                map['customer_role']?.toString() ??
                'Staff Engineer',
            rating: (map['rating'] as num?)?.toDouble() ?? 5.0,
            comment: map['comment']?.toString() ?? '',
            date:
                map['date']?.toString() ??
                map['created_at']?.toString() ??
                'Recent',
            commitHash:
                map['commitHash']?.toString() ??
                map['commit_hash']?.toString() ??
                'commit 404',
            dishOrdered:
                map['dishOrdered']?.toString() ??
                map['dish_ordered']?.toString() ??
                'Special Feast',
          );
        }).toList();
      }
    } catch (_) {}
    return [];
  }
}
