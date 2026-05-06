// ── Mock data — same shape as web app's mockData.js, kept inline so the
// app builds + runs without any backend until the real API is ready.

class Listing {
  final String id, crop, county, farmer, grade, intent, status, img;
  final int price, qty;
  final List<String> certified;
  Listing({
    required this.id, required this.crop, required this.county, required this.farmer,
    required this.grade, required this.intent, required this.status, required this.img,
    required this.price, required this.qty, required this.certified,
  });
  factory Listing.fromJson(Map<String, dynamic> j) => Listing(
    id: j['id'], crop: j['crop'], county: j['county'], farmer: j['farmer'],
    grade: j['grade'], intent: j['intent'], status: j['status'], img: j['img'] ?? '🌾',
    price: j['price'], qty: j['qty'],
    certified: (j['certified'] as List).map((e) => e.toString()).toList(),
  );
}

class WeatherDay {
  final String day, condition, icon;
  final int high, low, rain;
  WeatherDay({required this.day, required this.condition, required this.icon,
              required this.high, required this.low, required this.rain});
  factory WeatherDay.fromJson(Map<String, dynamic> j) => WeatherDay(
    day: j['day'], condition: j['condition'], icon: j['icon'],
    high: j['high'], low: j['low'], rain: j['rain'],
  );
}

class DashboardSummary {
  final int activeListings, pendingOrders, mpesaThisMonth, weatherAlerts;
  final List<Map<String, dynamic>> recentActivity;
  DashboardSummary({required this.activeListings, required this.pendingOrders,
                    required this.mpesaThisMonth, required this.weatherAlerts,
                    required this.recentActivity});
  factory DashboardSummary.fromJson(Map<String, dynamic> j) => DashboardSummary(
    activeListings: j['activeListings'], pendingOrders: j['pendingOrders'],
    mpesaThisMonth: j['mpesaThisMonth'], weatherAlerts: j['weatherAlerts'],
    recentActivity: List<Map<String, dynamic>>.from(j['recentActivity']),
  );
}

class FarmerProfile {
  final String id, name, phone, county, subCounty, mpesaNo, primaryCrop, kyc, gender, coop;
  final double acres;
  final int credit;
  FarmerProfile({required this.id, required this.name, required this.phone,
                 required this.county, required this.subCounty, required this.mpesaNo,
                 required this.primaryCrop, required this.kyc, required this.gender,
                 required this.coop, required this.acres, required this.credit});
  factory FarmerProfile.fromJson(Map<String, dynamic> j) => FarmerProfile(
    id: j['id'], name: j['name'], phone: j['phone'], county: j['county'],
    subCounty: j['subCounty'], mpesaNo: j['mpesaNo'], primaryCrop: j['primaryCrop'],
    kyc: j['kyc'], gender: j['gender'], coop: j['coop'],
    acres: (j['acres'] as num).toDouble(), credit: j['credit'],
  );
}

class TraceRecord {
  final String qrId, productName, buyer, grade, exportDate;
  final double quantityKg;
  final List<String> certifications;
  final List<Map<String, String>> events;
  TraceRecord({required this.qrId, required this.productName, required this.buyer,
               required this.grade, required this.exportDate, required this.quantityKg,
               required this.certifications, required this.events});
  factory TraceRecord.fromJson(Map<String, dynamic> j) => TraceRecord(
    qrId: j['qrId'], productName: j['productName'], buyer: j['buyer'],
    grade: j['grade'], exportDate: j['exportDate'],
    quantityKg: (j['quantityKg'] as num).toDouble(),
    certifications: (j['certifications'] as List).map((e) => e.toString()).toList(),
    events: List<Map<String, String>>.from(j['events'].map((e) => Map<String, String>.from(e))),
  );
}

