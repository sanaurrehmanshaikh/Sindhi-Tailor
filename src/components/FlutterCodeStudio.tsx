import React, { useState } from 'react';
import { 
  FolderTree, 
  FileCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Database, 
  Smartphone, 
  Share2, 
  Download,
  Terminal,
  Code
} from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  category: 'models' | 'database' | 'providers' | 'screens' | 'services' | 'config';
  fileName: string;
  language: string;
  code: string;
  description: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'folder_structure',
    title: 'فولڊر اسٽرڪچر (Clean Architecture)',
    category: 'config',
    fileName: 'lib/ directory layout',
    language: 'markdown',
    description: 'فلٽر ايپليڪيشن جو پيشه ورانه فولڊر ڍانچو (Clean Architecture + Feature-First)',
    code: `sindhi_tailor_app/
├── android/
├── ios/
├── assets/
│   ├── fonts/
│   │   └── NotoNaskhArabic-Regular.ttf
│   └── images/
│       └── ajrak_pattern.png
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   │   ├── sindhi_strings.dart       # مڪمل سنڌي ٻوليءَ جا الفاظ ۽ جملا
│   │   │   └── app_colors.dart           # روايتي سنڌي رنگ (Ajrak Maroon, Amber, Emerald)
│   │   ├── utils/
│   │   │   ├── sindhi_numeral_utils.dart # انگن کي سنڌي رسم الخط ۾ بدلائڻ
│   │   │   └── date_formatter.dart
│   │   └── theme/
│   │       └── app_theme.dart            # RTL سپورٽ ۽ فونٽ فيملي سيٽنگس
│   ├── data/
│   │   ├── local/
│   │   │   ├── app_database.dart         # Drift (SQLite) لوڪل ڪيشنگ ٽيبلز
│   │   │   └── app_database.g.dart
│   │   ├── remote/
│   │   │   └── firestore_service.dart    # Cloud Firestore سروس
│   │   └── repositories/
│   │       ├── sync_repository.dart      # آف لائن فرسٽ باءِ-ڊائريڪشنل سنڪ مينيجر
│   │       ├── customer_repository.dart
│   │       └── order_repository.dart
│   ├── domain/
│   │   ├── models/
│   │   │   ├── shop_settings.dart        # دڪان ۽ سيٽنگس ماڊل
│   │   │   ├── customer_model.dart       # گراهڪ ماڊل
│   │   │   ├── measurement_profile.dart  # ماپ جو پروفائل ماڊل
│   │   │   ├── order_model.dart          # آرڊر ۽ رسيد ماڊل
│   │   │   └── order_status.dart         # 7 اسٽيٽس ٽائيپس
│   ├── presentation/
│   │   ├── providers/
│   │   │   ├── orders_provider.dart      # Riverpod StateNotifier
│   │   │   ├── customers_provider.dart
│   │   │   └── dashboard_metrics_provider.dart
│   │   ├── screens/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard_screen.dart # مکيه ڊيش بورڊ ۽ سمري ڪارڊس
│   │   │   │   └── widgets/
│   │   │   │       ├── summary_card.dart
│   │   │   │       └── order_tile.dart
│   │   │   ├── new_order/
│   │   │   │   └── new_order_screen.dart # نئون آرڊر، ماپ ۽ اڳواٽ رقم فارم
│   │   │   ├── customers/
│   │   │   │   └── customers_screen.dart
│   │   │   └── receipt/
│   │   │       └── receipt_screen.dart   # پرنٽ ۽ واٽس ايپ شيئرنگ
│   │   └── services/
│   │       └── whatsapp_receipt_service.dart # واٽس ايپ سڌو انوائيس لنڪر
│   └── main.dart                         # ايپ داخلا پوائنٽ RTL ڪنفيگ سان
└── pubspec.yaml`
  },
  {
    id: 'pubspec',
    title: 'Dependencies (pubspec.yaml)',
    category: 'config',
    fileName: 'pubspec.yaml',
    language: 'yaml',
    description: 'Riverpod, Drift (SQLite), Firebase Firestore ۽ WhatsApp url_launcher پيڪيجز',
    code: `name: sindhi_tailor_app
description: سنڌي درزي مينيجمينٽ ايپ - Offline-First Tailor Shop App in Sindhi
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.5

  # Offline Database (Drift / SQLite)
  drift: ^2.16.0
  sqlite3_flutter_libs: ^0.5.20
  path_provider: ^2.1.2
  path: ^1.9.0

  # Firebase Cloud Database
  firebase_core: ^2.27.0
  cloud_firestore: ^4.15.8
  connectivity_plus: ^5.0.2

  # WhatsApp Sharing & Utilities
  url_launcher: ^6.2.5
  intl: ^0.19.0
  uuid: ^4.3.3
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.8
  drift_dev: ^2.16.0
  riverpod_generator: ^2.4.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/`
  },
  {
    id: 'order_status_model',
    title: 'حيثيت اينم (order_status.dart)',
    category: 'models',
    fileName: 'lib/domain/models/order_status.dart',
    language: 'dart',
    description: '7 بنيادي اسٽيٽس: نئون، ماپ ورتل، سلائي جاري، تيار، پهچايو ويو، دير ٿيل، رد ٿيل',
    code: `/// سنڌي درزي آرڊر جي حيثيت (Order Status Types)
enum OrderStatus {
  newOrder,           // نئون آرڊر
  measurementsTaken,  // ماپ ورتل
  stitchingInProgress,// سلائي جاري آهي
  ready,              // تيار ڪپڙا (کڻڻ لاءِ)
  delivered,          // حوالي ٿيل (پهچايو ويو)
  delayed,            // دير ٿيل (ارجنٽ)
  cancelled;          // رد ٿيل

  String get sindhiLabel {
    switch (this) {
      case OrderStatus.newOrder:
        return 'نئون آرڊر';
      case OrderStatus.measurementsTaken:
        return 'ماپ ورتل';
      case OrderStatus.stitchingInProgress:
        return 'سلائي جاري آهي';
      case OrderStatus.ready:
        return 'تيار ڪپڙا';
      case OrderStatus.delivered:
        return 'حوالي ڪيو ويو';
      case OrderStatus.delayed:
        return 'دير ٿيل (ارجنٽ)';
      case OrderStatus.cancelled:
        return 'رد ٿيل';
    }
  }

  String toJson() => name;
  static OrderStatus fromJson(String value) => 
      OrderStatus.values.firstWhere((e) => e.name == value, orElse: () => OrderStatus.newOrder);
}`
  },
  {
    id: 'data_models',
    title: 'ڊيٽا ماڊلز (Customer, Measurements, Order, Shop)',
    category: 'models',
    fileName: 'lib/domain/models/tailor_models.dart',
    language: 'dart',
    description: 'ShopSettings, Customer, MeasurementProfile, TailorOrder Dart Classes',
    code: `import 'order_status.dart';

/// 1. دڪان ۽ سيٽنگس ماڊل
class ShopSettings {
  final String shopName;
  final String ownerName;
  final String phone;
  final String address;
  final String logoUrl;
  final String termsAndConditions;

  const ShopSettings({
    required this.shopName,
    required this.ownerName,
    required this.phone,
    required this.address,
    this.logoUrl = '',
    this.termsAndConditions = '30 ڏينهن اندر ڪپڙا وصول نه ڪرڻ تي دڪان ذميوار ناهي.',
  });

  Map<String, dynamic> toMap() => {
    'shopName': shopName,
    'ownerName': ownerName,
    'phone': phone,
    'address': address,
    'logoUrl': logoUrl,
    'termsAndConditions': termsAndConditions,
  };

  factory ShopSettings.fromMap(Map<String, dynamic> map) => ShopSettings(
    shopName: map['shopName'] ?? '',
    ownerName: map['ownerName'] ?? '',
    phone: map['phone'] ?? '',
    address: map['address'] ?? '',
    logoUrl: map['logoUrl'] ?? '',
    termsAndConditions: map['termsAndConditions'] ?? '',
  );
}

/// 2. گراهڪ ماڊل (Customer Model)
class Customer {
  final String id;
  final String name;
  final String mobileNumber;
  final String whatsappNumber;
  final String address;
  final String notes;
  final DateTime createdAt;

  const Customer({
    required this.id,
    required this.name,
    required this.mobileNumber,
    required this.whatsappNumber,
    this.address = '',
    this.notes = '',
    required this.createdAt,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'mobileNumber': mobileNumber,
    'whatsappNumber': whatsappNumber,
    'address': address,
    'notes': notes,
    'createdAt': createdAt.toIso8601String(),
  };

  factory Customer.fromMap(Map<String, dynamic> map) => Customer(
    id: map['id'] ?? '',
    name: map['name'] ?? '',
    mobileNumber: map['mobileNumber'] ?? '',
    whatsappNumber: map['whatsappNumber'] ?? '',
    address: map['address'] ?? '',
    notes: map['notes'] ?? '',
    createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
  );
}

/// 3. ماپ جا پروفائل (Measurement Profiles Model - Attached to Customer)
class MeasurementProfile {
  final String id;
  final String customerId;
  final String title; // "ريگولر فٽ", "عيد اسپيشل", "واسڪٽ"
  
  // سڀ ماپ انچن ۾
  final double qameezLength;   // قميص ڊگھائي
  final double shoulder;       // تيرا / ڪلهو
  final double chest;          // ڇاتي
  final double waist;          // ڪمر / پيٽ
  final double sleeve;         // ٻانهن / آستين
  final double cuff;           // ڪف / مڱو
  final double neck;           // گلو / ڪالر
  final double shalwarLength;  // شلوار ڊگھائي
  final double paincha;        // پانچو
  final double shalwarGhera;   // شلوار جو گهيرو
  
  final String collarType;     // سادي بين، شرٽ ڪالر
  final String pocketType;     // هڪ کيسي، ڳجهي کيسي
  final String customNotes;    // خاص هدايتون

  const MeasurementProfile({
    required this.id,
    required this.customerId,
    required this.title,
    required this.qameezLength,
    required this.shoulder,
    required this.chest,
    required this.waist,
    required this.sleeve,
    required this.cuff,
    required this.neck,
    required this.shalwarLength,
    required this.paincha,
    required this.shalwarGhera,
    this.collarType = 'simple_ban',
    this.pocketType = 'one_front_side',
    this.customNotes = '',
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'customerId': customerId,
    'title': title,
    'qameezLength': qameezLength,
    'shoulder': shoulder,
    'chest': chest,
    'waist': waist,
    'sleeve': sleeve,
    'cuff': cuff,
    'neck': neck,
    'shalwarLength': shalwarLength,
    'paincha': paincha,
    'shalwarGhera': shalwarGhera,
    'collarType': collarType,
    'pocketType': pocketType,
    'customNotes': customNotes,
  };

  factory MeasurementProfile.fromMap(Map<String, dynamic> map) => MeasurementProfile(
    id: map['id'] ?? '',
    customerId: map['customerId'] ?? '',
    title: map['title'] ?? '',
    qameezLength: (map['qameezLength'] as num?)?.toDouble() ?? 0.0,
    shoulder: (map['shoulder'] as num?)?.toDouble() ?? 0.0,
    chest: (map['chest'] as num?)?.toDouble() ?? 0.0,
    waist: (map['waist'] as num?)?.toDouble() ?? 0.0,
    sleeve: (map['sleeve'] as num?)?.toDouble() ?? 0.0,
    cuff: (map['cuff'] as num?)?.toDouble() ?? 0.0,
    neck: (map['neck'] as num?)?.toDouble() ?? 0.0,
    shalwarLength: (map['shalwarLength'] as num?)?.toDouble() ?? 0.0,
    paincha: (map['paincha'] as num?)?.toDouble() ?? 0.0,
    shalwarGhera: (map['shalwarGhera'] as num?)?.toDouble() ?? 0.0,
    collarType: map['collarType'] ?? 'simple_ban',
    pocketType: map['pocketType'] ?? 'one_front_side',
    customNotes: map['customNotes'] ?? '',
  );
}

/// 4. آرڊر ۽ رسيد ماڊل (Orders/Receipts Model)
class TailorOrder {
  final String id;
  final String orderNo;         // SD-1082
  final String customerId;
  final String customerName;
  final String customerPhone;
  final String measurementId;
  final MeasurementProfile? measurementSnapshot;

  final DateTime orderDate;
  final DateTime deliveryDate;   // تاريخ پهچائڻ
  final String clothType;       // لٺو، کاڌي، واش اينڊ ويئر
  final String garmentType;     // شلوار قميص، واسڪٽ
  final int quantity;           // جوڙا
  
  final double totalAmount;      // ڪل رقم
  final double advanceAmount;    // اڳواٽ ڏنل رقم
  final double remainingBalance; // باقي رقم
  final OrderStatus status;      // 7 اسٽيٽس مان هڪ
  final bool isSynced;           // آف لائن يا فائر اسٽور سان سنڪ ٿيل

  const TailorOrder({
    required this.id,
    required this.orderNo,
    required this.customerId,
    required this.customerName,
    required this.customerPhone,
    required this.measurementId,
    this.measurementSnapshot,
    required this.orderDate,
    required this.deliveryDate,
    required this.clothType,
    required this.garmentType,
    this.quantity = 1,
    required this.totalAmount,
    required this.advanceAmount,
    required this.remainingBalance,
    required this.status,
    this.isSynced = false,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'orderNo': orderNo,
    'customerId': customerId,
    'customerName': customerName,
    'customerPhone': customerPhone,
    'measurementId': measurementId,
    'orderDate': orderDate.toIso8601String(),
    'deliveryDate': deliveryDate.toIso8601String(),
    'clothType': clothType,
    'garmentType': garmentType,
    'quantity': quantity,
    'totalAmount': totalAmount,
    'advanceAmount': advanceAmount,
    'remainingBalance': remainingBalance,
    'status': status.name,
    'isSynced': isSynced,
  };
}`
  },
  {
    id: 'drift_database',
    title: 'Drift Offline-First لوڪل ڪيشنگ ڊيٽابيس',
    category: 'database',
    fileName: 'lib/data/local/app_database.dart',
    language: 'dart',
    description: 'Drift (SQLite) ٽيبلز: انٽرنيٽ کانسواءِ دڪان جي تمام ڪم جي رفتار بحال رکڻ لاءِ',
    code: `import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'app_database.g.dart';

/// 1. گراهڪن جي مقامي ٽيبل
class CustomersTable extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get mobileNumber => text()();
  TextColumn get whatsappNumber => text()();
  TextColumn get address => text().nullable()();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

/// 2. ماپن جي مقامي ٽيبل
class MeasurementsTable extends Table {
  TextColumn get id => text()();
  TextColumn get customerId => text()();
  TextColumn get title => text()();
  RealColumn get qameezLength => real()();
  RealColumn get shoulder => real()();
  RealColumn get chest => real()();
  RealColumn get waist => real()();
  RealColumn get sleeve => real()();
  RealColumn get cuff => real()();
  RealColumn get neck => real()();
  RealColumn get shalwarLength => real()();
  RealColumn get paincha => real()();
  RealColumn get shalwarGhera => real()();
  TextColumn get collarType => text()();
  TextColumn get pocketType => text()();
  TextColumn get customNotes => text().nullable()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

/// 3. آرڊرن ۽ رسيدن جي مقامي ٽيبل
class OrdersTable extends Table {
  TextColumn get id => text()();
  TextColumn get orderNo => text()();
  TextColumn get customerId => text()();
  TextColumn get customerName => text()();
  TextColumn get customerPhone => text()();
  TextColumn get measurementId => text()();
  DateTimeColumn get orderDate => dateTime()();
  DateTimeColumn get deliveryDate => dateTime()();
  TextColumn get clothType => text()();
  TextColumn get garmentType => text()();
  IntColumn get quantity => integer().withDefault(const Constant(1))();
  RealColumn get totalAmount => real()();
  RealColumn get advanceAmount => real()();
  RealColumn get remainingBalance => real()();
  TextColumn get status => text()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [CustomersTable, MeasurementsTable, OrdersTable])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'sindhi_tailor.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}`
  },
  {
    id: 'sync_repository',
    title: 'Offline-First فائر اسٽور سنڪ انجن (sync_repository.dart)',
    category: 'database',
    fileName: 'lib/data/repositories/sync_repository.dart',
    language: 'dart',
    description: 'جڏهن نيٽ ڪٽجي وڃي ته لوڪل ڊرفٽ ۾ محفوظ ٿئي، نيٽ ايندي ئي پاڻمرادو سنڪ ٿئي',
    code: `import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../local/app_database.dart';
import '../../domain/models/tailor_models.dart';

class SyncRepository {
  final AppDatabase _db;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  SyncRepository(this._db) {
    // انٽرنيٽ جي حالتن جي مانيٽرنگ
    Connectivity().onConnectivityChanged.listen((status) {
      if (status != ConnectivityResult.none) {
        syncPendingDataToCloud();
      }
    });
  }

  /// نئون آرڊر Offline-First پهرين لوڪل Drift ۾، پوءِ Cloud تي محفوظ ٿئي
  Future<void> saveOrder(TailorOrder order) async {
    // 1. فوري مقامي SQLite ۾ لکو (Zero latency، بنا انٽرنيٽ)
    await _db.into(_db.ordersTable).insertOnConflictUpdate(
      OrdersTableCompanion.insert(
        id: order.id,
        orderNo: order.orderNo,
        customerId: order.customerId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        measurementId: order.measurementId,
        orderDate: order.orderDate,
        deliveryDate: order.deliveryDate,
        clothType: order.clothType,
        garmentType: order.garmentType,
        quantity: Value(order.quantity),
        totalAmount: order.totalAmount,
        advanceAmount: order.advanceAmount,
        remainingBalance: order.remainingBalance,
        status: order.status.name,
        isSynced: const Value(false),
      ),
    );

    // 2. جيڪڏهن نيٽ آهي ته فائر اسٽور تي پش ڪريو
    try {
      final conn = await Connectivity().checkConnectivity();
      if (conn != ConnectivityResult.none) {
        await _firestore.collection('orders').doc(order.id).set(order.toMap());
        // لوڪل اسٽيٽس کي synced ڪريو
        await (_db.update(_db.ordersTable)..where((tbl) => tbl.id.equals(order.id)))
            .write(const OrdersTableCompanion(isSynced: Value(true)));
      }
    } catch (e) {
      // Offline fallback: خاموشي سان بعد ۾ سنڪ ٿيندو
    }
  }

  /// بيڪ گرائونڊ ۾ اڻ-سنڪ ٿيل سمورو رڪارڊ فائر اسٽور ڏانهن موڪليو
  Future<void> syncPendingDataToCloud() async {
    final unsynced = await (_db.select(_db.ordersTable)..where((tbl) => tbl.isSynced.equals(false))).get();
    for (var row in unsynced) {
      try {
        await _firestore.collection('orders').doc(row.id).set({
          'id': row.id,
          'orderNo': row.orderNo,
          'customerId': row.customerId,
          'customerName': row.customerName,
          'customerPhone': row.customerPhone,
          'deliveryDate': row.deliveryDate.toIso8601String(),
          'totalAmount': row.totalAmount,
          'advanceAmount': row.advanceAmount,
          'remainingBalance': row.remainingBalance,
          'status': row.status,
        });
        await (_db.update(_db.ordersTable)..where((tbl) => tbl.id.equals(row.id)))
            .write(const OrdersTableCompanion(isSynced: Value(true)));
      } catch (_) {}
    }
  }
}`
  },
  {
    id: 'dashboard_provider',
    title: 'Riverpod State Providers (orders_provider.dart)',
    category: 'providers',
    fileName: 'lib/presentation/providers/orders_provider.dart',
    language: 'dart',
    description: 'ڊيش بورڊ جا 5 سمري ڪارڊس ۽ آرڊر لسٽ جو Riverpod StateNotifier',
    code: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/tailor_models.dart';
import '../../domain/models/order_status.dart';

/// ڊيش بورڊ جا 5 ڪارڊس ميٽرڪس اسٽيٽ
class DashboardMetrics {
  final int todayDeliveries;   // 1. اڄ جون ترسيلون
  final int readyOrders;       // 2. تيار ڪپڙا
  final int inShopOrders;      // 3. دڪان ۾ جاري آرڊر
  final int delayedOrders;     // 4. دير ٿيل آرڊر
  final double remainingBalance;// 5. ڪل باقي واجب الادا رقم

  DashboardMetrics({
    required this.todayDeliveries,
    required this.readyOrders,
    required this.inShopOrders,
    required this.delayedOrders,
    required this.remainingBalance,
  });
}

/// آرڊرن جو مکيه پرووائيڊر
final ordersListProvider = StateNotifierProvider<OrdersNotifier, List<TailorOrder>>((ref) {
  return OrdersNotifier();
});

class OrdersNotifier extends StateNotifier<List<TailorOrder>> {
  OrdersNotifier() : super([]);

  void addOrder(TailorOrder order) {
    state = [order, ...state];
  }

  void updateStatus(String orderId, OrderStatus newStatus) {
    state = state.map((o) => o.id == orderId ? o.copyWith(status: newStatus) : o).toList();
  }
}

/// پاڻمرادو ڳڻپ ڪندڙ ڊيش بورڊ پرووائيڊر
final dashboardMetricsProvider = Provider<DashboardMetrics>((ref) {
  final orders = ref.watch(ordersListProvider);
  final now = DateTime.now();
  final todayOnly = DateTime(now.year, now.month, now.day);

  int todayDeliveries = 0;
  int readyOrders = 0;
  int inShopOrders = 0;
  int delayedOrders = 0;
  double remainingBalance = 0.0;

  for (final o in orders) {
    if (o.status == OrderStatus.cancelled) continue;

    if (o.status != OrderStatus.delivered) {
      remainingBalance += o.remainingBalance;
    }

    final delDate = DateTime(o.deliveryDate.year, o.deliveryDate.month, o.deliveryDate.day);
    if (delDate == todayOnly && o.status != OrderStatus.delivered) {
      todayDeliveries++;
    }
    if (o.status == OrderStatus.ready) {
      readyOrders++;
    }
    if (o.status == OrderStatus.stitchingInProgress || o.status == OrderStatus.measurementsTaken) {
      inShopOrders++;
    }
    if (o.status == OrderStatus.delayed || (delDate.isBefore(todayOnly) && o.status != OrderStatus.delivered)) {
      delayedOrders++;
    }
  }

  return DashboardMetrics(
    todayDeliveries: todayDeliveries,
    readyOrders: readyOrders,
    inShopOrders: inShopOrders,
    delayedOrders: delayedOrders,
    remainingBalance: remainingBalance,
  );
});`
  },
  {
    id: 'dashboard_screen',
    title: 'Flutter Dashboard Screen (dashboard_screen.dart)',
    category: 'screens',
    fileName: 'lib/presentation/screens/dashboard/dashboard_screen.dart',
    language: 'dart',
    description: 'مڪمل سنڌي ٻولي، RTL، 5 خلاصا ڪارڊس، ڳولا بار ۽ واٽس ايپ شيئرنگ بٽڻ سان',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/orders_provider.dart';
import '../../services/whatsapp_receipt_service.dart';
import '../new_order/new_order_screen.dart';

class TailorDashboardScreen extends ConsumerStatefulWidget {
  const TailorDashboardScreen({super.key});

  @override
  ConsumerState<TailorDashboardScreen> createState() => _TailorDashboardScreenState();
}

class _TailorDashboardScreenState extends ConsumerState<TailorDashboardScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final metrics = ref.watch(dashboardMetricsProvider);
    final allOrders = ref.watch(ordersListProvider);

    // گراهڪ جي نالي، موبائل نمبر يا پرچي نمبر سان فلٽر
    final filteredOrders = allOrders.where((order) {
      final q = _searchQuery.trim().toLowerCase();
      if (q.isEmpty) return true;
      return order.orderNo.toLowerCase().contains(q) ||
          order.customerName.toLowerCase().contains(q) ||
          order.customerPhone.contains(q);
    }).toList();

    return Directionality(
      textDirection: TextDirection.rtl, // مڪمل سنڌي RTL انٽرفيس
      child: Scaffold(
        backgroundColor: const Color(0xFFFAF7F2), // اڇو مٽيريل
        appBar: AppBar(
          backgroundColor: const Color(0xFF7F1D1D), // اجرڪ ميرون رنگ
          elevation: 2,
          title: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'سنڌي درزي مينيجمينٽ',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
              ),
              Text(
                'سنڌ جينٽس ٽيلرز',
                style: TextStyle(fontSize: 12, color: Color(0xFFFDE68A)),
              ),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.sync, color: Colors.white),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('فائر اسٽور سان آف لائن ڊيٽا سنڪ ٿي رهي آهي...')),
                );
              },
            ),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 1. مٿيون خلاصو (5 Metrics Cards)
            const Text(
              'اڄ جو خلاصو (Dashboard Summary)',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildMetricCard('اڄ جون ترسيلون', '\${metrics.todayDeliveries}', Colors.blue, Icons.today)),
                const SizedBox(width: 8),
                Expanded(child: _buildMetricCard('تيار ڪپڙا', '\${metrics.readyOrders}', Colors.green, Icons.check_circle_outline)),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(child: _buildMetricCard('دڪان ۾ جاري', '\${metrics.inShopOrders}', Colors.orange, Icons.access_time)),
                const SizedBox(width: 8),
                Expanded(child: _buildMetricCard('دير ٿيل آرڊر', '\${metrics.delayedOrders}', Colors.red, Icons.warning_amber_rounded)),
              ],
            ),
            const SizedBox(height: 8),
            // ڪل باقي رقم وارو ڪارڊ
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF1C1917),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('ڪل باقي واجب الادا رقم:', style: TextStyle(color: Color(0xFFFCD34D), fontWeight: FontWeight.bold)),
                  Text(
                    '\${metrics.remainingBalance.toInt()} روپيا',
                    style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // 2. ڳولا بار (Search by Name, Phone, or Order No)
            TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'گراهڪ جو نالو، فون يا پرچي نمبر ڳوليو...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF7F1D1D)),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // 3. آرڊرن جي لسٽ
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('تازا آرڊر (\${filteredOrders.length})', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                TextButton(onPressed: () {}, child: const Text('سڀ ڏسو')),
              ],
            ),
            const SizedBox(height: 8),

            if (filteredOrders.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Text('ڪو به آرڊر نه مليو.', style: TextStyle(color: Colors.grey)),
                ),
              )
            else
              ...filteredOrders.map((order) => _buildOrderCard(order)),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          backgroundColor: const Color(0xFFD97706),
          icon: const Icon(Icons.add, color: Colors.white),
          label: const Text('نئون آرڊر', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const NewOrderScreen()));
          },
        ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String count, MaterialColor color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              Icon(icon, color: color.shade700, size: 18),
            ],
          ),
          const SizedBox(height: 6),
          Text(count, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color.shade900)),
        ],
      ),
    );
  }

  Widget _buildOrderCard(dynamic order) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text('\${order.customerName} (\${order.orderNo})', style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text('\${order.clothType} • باقي: \${order.remainingBalance.toInt()} روپيا'),
        trailing: IconButton(
          icon: const Icon(Icons.share, color: Colors.green),
          tooltip: 'واٽس ايپ تي سنڌي پرچي موڪليو',
          onPressed: () {
            WhatsAppReceiptService.sendInvoice(
              phone: order.customerPhone,
              orderNo: order.orderNo,
              customerName: order.customerName,
              clothType: order.clothType,
              deliveryDate: order.deliveryDate,
              total: order.totalAmount,
              advance: order.advanceAmount,
              remaining: order.remainingBalance,
            );
          },
        ),
      ),
    );
  }
}`
  },
  {
    id: 'new_order_screen',
    title: 'Flutter New Order Screen (new_order_screen.dart)',
    category: 'screens',
    fileName: 'lib/presentation/screens/new_order/new_order_screen.dart',
    language: 'dart',
    description: 'گراهڪ اندراج، 10 درزي ماپ فيلڊس (انچن ۾)، ايڊوانس ۽ خودڪار باقي رقم ڳڻپ',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import '../../domain/models/tailor_models.dart';
import '../../domain/models/order_status.dart';
import '../../providers/orders_provider.dart';
import '../../services/whatsapp_receipt_service.dart';

class NewOrderScreen extends ConsumerStatefulWidget {
  const NewOrderScreen({super.key});

  @override
  ConsumerState<NewOrderScreen> createState() => _NewOrderScreenState();
}

class _NewOrderScreenState extends ConsumerState<NewOrderScreen> {
  final _formKey = GlobalKey<FormState>();

  // Customer fields
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _clothController = TextEditingController(text: 'لٺو مصري ڪاٽن');

  // Measurements (in inches)
  final _lengthController = TextEditingController(text: '41.5');
  final _shoulderController = TextEditingController(text: '18.5');
  final _chestController = TextEditingController(text: '42.0');
  final _waistController = TextEditingController(text: '40.0');
  final _sleeveController = TextEditingController(text: '24.0');
  final _neckController = TextEditingController(text: '16.0');
  final _shalwarLengthController = TextEditingController(text: '39.0');
  final _painchaController = TextEditingController(text: '8.5');

  // Financials
  double _totalAmount = 2000.0;
  double _advanceAmount = 1000.0;
  DateTime _deliveryDate = DateTime.now().add(const Duration(days: 7));

  double get _remainingBalance => (_totalAmount - _advanceAmount).clamp(0, double.infinity);

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('نئون سلائي آرڊر درج ڪريو'),
          backgroundColor: const Color(0xFF7F1D1D),
          foregroundColor: Colors.white,
        ),
        body: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // 1. گراهڪ جا تفصيل
              const Text('1. گراهڪ جي سڃاڻپ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'گراهڪ جو نالو *', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'مهرباني ڪري نالو لکو' : null,
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'موبائل نمبر (واٽس ايپ) *', border: OutlineInputBorder()),
                validator: (v) => v!.isEmpty ? 'موبائل نمبر لازمي آهي' : null,
              ),

              const SizedBox(height: 20),

              // 2. درزي ماپ (Measurements)
              const Text('2. درزي ماپ جا تفصيل (انچن ۾)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: _buildMeasField('قميص ڊگھائي', _lengthController)),
                  const SizedBox(width: 8),
                  Expanded(child: _buildMeasField('تيرا / ڪلهو', _shoulderController)),
                  const SizedBox(width: 8),
                  Expanded(child: _buildMeasField('ڇاتي', _chestController)),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: _buildMeasField('ٻانهن', _sleeveController)),
                  const SizedBox(width: 8),
                  Expanded(child: _buildMeasField('ڪالر / گلو', _neckController)),
                  const SizedBox(width: 8),
                  Expanded(child: _buildMeasField('شلوار ڊگھائي', _shalwarLengthController)),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: _buildMeasField('پيٽ / ڪمر', _waistController)),
                  const SizedBox(width: 8),
                  Expanded(child: _buildMeasField('پانچو', _painchaController)),
                ],
              ),

              const SizedBox(height: 20),

              // 3. ترسيل جي تاريخ ۽ ڪپڙو
              const Text('3. ڪپڙو ۽ تاريخ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _clothController,
                decoration: const InputDecoration(labelText: 'ڪپڙي جو قسم', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 10),
              ListTile(
                tileColor: Colors.grey.shade100,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                title: Text('پهچائڻ جي تاريخ: \${DateFormat('yyyy-MM-dd').format(_deliveryDate)}'),
                trailing: const Icon(Icons.calendar_month, color: Color(0xFF7F1D1D)),
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _deliveryDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 90)),
                  );
                  if (picked != null) setState(() => _deliveryDate = picked);
                },
              ),

              const SizedBox(height: 20),

              // 4. مالي حساب ڪتاب (Financials)
              const Text('4. سلائي اجورو ۽ ايڊوانس', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      initialValue: '2000',
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'ڪل رقم (روپيا)', border: OutlineInputBorder()),
                      onChanged: (v) => setState(() => _totalAmount = double.tryParse(v) ?? 0),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      initialValue: '1000',
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'اڳواٽ ڏنل (ايڊوانس)', border: OutlineInputBorder()),
                      onChanged: (v) => setState(() => _advanceAmount = double.tryParse(v) ?? 0),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.amber.shade100, borderRadius: BorderRadius.circular(8)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('باقي رقم (Remaining Balance):', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('\${_remainingBalance.toInt()} روپيا', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.red)),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Save Button
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD97706),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: const Icon(Icons.check),
                label: const Text('آرڊر محفوظ ڪريو ۽ واٽس ايپ موڪليو', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                onPressed: _saveOrder,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMeasField(String label, TextEditingController controller) {
    return TextFormField(
      controller: controller,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
    );
  }

  void _saveOrder() {
    if (!_formKey.currentState!.validate()) return;

    final newOrder = TailorOrder(
      id: const Uuid().v4(),
      orderNo: 'SD-\${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
      customerId: 'cust-\${DateTime.now().millisecondsSinceEpoch}',
      customerName: _nameController.text.trim(),
      customerPhone: _phoneController.text.trim(),
      measurementId: 'meas-1',
      orderDate: DateTime.now(),
      deliveryDate: _deliveryDate,
      clothType: _clothController.text.trim(),
      garmentType: 'شلوار قميص',
      totalAmount: _totalAmount,
      advanceAmount: _advanceAmount,
      remainingBalance: _remainingBalance,
      status: OrderStatus.newOrder,
    );

    ref.read(ordersListProvider.notifier).addOrder(newOrder);

    // سڌو واٽس ايپ رسيد اوپن ڪريو
    WhatsAppReceiptService.sendInvoice(
      phone: newOrder.customerPhone,
      orderNo: newOrder.orderNo,
      customerName: newOrder.customerName,
      clothType: newOrder.clothType,
      deliveryDate: newOrder.deliveryDate,
      total: newOrder.totalAmount,
      advance: newOrder.advanceAmount,
      remaining: newOrder.remainingBalance,
    );

    Navigator.pop(context);
  }
}`
  },
  {
    id: 'whatsapp_service',
    title: 'واٽس ايپ انوائيس سروس (whatsapp_receipt_service.dart)',
    category: 'services',
    fileName: 'lib/presentation/services/whatsapp_receipt_service.dart',
    language: 'dart',
    description: 'url_launcher سان واٽس ايپ تي مڪمل سنڌي رسيد ٺاهڻ ۽ موڪلڻ جو ڪوڊ',
    code: `import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';

