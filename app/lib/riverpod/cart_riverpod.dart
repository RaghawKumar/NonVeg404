import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_item.dart';
import '../models/food_item.dart';
import '../models/coupon.dart';
import '../repositories/coupon_repository.dart';
import 'repository_providers.dart';

class CartState {
  final List<CartItem> items;
  final Coupon? appliedCoupon;
  final bool isDelivery;
  final String deliveryAddress;
  final String? orderNotes;

  const CartState({
    this.items = const [],
    this.appliedCoupon,
    this.isDelivery = true,
    this.deliveryAddress = '404 Kernel Way, Suite 42, Silicon District',
    this.orderNotes,
  });

  int get itemCount => items.fold(0, (sum, i) => sum + i.quantity);

  double get subtotal => items.fold(0.0, (sum, i) => sum + i.totalPrice);

  double get taxAmount => subtotal * 0.0825; // 8.25% tax

  double get deliveryFee {
    if (!isDelivery) return 0.0;
    if (subtotal >= 45.0) return 0.0; // Free delivery above $45
    return 4.99;
  }

  double get discountAmount {
    if (appliedCoupon == null) return 0.0;
    if (subtotal < appliedCoupon!.minOrder) return 0.0;
    if (appliedCoupon!.discountType == 'percentage') {
      return subtotal * (appliedCoupon!.value / 100);
    }
    return appliedCoupon!.value;
  }

  double get total {
    final computed = subtotal + taxAmount + deliveryFee - discountAmount;
    return computed < 0 ? 0 : computed;
  }

  CartState copyWith({
    List<CartItem>? items,
    Coupon? appliedCoupon,
    bool? isDelivery,
    String? deliveryAddress,
    String? orderNotes,
    bool clearCoupon = false,
  }) {
    return CartState(
      items: items ?? this.items,
      appliedCoupon: clearCoupon ? null : (appliedCoupon ?? this.appliedCoupon),
      isDelivery: isDelivery ?? this.isDelivery,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      orderNotes: orderNotes ?? this.orderNotes,
    );
  }
}

class CartNotifier extends StateNotifier<CartState> {
  final ICouponRepository _couponRepo;

  CartNotifier(this._couponRepo) : super(const CartState());

  void addToCart(
    FoodItem item, {
    int quantity = 1,
    List<FoodAddon> selectedAddOns = const [],
    String? specialNotes,
  }) {
    final existingIndex = state.items.indexWhere((ci) =>
        ci.foodItem.id == item.id &&
        _areAddonsEqual(ci.selectedAddOns, selectedAddOns) &&
        ci.specialNotes == specialNotes);

    if (existingIndex >= 0) {
      final updatedList = List<CartItem>.from(state.items);
      final current = updatedList[existingIndex];
      updatedList[existingIndex] = current.copyWith(
        quantity: current.quantity + quantity,
      );
      state = state.copyWith(items: updatedList);
    } else {
      final newItem = CartItem(
        cartItemId: 'item-${DateTime.now().millisecondsSinceEpoch}-${item.id}',
        foodItem: item,
        quantity: quantity,
        selectedAddOns: selectedAddOns,
        specialNotes: specialNotes,
      );
      state = state.copyWith(items: [...state.items, newItem]);
    }
  }

  void removeFromCart(int index) {
    final updatedList = List<CartItem>.from(state.items)..removeAt(index);
    state = state.copyWith(items: updatedList);
  }

  void updateQuantity(int index, int quantity) {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    final updatedList = List<CartItem>.from(state.items);
    updatedList[index] = updatedList[index].copyWith(quantity: quantity);
    state = state.copyWith(items: updatedList);
  }

  String? applyCoupon(Coupon coupon) {
    if (state.subtotal < coupon.minOrder) {
      return 'Requires minimum subtotal of ₹${coupon.minOrder.toStringAsFixed(2)}';
    }
    state = state.copyWith(appliedCoupon: coupon);
    return null;
  }

  Future<String?> validateAndApplyCouponOnline(String code) async {
    try {
      final res = await _couponRepo.validateCoupon(code, state.subtotal);
      if (res['valid'] == true) {
        final couponData = res['coupon'] as Map<String, dynamic>?;
        if (couponData != null) {
          final coupon = Coupon.fromJson(couponData);
          state = state.copyWith(appliedCoupon: coupon);
          return null;
        }
      }
      return res['message']?.toString() ?? 'Invalid coupon code';
    } catch (e) {
      return e.toString().replaceFirst('Exception: ', '');
    }
  }

  void removeCoupon() {
    state = state.copyWith(clearCoupon: true);
  }

  void setDelivery(bool isDelivery) {
    state = state.copyWith(isDelivery: isDelivery);
  }

  void setDeliveryAddress(String address) {
    state = state.copyWith(deliveryAddress: address);
  }

  void setOrderNotes(String? notes) {
    state = state.copyWith(orderNotes: notes);
  }

  void clearCart() {
    state = const CartState();
  }

  bool _areAddonsEqual(List<FoodAddon> a, List<FoodAddon> b) {
    if (a.length != b.length) return false;
    final aNames = a.map((x) => x.name).toSet();
    final bNames = b.map((x) => x.name).toSet();
    return aNames.containsAll(bNames);
  }
}

final cartNotifierProvider =
    StateNotifierProvider<CartNotifier, CartState>((ref) {
  final couponRepo = ref.watch(couponRepositoryProvider);
  return CartNotifier(couponRepo);
});
