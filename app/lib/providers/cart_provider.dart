import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../models/food_item.dart';
import '../models/coupon.dart';
import '../repositories/coupon_repository.dart';

class CartProvider with ChangeNotifier {
  final ICouponRepository _couponRepo;

  final List<CartItem> _items = [];
  Coupon? _appliedCoupon;
  bool _isDelivery = true;

  CartProvider({ICouponRepository? couponRepo})
      : _couponRepo = couponRepo ?? CouponRepository();

  // Defaults matching backend restaurant settings
  final double _baseDeliveryFee = 4.99;
  final double _freeDeliveryThreshold = 45.0;
  final double _taxRate = 0.05;

  List<CartItem> get items => List.unmodifiable(_items);
  Coupon? get appliedCoupon => _appliedCoupon;
  bool get isDelivery => _isDelivery;

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal => _items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double get discountAmount {
    if (_appliedCoupon == null) return 0.0;
    return _appliedCoupon!.calculateDiscount(subtotal);
  }

  double get deliveryFee {
    if (!_isDelivery) return 0.0;
    if (_appliedCoupon?.code == 'FREE_DEPLOY') return 0.0;
    if (subtotal >= _freeDeliveryThreshold) return 0.0;
    return _items.isEmpty ? 0.0 : _baseDeliveryFee;
  }

  double get taxAmount => (subtotal - discountAmount) > 0 
      ? (subtotal - discountAmount) * _taxRate 
      : 0.0;

  double get total {
    double net = subtotal - discountAmount + deliveryFee + taxAmount;
    return net > 0 ? net : 0.0;
  }

  void toggleDelivery(bool isDelivery) {
    _isDelivery = isDelivery;
    notifyListeners();
  }

  void addToCart(
    FoodItem item, {
    int quantity = 1,
    List<FoodAddon> selectedAddOns = const [],
    String? notes,
  }) {
    final addonIds = selectedAddOns.map((a) => a.id).toList()..sort();
    final uniqueCartId = '${item.id}_${addonIds.join("-")}';

    final existingIndex = _items.indexWhere((ci) => ci.cartItemId == uniqueCartId);

    if (existingIndex >= 0) {
      _items[existingIndex].quantity += quantity;
    } else {
      _items.add(
        CartItem(
          cartItemId: uniqueCartId,
          foodItem: item,
          quantity: quantity,
          selectedAddOns: selectedAddOns,
          specialNotes: notes,
        ),
      );
    }
    notifyListeners();
  }

  void incrementQuantity(String cartItemId) {
    final index = _items.indexWhere((ci) => ci.cartItemId == cartItemId);
    if (index >= 0) {
      _items[index].quantity++;
      notifyListeners();
    }
  }

  void decrementQuantity(String cartItemId) {
    final index = _items.indexWhere((ci) => ci.cartItemId == cartItemId);
    if (index >= 0) {
      if (_items[index].quantity > 1) {
        _items[index].quantity--;
      } else {
        _items.removeAt(index);
      }
      notifyListeners();
    }
  }

  void removeItem(String cartItemId) {
    _items.removeWhere((ci) => ci.cartItemId == cartItemId);
    notifyListeners();
  }

  String? applyCoupon(Coupon coupon) {
    if (subtotal < coupon.minOrder) {
      return 'Min order for ${coupon.code} is ₹${coupon.minOrder.toStringAsFixed(0)}';
    }
    _appliedCoupon = coupon;
    notifyListeners();
    return null; // success
  }

  Future<String?> validateAndApplyCouponOnline(String code) async {
    try {
      final res = await _couponRepo.validateCoupon(code, subtotal);
      final couponData = res['coupon'];
      if (couponData is Map<String, dynamic>) {
        _appliedCoupon = Coupon.fromJson(couponData);
        notifyListeners();
        return null;
      }
    } catch (e) {
      return e.toString().replaceAll('Exception: ', '');
    }
    return 'Invalid coupon code';
  }

  void removeCoupon() {
    _appliedCoupon = null;
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _appliedCoupon = null;
    notifyListeners();
  }
}
