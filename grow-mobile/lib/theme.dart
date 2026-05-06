import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Grow by XCADO — Brand tokens (mirrors the web app's palette in src/Sprint5.jsx).
class XcadoColors {
  static const grove   = Color(0xFF0F3D20);
  static const field   = Color(0xFF1E7A3E);
  static const shoot   = Color(0xFF5BB35E);
  static const lime    = Color(0xFF9DD96A);
  static const harvest = Color(0xFFE8A020);
  static const earth   = Color(0xFF7A4E2D);
  static const chalk   = Color(0xFFF5F1E8);
  static const ink     = Color(0xFF0C1A0E);

  static const sky     = Color(0xFF0EA5E9);
  static const crimson = Color(0xFFDC2626);
  static const violet  = Color(0xFF7C3AED);
  static const teal    = Color(0xFF0D9488);
  static const orange  = Color(0xFFEA580C);
  static const slate   = Color(0xFF64748B);
  static const mist    = Color(0xFFF7F4EF);
  static const border  = Color(0xFFE5DFD3);
}

/// Returns the app's ThemeData. Outfit (body) + Barlow Condensed (display).
ThemeData buildXcadoTheme() {
  final base = ThemeData.light(useMaterial3: true);
  final outfitText = GoogleFonts.outfitTextTheme(base.textTheme);

  return base.copyWith(
    scaffoldBackgroundColor: XcadoColors.chalk,
    primaryColor: XcadoColors.field,
    colorScheme: const ColorScheme.light(
      primary:   XcadoColors.field,
      secondary: XcadoColors.harvest,
      surface:   Colors.white,
      onPrimary: Colors.white,
      onSurface: XcadoColors.ink,
    ),
    textTheme: outfitText.copyWith(
      headlineLarge: GoogleFonts.barlowCondensed(
        fontWeight: FontWeight.w800, fontSize: 32, color: XcadoColors.ink, letterSpacing: -0.5,
      ),
      headlineMedium: GoogleFonts.barlowCondensed(
        fontWeight: FontWeight.w800, fontSize: 24, color: XcadoColors.ink, letterSpacing: -0.3,
      ),
      titleLarge: GoogleFonts.barlowCondensed(
        fontWeight: FontWeight.w700, fontSize: 20, color: XcadoColors.ink,
      ),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: XcadoColors.ink,
      elevation: 0,
      titleTextStyle: GoogleFonts.barlowCondensed(
        fontWeight: FontWeight.w800, fontSize: 18, color: XcadoColors.ink, letterSpacing: -0.3,
      ),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: XcadoColors.border),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: XcadoColors.field,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: const TextStyle(fontWeight: FontWeight.w700),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: XcadoColors.mist,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: XcadoColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: XcadoColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: XcadoColors.field, width: 2),
      ),
    ),
  );
}
