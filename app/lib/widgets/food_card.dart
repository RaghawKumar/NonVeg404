import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/food_item.dart';
import '../theme/app_theme.dart';
import 'spice_meter.dart';
import 'tech_badge.dart';
import 'food_detail_sheet.dart';

class FoodCard extends StatelessWidget {
  final FoodItem item;
  final VoidCallback? onAddTap;

  const FoodCard({
    super.key,
    required this.item,
    this.onAddTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FoodDetailSheet.show(context, item),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border, width: 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Stack
            Stack(
              children: [
                CachedNetworkImage(
                  imageUrl: item.image,
                  height: 140,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    height: 140,
                    color: AppColors.cardHover,
                    child: const Center(
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    height: 140,
                    color: AppColors.cardHover,
                    child: const Icon(Icons.restaurant, color: AppColors.textMuted, size: 36),
                  ),
                ),
                // Gradient shade overlay
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.6),
                        ],
                      ),
                    ),
                  ),
                ),
                // Top tags
                Positioned(
                  top: 8,
                  left: 8,
                  child: TechBadge(
                    text: item.category.toUpperCase(),
                    color: AppColors.primary,
                    fontSize: 10,
                  ),
                ),
                if (item.techTag != null)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: TechBadge(
                      text: item.techTag!,
                      color: AppColors.success,
                      fontSize: 10,
                    ),
                  ),
                // Prep time bottom tag
                Positioned(
                  bottom: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.7),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.timer_outlined, size: 12, color: AppColors.primary),
                        const SizedBox(width: 4),
                        Text(
                          item.prepTime,
                          style: AppTheme.mono(fontSize: 10, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // Card Body
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    item.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Description
                  Text(
                    item.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Spice & Rating Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SpiceMeter(level: item.spiceLevel, showLabel: false),
                      Row(
                        children: [
                          const Icon(Icons.star, size: 13, color: AppColors.primary),
                          const SizedBox(width: 3),
                          Text(
                            '${item.rating}',
                            style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Price and Add Action
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '₹${item.price.toStringAsFixed(2)}',
                            style: AppTheme.mono(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: AppColors.primary,
                            ),
                          ),
                          if (item.originalPrice != null)
                            Text(
                              '₹${item.originalPrice!.toStringAsFixed(2)}',
                              style: AppTheme.mono(
                                fontSize: 11,
                                color: AppColors.textMuted,
                              ).copyWith(decoration: TextDecoration.lineThrough),
                            ),
                        ],
                      ),

                      // Add Button
                      InkWell(
                        onTap: onAddTap ?? () => FoodDetailSheet.show(context, item),
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.primary, width: 1),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.add, size: 14, color: AppColors.primary),
                              const SizedBox(width: 2),
                              Text(
                                'ADD',
                                style: AppTheme.mono(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