class WhatsAppReceiptService {
  /// گراهڪ جي موبائل تي سنڌي پرچي موڪليو
  static Future<void> sendInvoice({
    required String phone,
    required String orderNo,
    required String customerName,
    required String clothType,
    required DateTime deliveryDate,
    required double total,
    required double advance,
    required double remaining,
  }) async {
    // 03001234567 کي بين الاقوامي فارميٽ 923001234567 ۾ تبديل ڪريو
    String cleanPhone = phone.replaceAll(RegExp(r'[^0-9]'), '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92\${cleanPhone.substring(1)}';
    } else if (!cleanPhone.startsWith('92')) {
      cleanPhone = '92\$cleanPhone';
    }

    final formattedDate = DateFormat('yyyy-MM-dd').format(deliveryDate);

    // مڪمل سنڌي رسيد جو پيغام
    final message = '''
*بسم الله الرحمن الرحيم*
🧵 *سنڌ جينٽس ٽيلرز*
📍 مين بازار، سنڌ، پاڪستان
----------------------------------------
*درزي آرڊر رسيد (ڊيجيٽل پرچي)*
📋 *پرچي نمبر:* \$orderNo
👤 *محترم گراهڪ:* \$customerName
✂️ *ڪپڙو:* \$clothType
📅 *پهچائڻ جي تاريخ:* \$formattedDate

💰 *حساب ڪتاب:*
• ڪل سلائي رقم: \${total.toInt()} روپيا
• اڳواٽ ڏنل (ايڊوانس): \${advance.toInt()} روپيا
• *باقي رقم:* *\${remaining.toInt()} روپيا*
----------------------------------------
⚠️ ڪپڙا حاصل ڪرڻ وقت هي پيغام ڏيکاريو.
مهرباني! ~ استاد درزي
''';

    final uri = Uri.parse('https://wa.me/\$cleanPhone?text=\${Uri.encodeComponent(message)}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}`
  },
  {
    id: 'sindhi_strings',
    title: 'سنڌي لوڪلائيزيشن (sindhi_strings.dart)',
    category: 'config',
    fileName: 'lib/core/constants/sindhi_strings.dart',
    language: 'dart',
    description: 'ايپ جا سمورا سنڌي جملا، ماپن جا اصطلاح ۽ سنڌي اکر',
    code: `class SindhiStrings {
  static const appName = 'سنڌي درزي مينيجمينٽ ايپ';
  
  // ڊيش بورڊ ميٽرڪس
  static const todayDeliveries = 'اڄ جون ترسيلون';
  static const readyOrders = 'تيار ڪپڙا';
  static const inShopOrders = 'دڪان ۾ جاري آرڊر';
  static const delayedOrders = 'دير ٿيل آرڊر';
  static const remainingBalance = 'ڪل باقي واجب الادا رقم';
  
  // ماپن جا سنڌي اصطلاح (Inches)
  static const qameezLength = 'قميص ڊگھائي';
  static const shoulder = 'تيرا / ڪلهو';
  static const chest = 'ڇاتي';
  static const waist = 'پيٽ / ڪمر';
  static const sleeve = 'ٻانهن / آستين';
  static const cuff = 'ڪف / مڱو';
  static const neck = 'گلو / ڪالر';
  static const shalwarLength = 'شلوار ڊگھائي';
  static const paincha = 'پانچو';
  static const shalwarGhera = 'شلوار جو گهيرو';
  
  // ڪپڙي ۽ ڊزائن جا قسم
  static const simpleBan = 'سادي بين';
  static const shirtCollar = 'شرٽ ڪالر';
  static const chineseBan = 'چائنيز بين';
  static const roundDaman = 'گول دامن';
  static const straightDaman = 'سڌو دامن';
  
  // اسٽيٽس
  static const statusNew = 'نئون آرڊر';
  static const statusMeasured = 'ماپ ورتل';
  static const statusStitching = 'سلائي جاري آهي';
  static const statusReady = 'تيار ڪپڙا';
  static const statusDelivered = 'حوالي ڪيو ويو';
  static const statusDelayed = 'دير ٿيل';
  static const statusCancelled = 'رد ٿيل';
}`
  }
];

export const FlutterCodeStudio: React.FC = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>('dashboard_screen');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeSnippet = SNIPPETS.find((s) => s.id === selectedSnippetId) || SNIPPETS[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadAll = () => {
    const fullBundle = SNIPPETS.map(
      (s) => `// ==========================================\n// FILE: ${s.fileName}\n// TITLE: ${s.title}\n// DESCRIPTION: ${s.description}\n// ==========================================\n\n${s.code}\n\n`
    ).join('\n');

    const blob = new Blob([fullBundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sindhi_Tailor_Flutter_Architecture_Codebase.dart';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 font-sindhi" dir="rtl">
      
      {/* Hero Studio Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-cyan-950 to-stone-900 text-stone-100 rounded-2xl p-5 border border-cyan-700/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 font-latin">
              Flutter 3.x + Riverpod + Drift + Firebase
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            فلٽر موبائل ايپليڪيشن آرڪيٽيڪچر ۽ ڪوڊ اسٽوڊيو
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            مڪمل آف لائن-فرسٽ معماريت: سنڌ جي مقامي درزين لاءِ جتي بجلي ۽ انٽرنيٽ جي ڪٽوتي هجي اتي پهرين لوڪل SQLite (Drift) ۾ سڀ ڪجهه تيزيءَ سان رڪارڊ ٿيندو ۽ انٽرنيٽ ملڻ سان ئي فائر اسٽور تي خودڪار سنڪ ٿيندو.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs font-sindhi shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>سڀ فلٽر فائيلز ڊائون لوڊ ڪريو (.dart)</span>
        </button>
      </div>

      {/* Main Studio Workspace: Left File Selector, Right Code View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Navigation Sidebar: File List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-800">
              <FolderTree className="w-4 h-4 text-cyan-700" />
              <span>پراجيڪٽ فائيلز ({SNIPPETS.length})</span>
            </div>
            <span className="text-[10px] text-stone-400 font-latin">Dart / Flutter</span>
          </div>

          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {SNIPPETS.map((snippet) => {
              const isSelected = snippet.id === selectedSnippetId;
              return (
                <button
                  key={snippet.id}
                  onClick={() => setSelectedSnippetId(snippet.id)}
                  className={`w-full text-right p-3 rounded-xl transition-all border text-xs flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-950 font-bold shadow-sm'
                      : 'bg-stone-50/50 hover:bg-stone-100 border-stone-200/80 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-700' : 'text-stone-400'}`} />
                      <span>{snippet.title}</span>
                    </span>
                    <span className="text-[10px] font-latin px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-600">
                      {snippet.fileName.split('.').pop() || 'file'}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-latin truncate" dir="ltr">
                    {snippet.fileName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Preview & Actions */}
        <div className="lg:col-span-8 bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col">
          
          {/* Code Header Bar */}
          <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex items-center justify-between flex-wrap gap-2 text-stone-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="font-bold text-sm text-white font-sindhi">{activeSnippet.title}</h3>
              </div>
              <p className="text-xs text-stone-400 font-latin mt-0.5" dir="ltr">
                {activeSnippet.fileName}
              </p>
            </div>

            <button
              onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium border border-stone-700 transition active:scale-95"
            >
              {copiedId === activeSnippet.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold font-sindhi">ڪاپي ٿي ويو!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="font-sindhi">ڪوڊ ڪاپي ڪريو</span>
                </>
              )}
            </button>
          </div>

          {/* Description banner */}
          <div className="bg-stone-800/60 px-4 py-2 text-xs text-cyan-200/90 border-b border-stone-800 flex items-center gap-2 font-sindhi">
            <span className="font-bold">وضاحت:</span>
            <span>{activeSnippet.description}</span>
          </div>

          {/* Code Body */}
          <div className="p-4 bg-stone-950/90 overflow-x-auto max-h-[580px] overflow-y-auto" dir="ltr">
            <pre className="text-xs font-mono text-stone-200 leading-relaxed">
              <code>{activeSnippet.code}</code>
            </pre>
          </div>

          {/* Code Footer */}
          <div className="bg-stone-950 px-4 py-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400 font-latin">
            <span>Language: {activeSnippet.language}</span>
            <span>Sindhi Tailor Shop Mobile Architecture</span>
          </div>

        </div>

      </div>

    </div>
  );
};
