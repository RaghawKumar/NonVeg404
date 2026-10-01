import 'cart_item.dart';
import 'food_item.dart';

enum OrderStatus {
  initialized,
  accepted,
  preparing,
  ready,
  outForDelivery,
  delivered;

  String get label {
    switch (this) {
      case OrderStatus.initialized:
        return 'INITIALIZED';
      case OrderStatus.accepted:
        return 'ACCEPTED';
      case OrderStatus.preparing:
        return 'PREPARING';
      case OrderStatus.ready:
        return 'READY';
      case OrderStatus.outForDelivery:
        return 'OUT_FOR_DELIVERY';
      case OrderStatus.delivered:
        return 'DELIVERED';
    }
  }

  static OrderStatus fromString(String val) {
    switch (val.toUpperCase()) {
      case 'INITIALIZED':
        return OrderStatus.initialized;
      case 'ACCEPTED':
        return OrderStatus.accepted;
      case 'PREPARING':
        return OrderStatus.preparing;
      case 'READY':
        return OrderStatus.ready;
      case 'OUT_FOR_DELIVERY':
        return OrderStatus.outForDelivery;
      case 'DELIVERED':
        return OrderStatus.delivered;
      default:
        return OrderStatus.preparing;
    }
  }

  String get codeLog {
    switch (this) {
      case OrderStatus.initialized:
        return '> git init order-manifest.json\n> Connection handshake established.';
      case OrderStatus.accepted:
        return '> npm install dependencies\n> Kitchen order ticket validated. Chef dispatched.';
      case OrderStatus.preparing:
        return '> compiling flavors on grill\n> Tandoor temperature calibrated at 450°C. Dum pot sealed.';
      case OrderStatus.ready:
        return '> build successful (0 errors, 0 warnings)\n> Quality check passed. Sealed in thermal container.';
      case OrderStatus.outForDelivery:
        return '> deploying to customer coordinates\n> Courier unit #404 en route. Real-time telemetry active.';
      case OrderStatus.delivered:
        return '> 200 OK: Process finished with exit code 0\n> Order successfully resolved. Enjoy your meal!';
    }
  }
}

class StatusMessage {
  final OrderStatus status;
  final String label;
  final String timestamp;
  final String codeLog;

  const StatusMessage({
    required this.status,
    required this.label,
    required this.timestamp,
    required this.codeLog,
  });

  factory StatusMessage.fromJson(Map<String, dynamic> json) {
    final statusStr = json['status']?.toString() ?? 'INITIALIZED';
    return StatusMessage(
      status: OrderStatus.fromString(statusStr),
      label: json['label']?.toString() ?? statusStr,
      timestamp: json['timestamp']?.toString() ?? json['created_at']?.toString() ?? '',
      codeLog: json['codeLog']?.toString() ?? json['code_log']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'status': status.label,
    'label': label,
    'timestamp': timestamp,
    'codeLog': codeLog,
  };
}

class Order {
  final String id;
  final String customerName;
  final String phone;
  final String email;
  final String address;
  final String deliveryType; // 'delivery' or 'pickup'
  final String paymentMethod;
  final String paymentStatus;
  final String? orderNotes;
  final List<CartItem> items;
  final double subtotal;
  final double tax;
  final double deliveryFee;
  final double discount;
  final double total;
  OrderStatus status;
  final List<StatusMessage> statusMessages;
  final DateTime createdAt;
  final String estimatedDeliveryTime;

