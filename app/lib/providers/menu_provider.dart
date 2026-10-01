import 'package:flutter/foundation.dart';
import '../models/food_item.dart';
import '../repositories/menu_repository.dart';
import '../data/mock_data.dart';

class MenuProvider with ChangeNotifier {
  final IMenuRepository _repository;

  List<FoodItem> _items = MockData.foodItems;
  List<String> _categories = MockData.categories;
  bool _isLoading = false;
  String? _errorMessage;
  bool _isOnline = false;

  List<FoodItem> get items => _items;
  List<String> get categories => _categories;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isOnline => _isOnline;

  MenuProvider({IMenuRepository? repository})
      : _repository = repository ?? MenuRepository() {
    fetchMenu();
  }

  Future<void> fetchMenu({bool forceRefresh = false}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final fetchedItems = await _repository.getMenu(forceRefresh: forceRefresh);
      final fetchedCats = await _repository.getCategories(forceRefresh: forceRefresh);

      if (fetchedItems.isNotEmpty) {
        _items = fetchedItems;
        _isOnline = true;
      }
      if (fetchedCats.isNotEmpty) {
        _categories = fetchedCats;
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refresh() async {
    await fetchMenu(forceRefresh: true);
  }
}
