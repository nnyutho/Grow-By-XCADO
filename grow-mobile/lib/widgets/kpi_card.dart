import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

class KpiCard extends StatelessWidget {
  final String icon, label, value, sub;
  final Color color;
  const KpiCard({
    super.key, required this.icon, required this.label, required this.value,
    this.sub = '', this.color = XcadoColors.field,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(children: [
              Text(icon, style: const TextStyle(fontSize: 16)),
              const SizedBox(width: 6),
              Expanded(child: Text(
                label.toUpperCase(),
                style: const TextStyle(
                  fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.6, color: XcadoColors.slate,
                ),
                overflow: TextOverflow.ellipsis,
              )),
            ]),
            const SizedBox(height: 6),
            Text(value, style: GoogleFonts.barlowCondensed(
              fontWeight: FontWeight.w800, fontSize: 22, color: color, height: 1,
            )),
            if (sub.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(sub, style: const TextStyle(fontSize: 11, color: XcadoColors.slate),
                   maxLines: 1, overflow: TextOverflow.ellipsis),
            ],
          ],
        ),
      ),
    );
  }
}

class GrowBadge extends StatelessWidget {
  final String label;
  final Color color;
  const GrowBadge({super.key, required this.label, this.color = XcadoColors.field});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.20)),
      ),
      child: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color)),
    );
  }
}
