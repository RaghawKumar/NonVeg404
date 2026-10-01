import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/mock_data.dart';
import '../models/food_item.dart';
import '../repositories/menu_repository.dart';
import 'repository_providers.dart';

class MenuState {
  final List<FoodItem> items;
  final List<String> categories;
  final bool isLoading;
  final String? errorMessage;
  final String selectedCategory;
  final String searchQuery;

  const MenuState({
    required this.items,
    required this.categories,
    this.isLoading = false,
    this.errorMessage,
    this.selectedCategory = 'All',
    this.searchQuery = '',
  });

  MenuState copyWith({
    List<FoodItem>? items,
    List<String>? categories,
    bool? isLoading,
    String? errorMessage,
    String? selectedCategory,
    String? searchQuery,
  }) {
    return MenuState(
      items: items ?? this.items,
      categories: categories ?? this.categories,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }

  List<FoodItem> get featuredItems => items.where((i) => i.isFeatured).toList();

  List<FoodItem> get filteredItems {
    return items.where((item) {
      final matchesCategory = selectedCategory == 'All' ||
          item.category.toLowerCase() == selectedCategory.toLowerCase();
      final matchesSearch = searchQuery.isEmpty ||
          item.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().contains(searchQuery.toLowerCase()) ||
          (item.techTag != null && item.techTag!.toLowerCase().contains(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).toList();
  }
}

class MenuNotifier extends StateNotifier<MenuState> {
  final IMenuRepository _repository;

  MenuNotifier(this._repository)
      : super(MenuState(
          items: MockData.foodItems,
          categories: MockData.categories,
        )) {
    loadMenu();
  }

  Future<void> loadMenu({bool forceRefresh = false}) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final fetchedItems = await _repository.getMenu(forceRefresh: forceRefresh);
      final fetchedCats = await _repository.getCategories(forceRefresh: forceRefresh);
      state = state.copyWith(
        items: fetchedItems,
        categories: fetchedCats,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  void selectCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }
}

final menuNotifierProvider =
    StateNotifierProvider<MenuNotifier, MenuState>((ref) {
  final repository = ref.watch(menuRepositoryProvider);
  return MenuNotifier(repository);
});
