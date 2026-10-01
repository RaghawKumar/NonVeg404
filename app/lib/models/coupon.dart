class Coupon {
  final String code;
  final String discountType; // 'percentage' or 'fixed'
  final double value;
  final double minOrder;
  final String description;
  final bool active;

  const Coupon({
    required this.code,
    required this.discountType,
    required this.value,
    required this.minOrder,
    required this.description,
    this.active = true,
  });

  factory Coupon.fromJson(Map<String, dynamic> json) {
    return Coupon(
      code: json['code']?.toString() ?? '',
      discountType:
          json['discountType']?.toString() ??
          json['discount_type']?.toString() ??
          'percentage',
      value: (json['value'] as num?)?.toDouble() ?? 0.0,
      minOrder:
          (json['minOrder'] as num?)?.toDouble() ??
          (json['min_order'] as num?)?.toDouble() ??
          0.0,
      description: json['description']?.toString() ?? '',
      active: json['active'] == true || json['active'] == 1,
    );
  }

  Map<String, dynamic> toJson() => {
    'code': code,
    'discountType': discountType,
    'value': value,
    'minOrder': minOrder,
    'description': description,
    'active': active,
  };

  double calculateDiscount(double subtotal) {
    if (subtotal < minOrder) return 0.0;
    if (discountType == 'percentage') {
      return (subtotal * value) / 100.0;
    } else {
      return value > subtotal ? subtotal : value;
    }
  }
}
