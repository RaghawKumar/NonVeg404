import '../core/cache/cache_service.dart';
import '../data/mock_data.dart';
import '../models/coupon.dart';
import '../services/api_service.dart';

abstract class ICouponRepository {
  Future<List<Coupon>> getCoupons({bool forceRefresh = false});
  Future<Map<String, dynamic>> validateCoupon(String code, double orderTotal);
}

class CouponRepository implements ICouponRepository {
  final CacheService _cache;

  CouponRepository({CacheService? cache}) : _cache = cache ?? CacheService();

  static const String _couponsCacheKey = 'active_coupons';

  @override
  Future<List<Coupon>> getCoupons({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      final cached = await _cache.get(_couponsCacheKey);
      if (cached is List && cached.isNotEmpty) {
        try {
          return cached
              .map((c) => Coupon.fromJson(Map<String, dynamic>.from(c as Map)))
              .toList();
        } catch (_) {}
      }
    }

    try {
      final coupons = await ApiService.getCoupons();
      if (coupons.isNotEmpty) {
        final raw = coupons.map((c) => c.toJson()).toList();
        await _cache.set(_couponsCacheKey, raw, ttl: const Duration(minutes: 30));
        return coupons;
      }
    } catch (_) {
      final stale = await _cache.getStale(_couponsCacheKey);
      if (stale is List && stale.isNotEmpty) {
        try {
          return stale
              .map((c) => Coupon.fromJson(Map<String, dynamic>.from(c as Map)))
              .toList();
        } catch (_) {}
      }
    }

    return MockData.coupons;
  }

  @override
  Future<Map<String, dynamic>> validateCoupon(String code, double orderTotal) async {
    return ApiService.validateCoupon(code, orderTotal);
  }
}
