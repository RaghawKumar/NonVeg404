import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class CacheEntry {
  final dynamic data;
  final DateTime expiresAt;

  CacheEntry({required this.data, required this.expiresAt});

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  Map<String, dynamic> toJson() => {
    'data': data,
    'expiresAt': expiresAt.toIso8601String(),
  };

  factory CacheEntry.fromJson(Map<String, dynamic> json) => CacheEntry(
    data: json['data'],
    expiresAt: DateTime.parse(json['expiresAt'] as String),
  );
}

/// Robust Clean Architecture Cache Service
/// Dual-tier: Fast In-Memory cache + SharedPreferences local persistent cache
/// with configurable TTL (Time-To-Live).
class CacheService {
  static final CacheService _instance = CacheService._internal();
  factory CacheService() => _instance;
  CacheService._internal();

  final Map<String, CacheEntry> _memoryCache = {};

  /// Save to both Memory and Persistent disk cache
  Future<void> set(
    String key,
    dynamic data, {
    Duration ttl = const Duration(minutes: 15),
  }) async {
    final entry = CacheEntry(data: data, expiresAt: DateTime.now().add(ttl));

    _memoryCache[key] = entry;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('cache_$key', jsonEncode(entry.toJson()));
    } catch (_) {
      // In-memory cache continues to serve even if native disk fails
    }
  }

  /// Retrieve data. Returns null if expired or missing.
  Future<dynamic> get(String key) async {
    // 1. Check memory cache first (fastest)
    if (_memoryCache.containsKey(key)) {
      final entry = _memoryCache[key]!;
      if (!entry.isExpired) {
        return entry.data;
      } else {
        _memoryCache.remove(key);
      }
    }

    // 2. Fallback to SharedPreferences
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('cache_$key');
      if (raw != null) {
        final decoded = jsonDecode(raw);
        if (decoded is Map<String, dynamic>) {
          final entry = CacheEntry.fromJson(decoded);
          if (!entry.isExpired) {
            _memoryCache[key] = entry;
            return entry.data;
          } else {
            await prefs.remove('cache_$key');
          }
        }
      }
    } catch (_) {}

    return null;
  }

  /// Retrieve data even if expired (used for offline fallback)
  Future<dynamic> getStale(String key) async {
    if (_memoryCache.containsKey(key)) {
      return _memoryCache[key]!.data;
    }
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('cache_$key');
      if (raw != null) {
        final decoded = jsonDecode(raw);
        if (decoded is Map<String, dynamic>) {
          return decoded['data'];
        }
      }
    } catch (_) {}
    return null;
  }

  /// Remove single key
  Future<void> remove(String key) async {
    _memoryCache.remove(key);
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('cache_$key');
    } catch (_) {}
  }

  /// Invalidate all cache
  Future<void> clearAll() async {
    _memoryCache.clear();
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs
          .getKeys()
          .where((k) => k.startsWith('cache_'))
          .toList();
      for (final k in keys) {
        await prefs.remove(k);
      }
    } catch (_) {}
  }
}
