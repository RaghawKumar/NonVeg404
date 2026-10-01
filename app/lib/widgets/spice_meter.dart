import 'package:flutter/material.dart';
import '../models/food_item.dart';
import '../theme/app_theme.dart';

class SpiceMeter extends StatelessWidget {
  final SpiceLevel level;
  final bool showLabel;

  const SpiceMeter({
    super.key,
    required this.level,
    this.showLabel = true,
  });

  int get flameCount {
    switch (level) {
      case SpiceLevel.mild:
        return 1;
      case SpiceLevel.medium:
        return 2;
      case SpiceLevel.hot:
        return 3;
      case SpiceLevel.codeRed:
        return 4;
    }
  }

  Color get spiceColor {
    switch (level) {
      case SpiceLevel.mild:
        return const Color(0xFF10B981);
      case SpiceLevel.medium:
        return const Color(0xFFF59E0B);
      case SpiceLevel.hot:
        return const Color(0xFFEA580C);
      case SpiceLevel.codeRed:
        return const Color(0xFFEF4444);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(4, (index) {
            final isActive = index < flameCount;
            return Padding(
              padding: const EdgeInsets.only(right: 2),
              child: Icon(
                Icons.local_fire_department,
                size: 14,
                color: isActive ? spiceColor : AppColors.borderLight,
              ),
            );
          }),
        ),
        if (showLabel) ...[
          const SizedBox(width: 4),
          Text(
            level.label,
            style: AppTheme.mono(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: spiceColor,
            ),
          ),
        ],
      ],
    );
  }
}
