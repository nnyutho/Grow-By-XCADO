import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'theme.dart';
import 'screens/login_screen.dart';
import 'screens/home_shell.dart';
import 'screens/dashboard_screen.dart';
import 'screens/marketplace_screen.dart';
import 'screens/listing_detail_screen.dart';
import 'screens/weather_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/trace_scan_screen.dart';

void main() {
  runApp(const ProviderScope(child: GrowApp()));
}

class GrowApp extends StatelessWidget {
  const GrowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Grow by XCADO',
      debugShowCheckedModeBanner: false,
      theme: buildXcadoTheme(),
      routerConfig: _router,
    );
  }
}

final _router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/scan',  builder: (_, __) => const TraceScanScreen()),
    GoRoute(
      path: '/listing/:id',
      builder: (_, state) => ListingDetailScreen(listingId: state.pathParameters['id']!),
    ),
    ShellRoute(
      builder: (_, __, child) => HomeShell(child: child),
      routes: [
        GoRoute(path: '/home',        builder: (_, __) => const DashboardScreen()),
        GoRoute(path: '/marketplace', builder: (_, __) => const MarketplaceScreen()),
        GoRoute(path: '/weather',     builder: (_, __) => const WeatherScreen()),
        GoRoute(path: '/profile',     builder: (_, __) => const ProfileScreen()),
      ],
    ),
  ],
);
