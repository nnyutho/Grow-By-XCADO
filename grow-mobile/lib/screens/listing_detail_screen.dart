import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../api/api_client.dart';
import '../api/mock_data.dart';
import '../theme.dart';
import '../widgets/kpi_card.dart';

class ListingDetailScreen extends ConsumerWidget {
  final String listingId;
  const ListingDetailScreen({super.key, required this.listingId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final futureL = ref.read(apiProvider).listing(listingId);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Listing'),
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop()),
      ),
      body: FutureBuilder<Listing?>(
        future: futureL,
        builder: (_, snap) {
          if (!snap.hasData) return const Center(child: CircularProgressIndicator(color: XcadoColors.field));
          final l = snap.data!;
          final totalKES = l.qty * l.price;
          return CustomScrollView(slivers: [
            SliverToBoxAdapter(
              child: Container(
                padding: const EdgeInsets.fromLTRB(24, 18, 24, 24),
                color: Colors.white,
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Container(
                      width: 80, height: 80,
                      decoration: BoxDecoration(color: XcadoColors.mist, borderRadius: BorderRadius.circular(20)),
                      alignment: Alignment.center,
                      child: Text(l.img, style: const TextStyle(fontSize: 44)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(l.crop, style: GoogleFonts.barlowCondensed(fontSize: 26, fontWeight: FontWeight.w800, color: XcadoColors.ink, height: 1)),
                      const SizedBox(height: 4),
                      Text('${l.farmer} · ${l.county}', style: const TextStyle(fontSize: 13, color: XcadoColors.slate)),
                      const SizedBox(height: 8),
                      Wrap(spacing: 6, children: [
                        GrowBadge(label: 'Grade ${l.grade}', color: l.grade == 'AA' ? XcadoColors.violet : XcadoColors.field),
                        GrowBadge(label: l.intent == 'export' ? '✈️ Export' : '🏪 Local', color: l.intent == 'export' ? XcadoColors.sky : XcadoColors.teal),
                      ]),
                    ])),
                  ]),
                  const SizedBox(height: 22),
                  Row(children: [
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Price', style: TextStyle(fontSize: 11, color: XcadoColors.slate, fontWeight: FontWeight.w700)),
                      Text('KES ${l.price}/kg', style: GoogleFonts.barlowCondensed(fontSize: 24, fontWeight: FontWeight.w800, color: XcadoColors.harvest, height: 1)),
                    ])),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Available', style: TextStyle(fontSize: 11, color: XcadoColors.slate, fontWeight: FontWeight.w700)),
                      Text('${l.qty} kg', style: GoogleFonts.barlowCondensed(fontSize: 24, fontWeight: FontWeight.w800, color: XcadoColors.field, height: 1)),
                    ])),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Total value', style: TextStyle(fontSize: 11, color: XcadoColors.slate, fontWeight: FontWeight.w700)),
                      Text('KES ${(totalKES/1000).toStringAsFixed(0)}K', style: GoogleFonts.barlowCondensed(fontSize: 24, fontWeight: FontWeight.w800, color: XcadoColors.shoot, height: 1)),
                    ])),
                  ]),
                ]),
              ),
            ),
            SliverPadding(padding: const EdgeInsets.all(20), sliver: SliverList(delegate: SliverChildListDelegate([
              Card(child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('CERTIFICATIONS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: XcadoColors.slate, letterSpacing: 0.6)),
                const SizedBox(height: 8),
                if (l.certified.isEmpty) const Text('None yet', style: TextStyle(color: XcadoColors.slate))
                else Wrap(spacing: 6, runSpacing: 6, children: l.certified.map((c) => GrowBadge(label: c, color: XcadoColors.field)).toList()),
              ]))),
              const SizedBox(height: 16),
              SizedBox(width: double.infinity, child: ElevatedButton.icon(
                onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order placed (mock)'))),
                icon: const Icon(Icons.shopping_cart_rounded), label: const Text('Place Order'),
              )),
              const SizedBox(height: 8),
              SizedBox(width: double.infinity, child: OutlinedButton.icon(
                onPressed: () {},
                style: OutlinedButton.styleFrom(foregroundColor: XcadoColors.field, side: const BorderSide(color: XcadoColors.field), padding: const EdgeInsets.symmetric(vertical: 14)),
                icon: const Icon(Icons.message_rounded), label: const Text('Message Farmer'),
              )),
              const SizedBox(height: 80),
            ]))),
          ]);
        },
      ),
    );
  }
}