  Order({
    required this.id,
    required this.customerName,
    required this.phone,
    required this.email,
    required this.address,
    this.deliveryType = 'delivery',
    this.paymentMethod = 'UPI',
    this.paymentStatus = 'PAID',
    this.orderNotes,
    required this.items,
    required this.subtotal,
    required this.tax,
    required this.deliveryFee,
    required this.discount,
    required this.total,
    this.status = OrderStatus.preparing,
    required this.statusMessages,
    required this.createdAt,
    required this.estimatedDeliveryTime,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    final itemsRaw = json['items'] ?? [];
    List<CartItem> parsedItems = [];
    if (itemsRaw is List) {
      parsedItems = itemsRaw.map((it) {
        if (it is Map<String, dynamic>) {
          final foodItemJson = it['foodItem'] ?? it;
          final foodItem = FoodItem.fromJson(foodItemJson is Map<String, dynamic> ? foodItemJson : {});
          final addonsRaw = it['selectedAddOns'] ?? it['addOns'] ?? [];
          List<FoodAddon> parsedAddons = [];
          if (addonsRaw is List) {
            parsedAddons = addonsRaw
                .whereType<Map<String, dynamic>>()
                .map((a) => FoodAddon.fromJson(a))
                .toList();
          }
          return CartItem(
            cartItemId: it['id']?.toString() ?? it['cartItemId']?.toString() ?? foodItem.id,
            foodItem: foodItem,
            quantity: (it['quantity'] as num?)?.toInt() ?? 1,
            selectedAddOns: parsedAddons,
            specialNotes: it['specialNotes']?.toString(),
          );
        }
        return null;
      }).whereType<CartItem>().toList();
    }

    final historyRaw = json['statusHistory'] ?? json['statusMessages'] ?? json['timeline'] ?? [];
    List<StatusMessage> parsedMessages = [];
    if (historyRaw is List) {
      parsedMessages = historyRaw
          .whereType<Map<String, dynamic>>()
          .map((m) => StatusMessage.fromJson(m))
          .toList();
    }

    final statusStr = json['status']?.toString() ?? 'INITIALIZED';
    final parsedStatus = OrderStatus.fromString(statusStr);

    DateTime parsedDate;
    try {
      parsedDate = DateTime.parse(json['createdAt']?.toString() ?? json['created_at']?.toString() ?? '');
    } catch (_) {
      parsedDate = DateTime.now();
    }

    return Order(
      id: json['id']?.toString() ?? '',
      customerName: json['customerName']?.toString() ?? json['customer_name']?.toString() ?? 'Customer',
      phone: json['phone']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      deliveryType: json['deliveryType']?.toString() ?? json['delivery_type']?.toString() ?? 'delivery',
      paymentMethod: json['paymentMethod']?.toString() ?? json['payment_method']?.toString() ?? 'UPI',
      paymentStatus: json['paymentStatus']?.toString() ?? json['payment_status']?.toString() ?? 'PAID',
      orderNotes: json['orderNotes']?.toString() ?? json['order_notes']?.toString(),
      items: parsedItems,
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      tax: (json['tax'] as num?)?.toDouble() ?? 0.0,
      deliveryFee: (json['deliveryFee'] as num?)?.toDouble() ?? (json['delivery_fee'] as num?)?.toDouble() ?? 0.0,
      discount: (json['discount'] as num?)?.toDouble() ?? 0.0,
      total: (json['total'] as num?)?.toDouble() ?? 0.0,
      status: parsedStatus,
      statusMessages: parsedMessages,
      createdAt: parsedDate,
      estimatedDeliveryTime: json['estimatedDeliveryTime']?.toString() ?? json['estimated_delivery_time']?.toString() ?? '30-40 min',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'customerName': customerName,
    'phone': phone,
    'email': email,
    'address': address,
    'deliveryType': deliveryType,
    'paymentMethod': paymentMethod,
    'paymentStatus': paymentStatus,
    'orderNotes': orderNotes,
    'items': items.map((i) => i.toJson()).toList(),
    'subtotal': subtotal,
    'tax': tax,
    'deliveryFee': deliveryFee,
    'discount': discount,
    'total': total,
    'status': status.label,
    'statusMessages': statusMessages.map((m) => m.toJson()).toList(),
    'createdAt': createdAt.toIso8601String(),
    'estimatedDeliveryTime': estimatedDeliveryTime,
  };

  Order copyWith({
    String? id,
    String? customerName,
    String? phone,
    String? email,
    String? address,
    String? deliveryType,
    String? paymentMethod,
    String? paymentStatus,
    String? orderNotes,
    List<CartItem>? items,
    double? subtotal,
    double? tax,
    double? deliveryFee,
    double? discount,
    double? total,
    OrderStatus? status,
    List<StatusMessage>? statusMessages,
    DateTime? createdAt,
    String? estimatedDeliveryTime,
  }) {
    return Order(
      id: id ?? this.id,
      customerName: customerName ?? this.customerName,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      address: address ?? this.address,
      deliveryType: deliveryType ?? this.deliveryType,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      orderNotes: orderNotes ?? this.orderNotes,
      items: items ?? this.items,
      subtotal: subtotal ?? this.subtotal,
      tax: tax ?? this.tax,
      deliveryFee: deliveryFee ?? this.deliveryFee,
      discount: discount ?? this.discount,
      total: total ?? this.total,
      status: status ?? this.status,
      statusMessages: statusMessages ?? this.statusMessages,
      createdAt: createdAt ?? this.createdAt,
      estimatedDeliveryTime: estimatedDeliveryTime ?? this.estimatedDeliveryTime,
    );
  }
}
