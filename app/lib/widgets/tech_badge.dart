import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class TechBadge extends StatelessWidget {
  final String text;
  final Color? color;
  final IconData? icon;
  final bool isGlow;
  final double fontSize;

  const TechBadge({
    super.key,
    required this.text,
    this.color,
    this.icon,
    this.isGlow = false,
    this.fontSize = 11,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? AppColors.primary;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: effectiveColor.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: effectiveColor.withValues(alpha: isGlow ? 0.6 : 0.3),
          width: 1,
        ),
        boxShadow: isGlow
            ? [
                BoxShadow(
                  color: effectiveColor.withValues(alpha: 0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 0),
                )
              ]
            : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: fontSize + 1, color: effectiveColor),
            const SizedBox(width: 4),
          ],
          Text(
            text,
            style: AppTheme.mono(
              fontSize: fontSize,
              fontWeight: FontWeight.w600,
              color: effectiveColor,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
