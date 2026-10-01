import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Deep dark developer theme
  static const Color background = Color(0xFF070709);
  static const Color surface = Color(0xFF0F0F16);
  static const Color card = Color(0xFF14141E);
  static const Color cardHover = Color(0xFF1C1C2A);
  static const Color border = Color(0xFF242436);
  static const Color borderLight = Color(0xFF33334A);

  // Accents
  static const Color primary = Color(0xFFF59E0B); // Amber / Warning Glow
  static const Color primaryHover = Color(0xFFFBBF24);
  static const Color secondary = Color(0xFFEA580C); // Darker Flame
  static const Color danger = Color(0xFFEF4444); // Code Red / Error
  static const Color success = Color(0xFF10B981); // 200 OK / Emerald Green
  static const Color info = Color(0xFF3B82F6); // Blue

  // Text
  static const Color textPrimary = Color(0xFFF3F4F6);
  static const Color textSecondary = Color(0xFF9CA3AF);
  static const Color textMuted = Color(0xFF6B7280);

  // Glows
  static Color primaryGlow = const Color(0xFFF59E0B).withValues(alpha: 0.25);
  static Color dangerGlow = const Color(0xFFEF4444).withValues(alpha: 0.25);
  static Color successGlow = const Color(0xFF10B981).withValues(alpha: 0.25);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      primaryColor: AppColors.primary,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.surface,
        error: AppColors.danger,
        onPrimary: Colors.black,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimary,
      ),
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
      ).apply(
        bodyColor: AppColors.textPrimary,
        displayColor: AppColors.textPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: AppColors.textPrimary),
      ),
      cardTheme: CardThemeData(
        color: AppColors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppColors.border, width: 1),
          borderRadius: BorderRadius.circular(14),
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.surface,
        modalBackgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.card,
        contentTextStyle: GoogleFonts.jetBrainsMono(
          color: AppColors.textPrimary,
          fontSize: 13,
        ),
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppColors.primary, width: 1),
          borderRadius: BorderRadius.circular(8),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // Developer monospace font helper
  static TextStyle mono({
    double fontSize = 13,
    FontWeight fontWeight = FontWeight.normal,
    Color color = AppColors.textPrimary,
    double? letterSpacing,
  }) {
    return GoogleFonts.jetBrainsMono(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: letterSpacing,
    );
  }
}
