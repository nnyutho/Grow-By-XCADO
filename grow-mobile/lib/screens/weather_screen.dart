import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../api/api_client.dart';
import '../api/mock_data.dart';
import '../theme.dart';
import '../widgets/kpi_card.dart';

final _weatherProvider = FutureProvider.autoDispose<List<WeatherDay>>(
  (ref) => ref.read(apiProvider).weather('Kiambu'),
);

class WeatherScreen extends ConsumerWidget {
  const WeatherScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final w = ref.watch(_weatherProvider);

    return SafeArea(child: w.when(
      loading: () => const Center(child: CircularProgressIndicator(color: XcadoColors.field)),
      error: (e, _) => Center(child: Text('Error: $e')),
      data: (days) {
        final today = days.first;
        return ListView(padding: const EdgeInsets.fromLTRB(20, 20, 20, 100), children: [
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [XcadoColors.sky, XcadoColors.field],
                begin: Alignment.topLeft, end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('NOW · KIAMBU', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.6)),
              const SizedBox(height: 6),
              Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
                Text(today.icon, style: const TextStyle(fontSize: 64)),
                const SizedBox(width: 16),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('${today.high}°C', style: GoogleFonts.barlowCondensed(fontSize: 56, fontWeight: FontWeight.w800, color: Colors.white, height: 1)),
                  Text(today.condition, style: const TextStyle(fontSize: 14, color: Colors.white)),
                ]),
              ]),
              const SizedBox(height: 14),
              Row(children: [
                _miniStat('💧 Rain', '${today.rain}%'),
                _miniStat('🌡️ Low',  '${today.low}°'),
                _miniStat('🌬️ Wind', '12 km/h'),
              ]),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.18), borderRadius: BorderRadius.circular(10)),
                child: const Row(children: [
                  Icon(Icons.tips_and_updates_rounded, color: Colors.white, size: 16),
                  SizedBox(width: 6),
                  Expanded(child: Text('Ideal for spraying today', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700))),
                ]),
              ),
            ]),
          ),
          const SizedBox(height: 22),
          Text('7-Day Forecast', style: GoogleFonts.barlowCondensed(fontSize: 18, fontWeight: FontWeight.w800, color: XcadoColors.ink)),
          const SizedBox(height: 10),
          ...days.map((d) => Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(children: [
                SizedBox(width: 40, child: Text(d.day, style: const TextStyle(fontWeight: FontWeight.w800, color: XcadoColors.ink))),
                const SizedBox(width: 8),
                Text(d.icon, style: const TextStyle(fontSize: 26)),
                const SizedBox(width: 12),
                Expanded(child: Text(d.condition, style: const TextStyle(fontSize: 13, color: XcadoColors.slate))),
                GrowBadge(label: '${d.rain}% rain', color: d.rain > 60 ? XcadoColors.sky : d.rain > 30 ? XcadoColors.harvest : XcadoColors.shoot),
                const SizedBox(width: 8),
                Text('${d.high}° / ${d.low}°', style: GoogleFonts.barlowCondensed(fontSize: 16, fontWeight: FontWeight.w800, color: XcadoColors.ink)),
              ]),
            ),
          )),
        ]);
      },
    ));
  }

  Widget _miniStat(String l, String v) => Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(l, style: const TextStyle(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.w700)),
    Text(v, style: GoogleFonts.barlowCondensed(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white, height: 1)),
  ]));
}
