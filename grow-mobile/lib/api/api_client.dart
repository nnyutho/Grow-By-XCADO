import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'mock_data.dart';

/// Toggle this when the backend is live. Until then, every endpoint
/// returns from `mock_data.dart` so the app runs end-to-end offline.
const bool kUseMockApi = true;
const String kApiBaseUrl = 'https://grow.xcado.africa/api';

final apiProvider = Provider<GrowApi>((ref) => GrowApi());

class GrowApi {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: kApiBaseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Accept': 'application/json'},
  ));

  Future<List<Listing>> listings({String? intent, String? grade}) async {
    if (kUseMockApi) return MockData.listings(intent: intent, grade: grade);
    final r = await _dio.get('/listings', queryParameters: {
      if (intent != null) 'intent': intent,
      if (grade != null)  'grade': grade,
    });
    return (r.data as List).map((j) => Listing.fromJson(j)).toList();
  }

  Future<Listing?> listing(String id) async {
    if (kUseMockApi) return MockData.listing(id);
    final r = await _dio.get('/listings/$id');
    return Listing.fromJson(r.data);
  }

  Future<List<WeatherDay>> weather(String county) async {
    if (kUseMockApi) return MockData.weather(county);
    final r = await _dio.get('/weather', queryParameters: {'county': county});
    return (r.data as List).map((j) => WeatherDay.fromJson(j)).toList();
  }

  Future<DashboardSummary> dashboard() async {
    if (kUseMockApi) return MockData.dashboard();
    final r = await _dio.get('/dashboard');
    return DashboardSummary.fromJson(r.data);
  }

  Future<FarmerProfile> me() async {
    if (kUseMockApi) return MockData.me();
    final r = await _dio.get('/me');
    return FarmerProfile.fromJson(r.data);
  }

  Future<TraceRecord?> trace(String qrId) async {
    if (kUseMockApi) return MockData.trace(qrId);
    final r = await _dio.get('/trace/$qrId');
    return r.data == null ? null : TraceRecord.fromJson(r.data);
  }

  Future<bool> requestOtp(String phone) async {
    if (kUseMockApi) return true;
    await _dio.post('/auth/request-otp', data: {'phone': phone});
    return true;
  }

  Future<bool> verifyOtp(String phone, String code) async {
    if (kUseMockApi) return code == '0000';
    final r = await _dio.post('/auth/verify-otp', data: {'phone': phone, 'code': code});
    return r.data['ok'] == true;
  }
}
