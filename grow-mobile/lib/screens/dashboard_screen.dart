import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../api/api_client.dart';
import '../api/mock_data.dart';
import '../theme.dart';
import '../widgets/kpi_card.dart';
import '../widgets/xgrow_brand.dart';

final _dashProvider = FutureProvider<DashboardSummary>((ref) => ref.read(apiProvider).dashboard());
final _meProvider   = FutureProvider<FarmerProfile>((ref) => ref.read(apiProvider).me());

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dash = ref.watch(_dashProvider);
    final me   = ref.watch(_meProvider);

    return SafeArea(
      child: CustomScrollView(slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
          sliver: SliverList(delegate: SliverChildListDelegate([
            // Greeting header
            Row(children: [
              const XGrowMark(size: 44),
              const SizedBox(width: 12),
              Expanded(child: me.when(
                data: (p) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Habari, ${p.name.split(' ').first} 👋',
                    style: GoogleFonts.barlowCondensed(fontSize: 22, fontWeight: FontWeight.w800, color: XcadoColors.ink, height: 1)),
                  const SizedBox(height: 2),
                  Text('${p.coop} · ${p.county}', style: const TextStyle(fontSize: 12, color: XcadoColors.slate)),
                ]),
                loading: () => const LinearProgressIndicator(color: XcadoColors.field),
                error: (_, __) => const Text('—'),
              )),
              IconButton(icon: const Icon(Icons.notifications_outlined), color: XcadoColors.ink, onPressed: () {}),
            ]),
            const SizedBox(height: 20),
            dash.when(
              loading: () => const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator(color: XcadoColors.field))),
              error: (e, _) => Text('Error: $e', style: const TextStyle(color: XcadoColors.crimson)),
              data: (d) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                GridView.count(
                  shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 1.7,
                  children: [
                    KpiCard(icon:'📦', label:'Active listings', value:'${d.activeListings}', sub:'On the market', color: XcadoColors.field),
                    KpiCard(icon:'🛒', label:'Pending orders',  value:'${d.pendingOrders}',  sub:'Awaiting action', color: XcadoColors.harvest),
                    KpiCard(icon:'💳', label:'M-Pesa · month',  value:'KES ${(d.mpesaThisMonth/1000).toStringAsFixed(0)}K', sub:'Last 30 days',     color: XcadoColors.shoot),
                    KpiCard(icon:'⚠️', label:'Alerts',           value:'${d.weatherAlerts}',  sub:'Weather + cert',  color: XcadoColors.crimson),
                  ],
                ),
                const SizedBox(height: 22),
                Text('Recent Activity', style: GoogleFonts.barlowCondensed(fontSize: 18, fontWeight: FontWeight.w800, color: XcadoColors.ink)),
                const SizedBox(height: 8),
                ...d.recentActivity.map((a) => Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: XcadoColors.mist,
                      child: Text(a['icon'], style: const TextStyle(fontSize: 18)),
                    ),
                    title: Text(a['title'], style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    subtitle: Text(a['detail'], style: const TextStyle(fontSize: 12, color: XcadoColors.slate)),
                    trailing: Text(a['time'], style: const TextStyle(fontSize: 11, color: XcadoColors.slate)),
                  ),
                )),
              ]),
            ),
          ])),
        ),
      ]),
    );
  }
}
