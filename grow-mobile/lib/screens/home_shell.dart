import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme.dart';

class HomeShell extends StatelessWidget {
  final Widget child;
  const HomeShell({super.key, required this.child});

  static const _tabs = <(String, IconData, String)>[
    ('/home',        Icons.home_rounded,            'Home'),
    ('/marketplace', Icons.storefront_rounded,      'Market'),
    ('/weather',     Icons.wb_cloudy_rounded,       'Weather'),
    ('/profile',     Icons.person_rounded,          'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    final loc = GoRouterState.of(context).uri.path;
    final idx = _tabs.indexWhere((t) => t.$1 == loc).clamp(0, _tabs.length - 1);

    return Scaffold(
      body: child,
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/scan'),
        backgroundColor: XcadoColors.harvest,
        foregroundColor: Colors.white,
        child: const Icon(Icons.qr_code_scanner_rounded),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: Colors.white,
        elevation: 8,
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        child: SizedBox(
          height: 58,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(_tabs.length, (i) {
              if (i == 2) return const SizedBox(width: 60); // FAB notch
              final t = _tabs[i];
              final active = i == idx;
              return InkWell(
                onTap: () => context.go(t.$1),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(t.$2, color: active ? XcadoColors.field : XcadoColors.slate, size: 22),
                    const SizedBox(height: 2),
                    Text(t.$3, style: TextStyle(
                      fontSize: 10, fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                      color: active ? XcadoColors.field : XcadoColors.slate,
                    )),
                  ]),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
