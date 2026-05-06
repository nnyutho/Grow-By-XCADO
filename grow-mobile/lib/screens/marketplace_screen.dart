import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../api/api_client.dart';
import '../api/mock_data.dart';
import '../theme.dart';
import '../widgets/kpi_card.dart';

final _filterProvider = StateProvider<String>((_) => 'all');
final _listingsProvider = FutureProvider.autoDispose<List<Listing>>((ref) {
  final f = ref.watch(_filterProvider);
  return ref.read(apiProvider).listings(intent: f);
});

class MarketplaceScreen extends ConsumerWidget {
  const MarketplaceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(_filterProvider);
    final listings = ref.watch(_listingsProvider);

    return SafeArea(
      child: CustomScrollView(slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
          sliver: SliverToBoxAdapter(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Marketplace', style: GoogleFonts.barlowCondensed(fontSize: 26, fontWeight: FontWeight.w800, color: XcadoColors.ink, height: 1)),
            const Text('Live produce listings · FOB Mombasa pricing', style: TextStyle(fontSize: 13, color: XcadoColors.slate)),
            const SizedBox(height: 16),
            SizedBox(
              height: 36,
              child: ListView(scrollDirection: Axis.horizontal, children: [
                for (final f in const [['all','All'],['export','✈️ Export'],['local','🏪 Local']])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(f[1]),
                      selected: filter == f[0],
                      onSelected: (_) => ref.read(_filterProvider.notifier).state = f[0],
                      selectedColor: XcadoColors.field,
                      labelStyle: TextStyle(color: filter == f[0] ? Colors.white : XcadoColors.slate, fontSize: 12, fontWeight: FontWeight.w700),
                      backgroundColor: XcadoColors.mist,
                      side: BorderSide(color: filter == f[0] ? XcadoColors.field : XcadoColors.border),
                    ),
                  ),
              ]),
            ),
            const SizedBox(height: 14),
          ])),
        ),
        listings.when(
          loading: () => const SliverFillRemaining(hasScrollBody: false, child: Center(child: CircularProgressIndicator(color: XcadoColors.field))),
          error: (e, _) => SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.all(24), child: Text('Error: $e', style: const TextStyle(color: XcadoColors.crimson)))),
          data: (items) => SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
            sliver: SliverList.separated(
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (_, i) => _ListingTile(items[i]),
            ),
          ),
        ),
      ]),
    );
  }
}

class _ListingTile extends StatelessWidget {
  final Listing l;
  const _ListingTile(this.l);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: () => context.push('/listing/${l.id}'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(children: [
            Container(
              width: 52, height: 52,
              decoration: BoxDecoration(color: XcadoColors.mist, borderRadius: BorderRadius.circular(12)),
              alignment: Alignment.center,
              child: Text(l.img, style: const TextStyle(fontSize: 26)),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Expanded(child: Text(l.crop, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: XcadoColors.ink), overflow: TextOverflow.ellipsis)),
                GrowBadge(label: 'Grade ${l.grade}', color: l.grade == 'AA' ? XcadoColors.violet : XcadoColors.field),
              ]),
              const SizedBox(height: 2),
              Text('${l.farmer} · ${l.county}', style: const TextStyle(fontSize: 12, color: XcadoColors.slate)),
              const SizedBox(height: 8),
              Row(children: [
                GrowBadge(label: l.intent == 'export' ? '✈️ Export' : '🏪 Local',
                          color: l.intent == 'export' ? XcadoColors.sky : XcadoColors.teal),
                const Spacer(),
                Text('KES ${l.price}/kg', style: GoogleFonts.barlowCondensed(
                  fontSize: 18, fontWeight: FontWeight.w800, color: XcadoColors.harvest, height: 1)),
              ]),
            ])),
          ]),
        ),
      ),
    );
  }
}
