# Grow by XCADO — Mobile App

Native Flutter app for the farmer-side Grow platform. Mirrors the modules in
the web app (`grow-by-xcado-fresh/`) with a phone-first UI: 4-tab bottom nav,
QR-scan FAB, OTP login, offline-first data layer.

Companion to the React web dashboard — same brand, same data model, same API.

---

## Stack

- **Flutter 3.22+** (Dart 3.4+)
- **State:** Riverpod 2.5
- **Routing:** go_router 14
- **HTTP:** Dio 5
- **Local cache:** Hive + shared_preferences
- **Camera/QR:** mobile_scanner
- **Maps:** flutter_map (OpenStreetMap, no API key required)
- **Charts:** fl_chart
- **Push:** firebase_messaging
- **Fonts:** Outfit (body) + Barlow Condensed (display) via google_fonts

The whole app runs end-to-end on **mock data** until the backend is live —
flip `kUseMockApi` to `false` in `lib/api/api_client.dart` once the REST API
at `https://grow.xcado.africa/api` is ready.

---

## What's implemented

| Screen | File | Notes |
|---|---|---|
| Login (phone + OTP) | `lib/screens/login_screen.dart` | Mock OTP `0000` accepts any phone |
| Home shell + bottom nav | `lib/screens/home_shell.dart` | 4 tabs + scan FAB |
| Dashboard | `lib/screens/dashboard_screen.dart` | KPIs, recent activity feed |
| Marketplace | `lib/screens/marketplace_screen.dart` | Filter chips, listing cards |
| Listing detail | `lib/screens/listing_detail_screen.dart` | Full produce profile + Place Order |
| Weather | `lib/screens/weather_screen.dart` | Hero + 7-day forecast list |
| Profile | `lib/screens/profile_screen.dart` | Farmer KYC, M-Pesa, settings |
| Trace QR scan | `lib/screens/trace_scan_screen.dart` | Live camera + verified result view |

Theme + brand widgets live in `lib/theme.dart` and `lib/widgets/`.

---

## Run locally

```bash
cd grow-mobile
flutter pub get
flutter run                 # on the first attached device/emulator
flutter run -d chrome       # web preview
```

If `flutter` isn't installed: https://docs.flutter.dev/get-started/install

---

## Build for release

### Android
```bash
flutter build apk --release            # APK for sideload / pilot users
flutter build appbundle --release      # AAB for Play Store upload
```
Output: `build/app/outputs/flutter-apk/app-release.apk` and
`build/app/outputs/bundle/release/app-release.aab`.

You'll need to set up signing — generate `android/app/upload-keystore.jks`
then create `android/key.properties` (already in `.gitignore`).

### iOS
```bash
flutter build ios --release            # requires macOS + Xcode
flutter build ipa                      # archive for TestFlight / App Store
```

---

## Connecting to the real backend

1. Stand up the PHP API at `https://grow.xcado.africa/api` (the routes
   already exist in `../src/old/xgrow_route_*.php`).
2. In `lib/api/api_client.dart`:
   ```dart
   const bool kUseMockApi = false;
   ```
3. Re-build. The same screens swap from mock to real with no other changes.

---

## Push notifications setup

Once Firebase is provisioned:

1. Drop `google-services.json` into `android/app/`.
2. Drop `GoogleService-Info.plist` into `ios/Runner/`.
3. Add `apply plugin: 'com.google.gms.google-services'` to
   `android/app/build.gradle`.
4. Both files are already in `.gitignore` — never commit them.

---

## Hand-off notes for a Flutter engineer

What's there:
- Full theme, navigation, 8 screens with real interaction
- Riverpod providers + Dio client wired with mock fallback
- Android manifest with permissions + deep link for `/trace/*` URLs
- iOS Info.plist with usage descriptions for camera + location

What's *not* yet there (intentionally — needs decisions):
- `flutter create .` to fill in `android/build.gradle`,
  `android/gradle.properties`, `ios/Podfile`, launcher icons, splash
  screen — run this once in this directory; it won't overwrite our files
- Firebase project creation + config files
- Code signing keystores / provisioning profiles
- Crashlytics / Sentry SDK init
- Background sync / WorkManager for offline data uploads
- Localisation (currently English-only — package `flutter_localizations`
  + ARB files needed for Swahili, Kalenjin, Luo, Kikuyu, Kamba)

---

## Related

- Web app: `../` (Vite + React, same repo)
- API routes (PHP, legacy): `../src/old/xgrow_route_*.php`
- DB schema: `../src/old/xgrow_schema (1).sql`
- Brand pack: `D:\OneDrive\Documents\Claude\Projects\xcado\XCADO Logo Variations.pdf`
