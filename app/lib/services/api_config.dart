import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiConfig {
  static const String _keyCustomBaseUrl = 'nv404_custom_api_base';

  // LAN IP detected on local network for physical devices
  static const String lanHost = '192.168.1.129';
  static const int port = 4000;

  static String get defaultBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:$port/api';
    }
    try {
      if (Platform.isAndroid) {
        // 10.0.2.2 is Android emulator's alias to host loopback
        return 'http://10.0.2.2:$port/api';
      }
      if (Platform.isIOS || Platform.isMacOS) {
        return 'http://localhost:$port/api';
      }
    } catch (_) {
      // Fallback
    }
    return 'http://$lanHost:$port/api';
  }

  static String _currentBaseUrl = '';

  static Future<void> init() async {
    _currentBaseUrl = defaultBaseUrl;
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_keyCustomBaseUrl);
      if (saved != null && saved.trim().isNotEmpty) {
        _currentBaseUrl = saved.trim();
      }
    } catch (_) {
      // In-memory fallback if platform channel is not linked yet
    }
  }

  static String get baseUrl {
    if (_currentBaseUrl.isEmpty) {
      return defaultBaseUrl;
    }
    return _currentBaseUrl;
  }

  static String get serverOrigin {
    final uri = Uri.tryParse(baseUrl);
    if (uri != null) {
      return '${uri.scheme}://${uri.host}:${uri.port}';
    }
    return 'http://localhost:$port';
  }

  static Future<void> setBaseUrl(String newUrl) async {
    _currentBaseUrl = newUrl.trim();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyCustomBaseUrl, _currentBaseUrl);
    } catch (_) {}
  }

  static Future<void> resetBaseUrl() async {
    _currentBaseUrl = defaultBaseUrl;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_keyCustomBaseUrl);
    } catch (_) {}
  }

  /// Formats image URLs: if image is a relative path like "/uploads/abc.jpg",
  /// prepends the server origin.
  static String formatImageUrl(String url) {
    if (url.isEmpty) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    final origin = serverOrigin;
    if (url.startsWith('/')) {
      return '$origin$url';
    }
    return '$origin/$url';
  }
}
