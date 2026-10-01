import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/cache/cache_service.dart';
import '../repositories/menu_repository.dart';
import '../repositories/auth_repository.dart';
import '../repositories/order_repository.dart';
import '../repositories/coupon_repository.dart';

/// Core Cache Service Provider
final cacheServiceProvider = Provider<CacheService>((ref) {
  return CacheService();
});

/// Menu Repository Provider
final menuRepositoryProvider = Provider<IMenuRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return MenuRepository(cache: cache);
});

/// Auth Repository Provider
final authRepositoryProvider = Provider<IAuthRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return AuthRepository(cache: cache);
});

/// Order Repository Provider
final orderRepositoryProvider = Provider<IOrderRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return OrderRepository(cache: cache);
});

/// Coupon Repository Provider
final couponRepositoryProvider = Provider<ICouponRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return CouponRepository(cache: cache);
});
