import 'food_item.dart';

class CartItem {
  final String cartItemId;
  final FoodItem foodItem;
  int quantity;
  final List<FoodAddon> selectedAddOns;
  final String? specialNotes;

  CartItem({
    required this.cartItemId,
    required this.foodItem,
    this.quantity = 1,
    this.selectedAddOns = const [],
    this.specialNotes,
  });

  double get unitPrice {
    double addonsTotal = selectedAddOns.fold(0.0, (sum, addon) => sum + addon.price);
    return foodItem.price + addonsTotal;
  }

  double get totalPrice => unitPrice * quantity;

  CartItem copyWith({
    int? quantity,
    List<FoodAddon>? selectedAddOns,
    String? specialNotes,
  }) {
    return CartItem(
      cartItemId: cartItemId,
      foodItem: foodItem,
      quantity: quantity ?? this.quantity,
      selectedAddOns: selectedAddOns ?? this.selectedAddOns,
      specialNotes: specialNotes ?? this.specialNotes,
    );
  }

  Map<String, dynamic> toJson() => {
        'cartItemId': cartItemId,
        'foodItem': foodItem.toJson(),
        'quantity': quantity,
        'selectedAddOns': selectedAddOns.map((a) => a.toJson()).toList(),
        'specialNotes': specialNotes,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) {
    final foodJson = json['foodItem'] ?? {};
    final addonsRaw = json['selectedAddOns'] ?? json['addOns'] ?? [];
    List<FoodAddon> addons = [];
    if (addonsRaw is List) {
      addons = addonsRaw
          .whereType<Map<String, dynamic>>()
          .map((a) => FoodAddon.fromJson(a))
          .toList();
    }
    return CartItem(
      cartItemId: json['cartItemId']?.toString() ?? '',
      foodItem: FoodItem.fromJson(Map<String, dynamic>.from(foodJson as Map)),
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      selectedAddOns: addons,
      specialNotes: json['specialNotes']?.toString(),
    );
  }
}
