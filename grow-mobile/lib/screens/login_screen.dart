import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../api/api_client.dart';
import '../theme.dart';
import '../widgets/xgrow_brand.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});
  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneCtl = TextEditingController(text: '+254 711 002 341');
  final _otpCtl   = TextEditingController();
  bool _otpSent = false;
  bool _loading = false;

  Future<void> _requestOtp() async {
    setState(() => _loading = true);
    final ok = await ref.read(apiProvider).requestOtp(_phoneCtl.text);
    setState(() { _loading = false; _otpSent = ok; });
    if (ok && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('OTP sent — use 0000 in mock mode')),
      );
    }
  }

  Future<void> _verify() async {
    setState(() => _loading = true);
    final ok = await ref.read(apiProvider).verifyOtp(_phoneCtl.text, _otpCtl.text);
    setState(() => _loading = false);
    if (ok && mounted) {
      context.go('/home');
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invalid OTP')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const SizedBox(height: 40),
            Row(children: [
              const XGrowMark(size: 56, radius: 14),
              const SizedBox(width: 14),
              const XGrowWordmark(size: 28),
            ]),
            const SizedBox(height: 36),
            Text('Welcome back 👋', style: GoogleFonts.barlowCondensed(
              fontSize: 28, fontWeight: FontWeight.w800, color: XcadoColors.ink, height: 1.1,
            )),
            const SizedBox(height: 4),
            const Text('Sign in with your M-Pesa number to get started.',
              style: TextStyle(fontSize: 14, color: XcadoColors.slate)),
            const SizedBox(height: 32),
            const Text('Phone number', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: XcadoColors.slate)),
            const SizedBox(height: 6),
            TextField(
              controller: _phoneCtl,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(prefixIcon: Icon(Icons.phone_rounded, color: XcadoColors.field)),
            ),
            if (_otpSent) ...[
              const SizedBox(height: 18),
              const Text('OTP code', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: XcadoColors.slate)),
              const SizedBox(height: 6),
              TextField(
                controller: _otpCtl,
                keyboardType: TextInputType.number,
                maxLength: 4,
                decoration: const InputDecoration(prefixIcon: Icon(Icons.lock_rounded, color: XcadoColors.field), counterText: ''),
              ),
            ],
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loading ? null : (_otpSent ? _verify : _requestOtp),
                child: _loading
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : Text(_otpSent ? 'Verify & sign in' : 'Send OTP'),
              ),
            ),
            const Spacer(),
            Center(child: Text('USSD fallback: dial *483*1#',
              style: TextStyle(fontSize: 12, color: XcadoColors.slate))),
            const SizedBox(height: 12),
          ]),
        ),
      ),
    );
  }
}
