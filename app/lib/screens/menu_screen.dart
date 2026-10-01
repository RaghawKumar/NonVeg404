import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../models/food_item.dart';
import '../providers/menu_provider.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/food_card.dart';

class MenuScreen extends StatefulWidget {
  final String? initialCategory;

  const MenuScreen({super.key, this.initialCategory});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  final TextEditingController _searchController = TextEditingController();
  late String _selectedCategory;
  String _selectedSpice = 'All';
  String _sortBy = 'Popular';

  final List<String> _sortOptions = [
    'Popular',
    'Price: Low to High',
    'Price: High to Low',
    'Prep Time',
  ];

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.initialCategory ?? 'All';
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<FoodItem> _getFilteredItems(List<FoodItem> sourceItems) {
    final query = _searchController.text.trim().toLowerCase();

    return sourceItems.where((item) {
      // Category filter
      if (_selectedCategory != 'All' &&
          item.category.toLowerCase() != _selectedCategory.toLowerCase()) {
        return false;
      }

      // Spice filter
      if (_selectedSpice != 'All') {
        if (item.spiceLevel.label != _selectedSpice) {
          return false;
        }
      }

      // Search query
      if (query.isNotEmpty) {
        final matchName = item.name.toLowerCase().contains(query);
        final matchDesc = item.description.toLowerCase().contains(query);
        final matchTag = item.techTag?.toLowerCase().contains(query) ?? false;
        if (!matchName && !matchDesc && !matchTag) return false;
      }

      return true;
    }).toList()
      ..sort((a, b) {
        if (_sortBy == 'Price: Low to High') {
          return a.price.compareTo(b.price);
        } else if (_sortBy == 'Price: High to Low') {
          return b.price.compareTo(a.price);
        } else if (_sortBy == 'Prep Time') {
          return a.prepTime.compareTo(b.prepTime);
        }
        return b.rating.compareTo(a.rating);
      });
  }

  @override
  Widget build(BuildContext context) {
    final menu = context.watch<MenuProvider>();
    final items = _getFilteredItems(menu.items);
    final categories = menu.categories;

    return Scaffold(
      appBar: const CustomAppBar(title: 'FOOD MANIFEST'),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            color: AppColors.background,
            child: Column(
              children: [
                // Search Input
                TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  style: AppTheme.mono(fontSize: 13),
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search, color: AppColors.primary, size: 20),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18, color: AppColors.textMuted),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                    hintText: 'grep "biryani, burger, kebab..."',
                    hintStyle: AppTheme.mono(fontSize: 12, color: AppColors.textMuted),
                    filled: true,
                    fillColor: AppColors.card,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.primary),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Category Chips
                SizedBox(
                  height: 36,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: categories.length,
                    separatorBuilder: (context, index) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final cat = categories[index];
                      final isSelected = _selectedCategory == cat;
                      return ChoiceChip(
                        label: Text(cat),
                        selected: isSelected,
                        onSelected: (selected) {
                          if (selected) setState(() => _selectedCategory = cat);
                        },
                        labelStyle: AppTheme.mono(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          color: isSelected ? Colors.black : AppColors.textPrimary,
                        ),
                        selectedColor: AppColors.primary,
                        backgroundColor: AppColors.card,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: BorderSide(
                            color: isSelected ? AppColors.primary : AppColors.border,
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),

                // Spice & Sort Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Spice Quick Selector
                    Row(
                      children: [
                        Text(
                          'Spice:',
                          style: AppTheme.mono(fontSize: 11, color: AppColors.textMuted),
                        ),
                        const SizedBox(width: 6),
                        DropdownButton<String>(
                          value: _selectedSpice,
                          dropdownColor: AppColors.card,
                          isDense: true,
                          underline: const SizedBox(),
                          style: AppTheme.mono(fontSize: 11, color: AppColors.primary),
                          items: ['All', 'Mild', 'Medium', 'Hot', 'Code Red'].map((s) {
                            return DropdownMenuItem(value: s, child: Text(s));
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedSpice = val);
                          },
                        ),
                      ],
                    ),

                    // Sort By Dropdown
                    Row(
                      children: [
                        Text(
                          'Sort:',
                          style: AppTheme.mono(fontSize: 11, color: AppColors.textMuted),
                        ),
                        const SizedBox(width: 6),
                        DropdownButton<String>(
                          value: _sortBy,
                          dropdownColor: AppColors.card,
                          isDense: true,
                          underline: const SizedBox(),
                          style: AppTheme.mono(fontSize: 11, color: AppColors.primary),
                          items: _sortOptions.map((s) {
                            return DropdownMenuItem(value: s, child: Text(s));
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _sortBy = val);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Search Results Manifest Count
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            color: AppColors.surface,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '> QUERY RETURNED: ${items.length} DISHES',
                  style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted),
                ),
                Text(
                  'STATUS: 200 OK',
                  style: AppTheme.mono(fontSize: 10, color: AppColors.success),
                ),
              ],
            ),
          ),

          // Items Grid
          Expanded(
            child: RefreshIndicator(
              color: AppColors.primary,
              backgroundColor: AppColors.card,
              onRefresh: () => menu.refresh(),
              child: items.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.card,
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.border),
                            ),
                            child: const Icon(Icons.search_off, size: 40, color: AppColors.primary),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            '404: NO DISHES MATCHED',
                            style: AppTheme.mono(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'grep command returned exit code 1.\nTry adjusting your search or spice filters.',
                            textAlign: TextAlign.center,
                            style: AppTheme.mono(fontSize: 12, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.65,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      return FoodCard(item: items[index]);
                    },
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