class MockData {
  static final _listings = [
    Listing(id:'L001', img:'☕', crop:'Coffee AA',    grade:'AA', intent:'export', status:'Active',
            farmer:'James Mwangi',   county:'Meru',     price:420, qty:4800,  certified:['GlobalG.A.P','Fairtrade']),
    Listing(id:'L002', img:'🥑', crop:'Avocado',      grade:'A',  intent:'export', status:'Active',
            farmer:'Grace Wanjiku',  county:'Kiambu',   price:75,  qty:12000, certified:['GlobalG.A.P','KEPHIS']),
    Listing(id:'L003', img:'🫘', crop:'Green Grams',  grade:'A',  intent:'local',  status:'Active',
            farmer:'Peter Mutua',    county:'Makueni',  price:200, qty:3200,  certified:[]),
    Listing(id:'L006', img:'🌿', crop:'French Beans', grade:'AA', intent:'export', status:'Active',
            farmer:'David Kariuki',  county:'Nyeri',    price:130, qty:6500,  certified:['GlobalG.A.P','Fairtrade','KEPHIS']),
    Listing(id:'L007', img:'🥬', crop:'Kale',         grade:'A',  intent:'local',  status:'Active',
            farmer:'Mary Akinyi',    county:'Kisumu',   price:40,  qty:1800,  certified:[]),
    Listing(id:'L008', img:'🌽', crop:'Maize',        grade:'B',  intent:'local',  status:'Active',
            farmer:'Joseph Kamau',   county:'Nakuru',   price:45,  qty:15000, certified:[]),
  ];

  static List<Listing> listings({String? intent, String? grade}) {
    return _listings.where((l) =>
      (intent == null || intent == 'all' || l.intent == intent) &&
      (grade  == null || grade  == 'all' || l.grade  == grade)
    ).toList();
  }
  static Listing? listing(String id) => _listings.where((l) => l.id == id).firstOrNull;

  static List<WeatherDay> weather(String county) => [
    WeatherDay(day:'Mon', condition:'Partly Cloudy', icon:'⛅', high:23, low:14, rain:35),
    WeatherDay(day:'Tue', condition:'Sunny',         icon:'☀️', high:24, low:15, rain:20),
    WeatherDay(day:'Wed', condition:'Rain',          icon:'🌧️', high:22, low:14, rain:60),
    WeatherDay(day:'Thu', condition:'Heavy Rain',    icon:'⛈️', high:21, low:13, rain:75),
    WeatherDay(day:'Fri', condition:'Cloudy',        icon:'☁️', high:23, low:14, rain:40),
    WeatherDay(day:'Sat', condition:'Sunny',         icon:'☀️', high:25, low:15, rain:15),
    WeatherDay(day:'Sun', condition:'Sunny',         icon:'☀️', high:26, low:16, rain:10),
  ];

  static DashboardSummary dashboard() => DashboardSummary(
    activeListings: 3, pendingOrders: 2, mpesaThisMonth: 24000, weatherAlerts: 1,
    recentActivity: [
      {'icon':'💳', 'title':'M-Pesa received', 'detail':'KES 24,000 — Green Grams sale', 'time':'5h ago'},
      {'icon':'🛒', 'title':'New order',        'detail':'1,200kg Avocado from Hamburg Traders', 'time':'1d ago'},
      {'icon':'⚠️', 'title':'Cert renewal due', 'detail':'KEPHIS expiring in 30 days',           'time':'2d ago'},
    ],
  );

  static FarmerProfile me() => FarmerProfile(
    id:'F001', name:'Grace Wanjiku', phone:'+254 711 002 341',
    county:'Kiambu', subCounty:'Limuru', mpesaNo:'+254 711 002 341',
    primaryCrop:'Avocado', kyc:'Verified', gender:'Female', coop:'Tigoni Growers Ltd',
    acres:3.5, credit:78,
  );

  static TraceRecord? trace(String qrId) {
    if (qrId.isEmpty) return null;
    return TraceRecord(
      qrId: qrId, productName:'Cold-Pressed Avocado Oil', buyer:'Meridian Foods UK',
      grade:'A+', exportDate:'2026-04-24', quantityKg:1200,
      certifications:['Organic EU','GlobalG.A.P.','KEPHIS'],
      events: [
        {'stage':'Farm Harvest',     'location':"Murang'a",     'date':'2026-04-08'},
        {'stage':'KEPHIS Inspection','location':'Murang\'a Pack','date':'2026-04-12'},
        {'stage':'Packhouse',        'location':'Mombasa CDC',  'date':'2026-04-15'},
        {'stage':'Xcado QC Seal',    'location':'Mombasa Port', 'date':'2026-04-18'},
        {'stage':'Vessel Loading',   'location':'Mombasa',      'date':'2026-04-24'},
      ],
    );
  }
}
