import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../api/api_client.dart';
import '../api/mock_data.dart';
import '../theme.dart';
import '../widgets/kpi_card.dart';

final _meProvider = FutureProvider.autoDispose<FarmerProfile>((ref) => ref.read(apiProvider).me());

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final me = ref.watch(_meProvider);

    return SafeArea(child: me.when(
      loading: () => const Center(child: CircularProgressIndicator(color: XcadoColors.field)),
      error: (e, _) => Center(child: Text('Error: $e')),
      data: (p) => ListView(padding: const EdgeInsets.fromLTRB(20, 20, 20, 100), children: [
        Center(child: Container(
          width: 84, height: 84,
          decoration: BoxDecoration(
            color: p.gender == 'Female' ? XcadoColors.violet : XcadoColors.field,
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: Text(
            p.name.split(' ').take(2).map((n) => n[0]).join(),
            style: GoogleFonts.barlowCondensed(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w800),
          ),
        )),
        const SizedBox(height: 12),
        Center(child: Text(p.name, style: GoogleFonts.barlowCondensed(fontSize: 24, fontWeight: FontWeight.w800, color: XcadoColors.ink))),
        Center(child: Text(p.phone, style: const TextStyle(fontSize: 13, color: XcadoColors.slate))),
        const SizedBox(height: 8),
        Center(child: GrowBadge(label: 'KYC ${p.kyc}', color: p.kyc == 'Verified' ? XcadoColors.shoot : XcadoColors.amber)),
        const SizedBox(height: 22),
        Card(child: Padding(padding: const EdgeInsets.all(16), child: Column(children: [
          _row('🆔', 'Farmer ID', p.id),
          _divider(),
          _row('📍', 'Location', '${p.subCounty}, ${p.county}'),
          _divider(),
          _row('🌾', 'Primary crop', p.primaryCrop),
          _divider(),
          _row('📐', 'Acres under cultivation', '${p.acres}'),
          _divider(),
          _row('🤝', 'Co-operative', p.coop),
          _divider(),
          _row('💳', 'M-Pesa', p.mpesaNo),
          _divider(),
          _row('📊', 'Credit score', '${p.credit}/100', valueColor: p.credit >= 70 ? XcadoColors.shoot : XcadoColors.amber),
        ]))),
        const SizedBox(height: 16),
        Card(child: Column(children: [
          _action(Icons.school_rounded,        'Training & Knowledge',   () {}),
          _divider(),
          _action(Icons.qr_code_rounded,       'Scan trace QR',          () => context.push('/scan')),
          _divider(),
          _action(Icons.cloud_download_rounded,'Download offline data',  () {}),
          _divider(),
          _action(Icons.settings_rounded,      'Settings',                () {}),
          _divider(),
          _action(Icons.logout_rounded,         'Sign out',               () => context.go('/login'), color: XcadoColors.crimson),
        ])),
      ]),
    ));
  }

  Widget _row(String icon, String l, String v, {Color valueColor = XcadoColors.ink}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 8),
    child: Row(children: [
      Text(icon, style: const TextStyle(fontSize: 16)),
      const SizedBox(width: 12),
      Expanded(child: Text(l, style: const TextStyle(fontSize: 13, color: XcadoColors.slate))),
      Text(v, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: valueColor)),
    ]),
  );

  Widget _action(IconData icon, String label, VoidCallback onTap, {Color color = XcadoColors.ink}) => InkWell(
    onTap: onTap,
    child: Padding(
      padding: const EdgeInsets.all(14),
      child: Row(children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 12),
        Expanded(child: Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: color))),
        Icon(Icons.chevron_right, color: XcadoColors.slate, size: 20),
      ]),
    ),
  );

  Widget _divider() => const Divider(height: 1, color: XcadoColors.border);
}
