import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../models/food_item.dart';
import '../theme/app_theme.dart';
import '../providers/cart_provider.dart';
import 'tech_badge.dart';

class FoodDetailSheet extends StatefulWidget {
  final FoodItem item;

  const FoodDetailSheet({super.key, required this.item});

  static Future<void> show(BuildContext context, FoodItem item) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => FoodDetailSheet(item: item),
    );
  }

  @override
  State<FoodDetailSheet> createState() => _FoodDetailSheetState();
}

class _FoodDetailSheetState extends State<FoodDetailSheet> {
  int _quantity = 1;
  late SpiceLevel _selectedSpice;
  final Set<String> _selectedAddonIds = {};
  final TextEditingController _notesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _selectedSpice = widget.item.spiceLevel;
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  double get _currentUnitPrice {
    double addonsPrice = 0.0;
    for (final addon in widget.item.addOns) {
      if (_selectedAddonIds.contains(addon.id)) {
        addonsPrice += addon.price;
      }
    }
    return widget.item.price + addonsPrice;
  }

  double get _currentTotalPrice => _currentUnitPrice * _quantity;

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);

    return Container(
      constraints: BoxConstraints(
        maxHeight: mediaQuery.size.height * 0.88,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        border: Border(
          top: BorderSide(color: AppColors.border, width: 1.5),
          left: BorderSide(color: AppColors.border, width: 1),
          right: BorderSide(color: AppColors.border, width: 1),
        ),
      ),
      child: Column(
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.borderLight,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Scrollable Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Food Image
                  Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: CachedNetworkImage(
                          imageUrl: widget.item.image,
                          height: 210,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            height: 210,
                            color: AppColors.cardHover,
                            child: const Center(
                              child: CircularProgressIndicator(color: AppColors.primary),
                            ),
                          ),
                          errorWidget: (context, url, error) => Container(
                            height: 210,
                            color: AppColors.cardHover,
                            child: const Icon(Icons.fastfood, size: 48, color: AppColors.textMuted),
                          ),
                        ),
                      ),
                      Positioned(
                        top: 12,
                        left: 12,
                        child: TechBadge(
                          text: widget.item.category.toUpperCase(),
                          color: AppColors.primary,
                        ),
                      ),
                      if (widget.item.techTag != null)
                        Positioned(
                          top: 12,
                          right: 12,
                          child: TechBadge(
                            text: widget.item.techTag!,
                            color: AppColors.success,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Title and Price
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          widget.item.name,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '₹${widget.item.price.toStringAsFixed(2)}',
                            style: AppTheme.mono(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                          if (widget.item.originalPrice != null)
                            Text(
                              '₹${widget.item.originalPrice!.toStringAsFixed(2)}',
                              style: AppTheme.mono(
                                fontSize: 13,
                                color: AppColors.textMuted,
                              ).copyWith(decoration: TextDecoration.lineThrough),
                            ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Metadata Badges (Rating, Prep Time, Calories)
                  Wrap(
                    spacing: 12,
                    runSpacing: 6,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.star, size: 16, color: AppColors.primary),
                          const SizedBox(width: 4),
                          Text(
                            '${widget.item.rating} (${widget.item.reviewsCount} reviews)',
                            style: AppTheme.mono(fontSize: 12, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.timer_outlined, size: 15, color: AppColors.textMuted),
                          const SizedBox(width: 4),
                          Text(
                            widget.item.prepTime,
                            style: AppTheme.mono(fontSize: 12, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                      if (widget.item.calories != null)
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.bolt, size: 15, color: AppColors.secondary),
                            const SizedBox(width: 2),
                            Text(
                              '${widget.item.calories} kcal',
                              style: AppTheme.mono(fontSize: 12, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Description
                  Text(
                    widget.item.description,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Spice Level Selector
                  Text(
                    'CALIBRATE SPICE LEVEL',
                    style: AppTheme.mono(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: SpiceLevel.values.map((lvl) {
                      final isSelected = _selectedSpice == lvl;
                      return ChoiceChip(
                        label: Text(lvl.label),
                        selected: isSelected,
                        onSelected: (selected) {
                          if (selected) setState(() => _selectedSpice = lvl);
                        },
                        labelStyle: AppTheme.mono(
                          fontSize: 12,
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
                    }).toList(),
                  ),
                  const SizedBox(height: 22),

                  // Add-ons Section
                  if (widget.item.addOns.isNotEmpty) ...[
                    Text(
                      'CUSTOM ADDONS & EXTRA GRAVIES',
                      style: AppTheme.mono(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                        color: AppColors.textMuted,
                      ),
                    ),
                    const SizedBox(height: 10),
                    ...widget.item.addOns.map((addon) {
                      final isChecked = _selectedAddonIds.contains(addon.id);
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        decoration: BoxDecoration(
                          color: AppColors.card,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isChecked ? AppColors.primary : AppColors.border,
                            width: 1,
                          ),
                        ),
                        child: CheckboxListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                          dense: true,
                          title: Text(
                            addon.name,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: isChecked ? FontWeight.w600 : FontWeight.normal,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          subtitle: Text(
                            '+ ₹${addon.price.toStringAsFixed(2)}',
                            style: AppTheme.mono(
                              fontSize: 12,
                              color: AppColors.primary,
                            ),
                          ),
                          value: isChecked,
                          activeColor: AppColors.primary,
                          checkColor: Colors.black,
                          onChanged: (val) {
                            setState(() {
                              if (val == true) {
                                _selectedAddonIds.add(addon.id);
                              } else {
                                _selectedAddonIds.remove(addon.id);
                              }
                            });
                          },
                        ),
                      );
                    }),
                    const SizedBox(height: 16),
                  ],

                  // Special Notes / Flags
                  Text(
                    'DEVELOPER COOKING INSTRUCTIONS',
                    style: AppTheme.mono(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _notesController,
                    maxLines: 2,
                    style: AppTheme.mono(fontSize: 13),
                    decoration: InputDecoration(
                      hintText: '// e.g. Extra mint dip, less salt, pack cutlery...',
                      hintStyle: AppTheme.mono(fontSize: 12, color: AppColors.textMuted),
                      filled: true,
                      fillColor: AppColors.card,
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
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),

          // Bottom Bar with Quantity and Add Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppColors.card,
              border: Border(top: BorderSide(color: AppColors.border, width: 1)),
            ),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  // Quantity Stepper
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove, size: 18),
                          onPressed: () {
                            if (_quantity > 1) {
                              setState(() => _quantity--);
                            }
                          },
                          color: AppColors.textPrimary,
                        ),
                        Text(
                          '$_quantity',
                          style: AppTheme.mono(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.add, size: 18),
                          onPressed: () {
                            setState(() => _quantity++);
                          },
                          color: AppColors.primary,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 14),

                  // Add to Cart Button
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 4,
                        shadowColor: AppColors.primary.withValues(alpha: 0.4),
                      ),
                      onPressed: () {
                        final selectedAddonsList = widget.item.addOns
                            .where((a) => _selectedAddonIds.contains(a.id))
                            .toList();

                        context.read<CartProvider>().addToCart(
                          widget.item,
                          quantity: _quantity,
                          selectedAddOns: selectedAddonsList,
                          notes: _notesController.text.trim().isEmpty 
                              ? null 
                              : _notesController.text.trim(),
                        );

                        Navigator.of(context).pop();

                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Row(
                              children: [
                                const Icon(Icons.check_circle, color: AppColors.primary, size: 18),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text('Compiled to cart: ${widget.item.name} (x$_quantity)'),
                                ),
                              ],
                            ),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.add_shopping_cart, size: 18),
                            const SizedBox(width: 8),
                            Text(
                              'ADD TO STACK // ₹${_currentTotalPrice.toStringAsFixed(2)}',
                              style: AppTheme.mono(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
