import '../core/cache/cache_service.dart';
import '../data/mock_data.dart';
import '../models/order.dart';
import '../services/api_service.dart';

abstract class IOrderRepository {
  Future<Map<String, dynamic>> createOrder(Map<String, dynamic> payload);
  Future<Order> getOrderById(String id);
  Future<List<Order>> getMyOrders({bool forceRefresh = false});
  Future<String> createReservation(Map<String, dynamic> payload);
}

class OrderRepository implements IOrderRepository {
  final CacheService _cache;

  OrderRepository({CacheService? cache}) : _cache = cache ?? CacheService();

  static const String _ordersCacheKey = 'my_orders_history';

  @override
  Future<Map<String, dynamic>> createOrder(Map<String, dynamic> payload) async {
    final res = await ApiService.createOrder(payload);
    // Invalidate cached order history so next fetch gets fresh order list
    await _cache.remove(_ordersCacheKey);
    return res;
  }

  @override
  Future<Order> getOrderById(String id) async {
    return ApiService.getOrderById(id);
  }

  @override
  Future<List<Order>> getMyOrders({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      final cached = await _cache.get(_ordersCacheKey);
      if (cached is List && cached.isNotEmpty) {
        try {
          return cached
              .map((o) => Order.fromJson(Map<String, dynamic>.from(o as Map)))
              .toList();
        } catch (_) {}
      }
    }

    try {
      final orders = await ApiService.getMyOrders();
      if (orders.isNotEmpty) {
        final raw = orders.map((o) => o.toJson()).toList();
        await _cache.set(_ordersCacheKey, raw, ttl: const Duration(minutes: 5));
        return orders;
      }
    } catch (_) {
      final stale = await _cache.getStale(_ordersCacheKey);
      if (stale is List && stale.isNotEmpty) {
        try {
          return stale
              .map((o) => Order.fromJson(Map<String, dynamic>.from(o as Map)))
              .toList();
        } catch (_) {}
      }
    }

    return MockData.pastOrders;
  }

  @override
  Future<String> createReservation(Map<String, dynamic> payload) async {
    return ApiService.createReservation(payload);
  }
}
