import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/mock_data.dart';
import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/reservation.dart';
import '../repositories/order_repository.dart';
import 'repository_providers.dart';

class OrderState {
  final Order? activeOrder;
  final List<Order> orderHistory;
  final bool isLoading;
  final String? errorMessage;

  const OrderState({
    this.activeOrder,
    this.orderHistory = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  OrderState copyWith({
    Order? activeOrder,
    List<Order>? orderHistory,
    bool? isLoading,
    String? errorMessage,
  }) {
    return OrderState(
      activeOrder: activeOrder ?? this.activeOrder,
      orderHistory: orderHistory ?? this.orderHistory,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class OrderNotifier extends StateNotifier<OrderState> {
  final IOrderRepository _repository;

  OrderNotifier(this._repository)
      : super(OrderState(
          activeOrder: MockData.createSampleActiveOrder(),
          orderHistory: MockData.pastOrders,
        )) {
    refreshMyOrders();
  }

  Future<void> refreshMyOrders() async {
    try {
      final myOrders = await _repository.getMyOrders();
      if (myOrders.isNotEmpty) {
        state = state.copyWith(
          orderHistory: myOrders,
          activeOrder: state.activeOrder ?? myOrders.first,
        );
      }
    } catch (_) {}
  }

  Future<void> syncActiveOrder() async {
    if (state.activeOrder == null) return;
    try {
      final freshOrder = await _repository.getOrderById(state.activeOrder!.id);
      state = state.copyWith(activeOrder: freshOrder);
    } catch (_) {}
  }

  Future<Order> createOrder({
    required List<CartItem> items,
    required String deliveryAddress,
    required String customerName,
    required String phone,
    required String email,
    required String paymentMethod,
    required double subtotal,
    required double tax,
    required double deliveryFee,
    required double discount,
    required double total,
    required String deliveryType,
    String? couponCode,
    String? orderNotes,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final payload = {
      'customerName': customerName,
      'phone': phone,
      'email': email,
      'address': deliveryAddress,
      'deliveryType': deliveryType,
      'paymentMethod': paymentMethod,
      'paymentStatus': paymentMethod == 'COD' ? 'pending' : 'paid',
      'orderNotes': orderNotes,
      'subtotal': subtotal,
      'tax': tax,
      'deliveryFee': deliveryFee,
      'discount': discount,
      'total': total,
      'couponCode': couponCode,
      'items': items.map((ci) => {
            'foodItemId': ci.foodItem.id,
            'name': ci.foodItem.name,
            'price': ci.foodItem.price,
            'quantity': ci.quantity,
            'specialNotes': ci.specialNotes,
            'selectedAddOns': ci.selectedAddOns
                .map((a) => {'name': a.name, 'price': a.price})
                .toList(),
          }).toList(),
    };

    String generatedId = 'NV404-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';

    try {
      final res = await _repository.createOrder(payload);
      if (res['order'] != null && res['order']['id'] != null) {
        generatedId = res['order']['id'].toString();
      } else if (res['orderId'] != null) {
        generatedId = res['orderId'].toString();
      }
    } catch (_) {
      // Offline fallback: keep local generated ID
    }

    final newOrder = Order(
      id: generatedId,
      customerName: customerName,
      phone: phone,
      email: email,
      address: deliveryAddress,
      deliveryType: deliveryType,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod == 'COD' ? 'PENDING' : 'PAID',
      orderNotes: orderNotes,
      items: List.from(items),
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      discount: discount,
      total: total,
      status: OrderStatus.initialized,
      createdAt: DateTime.now(),
      estimatedDeliveryTime: '30-40 mins',
      statusMessages: [
        const StatusMessage(
          status: OrderStatus.initialized,
          label: '< ORDER INITIALIZED />',
          codeLog: '// Order payload compiled and encrypted. Pipeline queued.',
          timestamp: 'Just now',
        ),
      ],
    );

    final updatedHistory = [newOrder, ...state.orderHistory];
    state = state.copyWith(
      activeOrder: newOrder,
      orderHistory: updatedHistory,
      isLoading: false,
    );

    return newOrder;
  }

  void advanceActiveOrderStatus() {
    if (state.activeOrder == null) return;
    final current = state.activeOrder!;
    final OrderStatus nextStatus;
    final StatusMessage newLog;

    switch (current.status) {
      case OrderStatus.initialized:
        nextStatus = OrderStatus.accepted;
        newLog = const StatusMessage(
          status: OrderStatus.accepted,
          label: '< ORDER ACCEPTED />',
          codeLog: '// Kitchen received order. Assigning chef thread.',
          timestamp: 'Just now',
        );
        break;
      case OrderStatus.accepted:
        nextStatus = OrderStatus.preparing;
        newLog = const StatusMessage(
          status: OrderStatus.preparing,
          label: '< KITCHEN PREPARING BUILD />',
          codeLog: '// Active compilation: high-temperature tandoor threads running.',
          timestamp: 'Just now',
        );
        break;
      case OrderStatus.preparing:
        nextStatus = OrderStatus.ready;
        newLog = const StatusMessage(
          status: OrderStatus.ready,
          label: '< BUILD READY />',
          codeLog: '// Order packaged. Quality check: 200 OK. Awaiting dispatch.',
          timestamp: 'Just now',
        );
        break;
      case OrderStatus.ready:
        nextStatus = OrderStatus.outForDelivery;
        newLog = const StatusMessage(
          status: OrderStatus.outForDelivery,
          label: '< DEPLOYING TO ADDRESS />',
          codeLog: '// Rider process spawned. GPS location streaming. ETA: 20 mins.',
          timestamp: 'Just now',
        );
        break;
      case OrderStatus.outForDelivery:
        nextStatus = OrderStatus.delivered;
        newLog = const StatusMessage(
          status: OrderStatus.delivered,
          label: '< BUILD SUCCESSFUL />',
          codeLog: '// Delivery confirmed. Hunger status: 404 NOT FOUND. Order closed.',
          timestamp: 'Just now',
        );
        break;
      case OrderStatus.delivered:
        return;
    }

    final updatedOrder = current.copyWith(
      status: nextStatus,
      statusMessages: [...current.statusMessages, newLog],
    );

    state = state.copyWith(activeOrder: updatedOrder);
  }

  Future<Reservation> bookReservation({
    required String name,
    required String email,
    required String phone,
    required int guests,
    required String date,
    required String time,
    required String tableType,
    String? specialRequests,
  }) async {
    final payload = {
      'customerName': name,
      'email': email,
      'phone': phone,
      'guests': guests,
      'date': date,
      'time': time,
      'tableType': tableType,
      'specialRequests': specialRequests,
    };

    String token = 'RES-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
    try {
      final remoteToken = await _repository.createReservation(payload);
      if (remoteToken.isNotEmpty) token = remoteToken;
    } catch (_) {}

    return Reservation(
      id: token,
      customerName: name,
      email: email,
      phone: phone,
      guests: guests,
      date: date,
      time: time,
      tableType: tableType,
      specialRequests: specialRequests,
      status: 'CONFIRMED',
      createdAt: DateTime.now(),
    );
  }
}

final orderNotifierProvider =
    StateNotifierProvider<OrderNotifier, OrderState>((ref) {
  final repository = ref.watch(orderRepositoryProvider);
  return OrderNotifier(repository);
});
