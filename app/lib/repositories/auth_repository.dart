import '../core/cache/cache_service.dart';
import '../data/mock_data.dart';
import '../models/user_profile.dart';
import '../services/api_service.dart';

abstract class IAuthRepository {
  Future<UserProfile> login(String email, String password);
  Future<UserProfile> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  });
  Future<UserProfile?> getCurrentUser();
  Future<void> logout();
}

class AuthRepository implements IAuthRepository {
  final CacheService _cache;

  AuthRepository({CacheService? cache}) : _cache = cache ?? CacheService();

  static const String _userCacheKey = 'active_user_session';

  @override
  Future<UserProfile> login(String email, String password) async {
    final user = await ApiService.login(email, password);
    await _cache.set(_userCacheKey, user.toJson(), ttl: const Duration(days: 7));
    return user;
  }

  @override
  Future<UserProfile> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final user = await ApiService.register(
      name: name,
      email: email,
      phone: phone,
      password: password,
    );
    await _cache.set(_userCacheKey, user.toJson(), ttl: const Duration(days: 7));
    return user;
  }

  @override
  Future<UserProfile?> getCurrentUser() async {
    // 1. Try cache
    final cached = await _cache.get(_userCacheKey);
    if (cached is Map) {
      try {
        return UserProfile.fromJson(Map<String, dynamic>.from(cached));
      } catch (_) {}
    }

    // 2. Try ApiService session
    try {
      final fresh = await ApiService.getMe();
      if (fresh != null) {
        await _cache.set(_userCacheKey, fresh.toJson(), ttl: const Duration(days: 7));
        return fresh;
      }
    } catch (_) {}

    // 3. Fallback to cached user in ApiService
    final local = await ApiService.getCachedUser();
    if (local != null) return local;

    return MockData.defaultUser;
  }

  @override
  Future<void> logout() async {
    await _cache.remove(_userCacheKey);
    await ApiService.clearAuth();
  }
}
