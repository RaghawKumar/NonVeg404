import '../core/cache/cache_service.dart';
import '../data/mock_data.dart';
import '../models/food_item.dart';
import '../services/api_service.dart';

abstract class IMenuRepository {
  Future<List<FoodItem>> getMenu({bool forceRefresh = false});
  Future<List<String>> getCategories({bool forceRefresh = false});
}

class MenuRepository implements IMenuRepository {
  final CacheService _cache;

  MenuRepository({CacheService? cache}) : _cache = cache ?? CacheService();

  static const String _menuCacheKey = 'menu_catalog';
  static const String _categoriesCacheKey = 'menu_categories';

  @override
  Future<List<FoodItem>> getMenu({bool forceRefresh = false}) async {
    // 1. Check cache first if not forced
    if (!forceRefresh) {
      final cached = await _cache.get(_menuCacheKey);
      if (cached is List && cached.isNotEmpty) {
        try {
          return cached
              .map((item) => FoodItem.fromJson(Map<String, dynamic>.from(item as Map)))
              .toList();
        } catch (_) {}
      }
    }

    // 2. Fetch fresh from remote API
    try {
      final items = await ApiService.getMenu();
      if (items.isNotEmpty) {
        // Cache the raw JSON data with 15-minute TTL
        final rawJson = items.map((i) => i.toJson()).toList();
        await _cache.set(_menuCacheKey, rawJson, ttl: const Duration(minutes: 15));
        return items;
      }
    } catch (_) {
      // 3. Fallback to stale cache if network fails
      final stale = await _cache.getStale(_menuCacheKey);
      if (stale is List && stale.isNotEmpty) {
        try {
          return stale
              .map((item) => FoodItem.fromJson(Map<String, dynamic>.from(item as Map)))
              .toList();
        } catch (_) {}
      }
    }

    // 4. Ultimate fallback to local mock data
    return MockData.foodItems;
  }

  @override
  Future<List<String>> getCategories({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      final cached = await _cache.get(_categoriesCacheKey);
      if (cached is List && cached.isNotEmpty) {
        return List<String>.from(cached);
      }
    }

    try {
      final cats = await ApiService.getCategories();
      if (cats.isNotEmpty) {
        await _cache.set(_categoriesCacheKey, cats, ttl: const Duration(hours: 1));
        return cats;
      }
    } catch (_) {
      final stale = await _cache.getStale(_categoriesCacheKey);
      if (stale is List && stale.isNotEmpty) {
        return List<String>.from(stale);
      }
    }

    return MockData.categories;
  }
}
