import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

/// Square tile that wraps the official Xcado logo PNG. White background by
/// default so the wide white-bg logo PNG blends cleanly. Mirrors the React
/// XGrowMark component in src/Sprint5.jsx.
class XGrowMark extends StatelessWidget {
  final double size;
  final Color background;
  final double radius;
  const XGrowMark({super.key, this.size = 36, this.background = Colors.white, this.radius = 10});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size, height: size,
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: XcadoColors.border),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 2, offset: const Offset(0, 1))],
      ),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: EdgeInsets.all(size * 0.07),
        child: Image.asset('assets/images/xcado-logo-mark.png', fit: BoxFit.contain),
      ),
    );
  }
}

/// "Grow / by XCADO" wordmark.
class XGrowWordmark extends StatelessWidget {
  final bool light;
  final double size;
  const XGrowWordmark({super.key, this.light = false, this.size = 20});

  @override
  Widget build(BuildContext context) {
    final fg = light ? XcadoColors.chalk : XcadoColors.grove;
    final accent = light ? XcadoColors.lime : XcadoColors.field;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('Grow', style: GoogleFonts.barlowCondensed(
          fontWeight: FontWeight.w800, fontSize: size, color: fg, height: 1, letterSpacing: -0.5,
        )),
        const SizedBox(height: 2),
        Text('BY XCADO', style: GoogleFonts.barlowCondensed(
          fontWeight: FontWeight.w700, fontSize: size * 0.42, color: accent,
          height: 1, letterSpacing: 2.4,
        )),
      ],
    );
  }
}
