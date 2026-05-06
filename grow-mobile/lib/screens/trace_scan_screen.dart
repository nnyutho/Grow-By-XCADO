import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../api/api_client.dart';
import '../api/mock_data.dart';
import '../theme.dart';
import '../widgets/kpi_card.dart';

class TraceScanScreen extends ConsumerStatefulWidget {
  const TraceScanScreen({super.key});
  @override
  ConsumerState<TraceScanScreen> createState() => _TraceScanScreenState();
}

class _TraceScanScreenState extends ConsumerState<TraceScanScreen> {
  TraceRecord? _result;
  bool _scanning = true;

  Future<void> _onDetect(BarcodeCapture cap) async {
    if (!_scanning || cap.barcodes.isEmpty) return;
    final code = cap.barcodes.first.rawValue;
    if (code == null) return;
    setState(() => _scanning = false);
    final r = await ref.read(apiProvider).trace(code);
    if (mounted) setState(() => _result = r);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan Trace QR'),
        leading: IconButton(icon: const Icon(Icons.close), onPressed: () => context.pop()),
      ),
      body: _result == null ? _scannerView() : _resultView(_result!),
    );
  }

  Widget _scannerView() {
    return Stack(children: [
      MobileScanner(onDetect: _onDetect),
      Container(
        decoration: BoxDecoration(
          border: Border.all(color: XcadoColors.lime, width: 3),
          borderRadius: BorderRadius.circular(20),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 60, vertical: 200),
      ),
      Positioned(
        bottom: 32, left: 0, right: 0,
        child: Column(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.6), borderRadius: BorderRadius.circular(20)),
            child: const Text('Point at any Xcado QR seal', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () async {
              final r = await ref.read(apiProvider).trace('DEMO-QR-001');
              setState(() { _result = r; _scanning = false; });
            },
            style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Colors.white)),
            icon: const Icon(Icons.touch_app_rounded), label: const Text('Use demo QR'),
          ),
        ]),
      ),
    ]);
  }

  Widget _resultView(TraceRecord r) {
    return ListView(padding: const EdgeInsets.fromLTRB(20, 20, 20, 40), children: [
      Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Icon(Icons.verified_rounded, color: XcadoColors.shoot, size: 24),
          const SizedBox(width: 8),
          Text('Verified', style: GoogleFonts.barlowCondensed(fontSize: 18, fontWeight: FontWeight.w800, color: XcadoColors.shoot)),
          const Spacer(),
          Text(r.qrId, style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: XcadoColors.slate)),
        ]),
        const SizedBox(height: 12),
        Text(r.productName, style: GoogleFonts.barlowCondensed(fontSize: 22, fontWeight: FontWeight.w800, color: XcadoColors.ink, height: 1.1)),
        const SizedBox(height: 4),
        Text('${r.quantityKg.toStringAsFixed(0)} kg · Grade ${r.grade} · Buyer: ${r.buyer}', style: const TextStyle(fontSize: 12, color: XcadoColors.slate)),
        const SizedBox(height: 14),
        Wrap(spacing: 6, runSpacing: 6, children: r.certifications.map((c) => GrowBadge(label: c, color: XcadoColors.field)).toList()),
      ]))),
      const SizedBox(height: 16),
      Text('Supply Chain Journey', style: GoogleFonts.barlowCondensed(fontSize: 16, fontWeight: FontWeight.w800, color: XcadoColors.ink)),
      const SizedBox(height: 8),
      ...r.events.asMap().entries.map((e) => _stage(e.value['stage']!, e.value['location']!, e.value['date']!, e.key == r.events.length - 1)),
      const SizedBox(height: 24),
      ElevatedButton.icon(
        onPressed: () { setState(() { _result = null; _scanning = true; }); },
        icon: const Icon(Icons.qr_code_scanner_rounded), label: const Text('Scan another'),
      ),
    ]);
  }

  Widget _stage(String stage, String loc, String date, bool last) => Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Column(children: [
      Container(width: 14, height: 14, decoration: const BoxDecoration(color: XcadoColors.field, shape: BoxShape.circle)),
      if (!last) Container(width: 2, height: 36, color: XcadoColors.border),
    ]),
    const SizedBox(width: 12),
    Expanded(child: Padding(padding: const EdgeInsets.only(bottom: 16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(stage, style: const TextStyle(fontWeight: FontWeight.w700, color: XcadoColors.ink, fontSize: 14)),
      Text('$loc · $date', style: const TextStyle(fontSize: 12, color: XcadoColors.slate)),
    ]))),
  ]);
}
