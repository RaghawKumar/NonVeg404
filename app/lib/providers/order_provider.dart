import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/reservation.dart';
import '../data/mock_data.dart';
import '../repositories/order_repository.dart';

class OrderProvider with ChangeNotifier {
  final IOrderRepository _repository;

  Order? _activeOrder = MockData.createSampleActiveOrder();
  final List<Order> _orderHistory = [];
  final List<Reservation> _reservations = [
    Reservation(
      id: 'RES-404-12',
      customerName: 'Linus Torvalds',
      email: 'linus@kernel.dev',
      phone: '+1 (555) 019-2834',
      guests: 4,
      date: 'Tomorrow, Oct 1st',
      time: '08:00 PM',
      tableType: 'VIP Root Access - Private Dining Chamber',
      specialRequests: 'Extra napkins and extra spicy dip.',
      createdAt: DateTime.now().subtract(const Duration(hours: 3)),
    ),
  ];

  bool _isCreatingOrder = false;
  String? _orderError;

  Order? get activeOrder => _activeOrder;
  List<Order> get orderHistory => List.unmodifiable(_orderHistory);
  List<Reservation> get reservations => List.unmodifiable(_reservations);
  bool get isCreatingOrder => _isCreatingOrder;
  String? get orderError => _orderError;

  OrderProvider({IOrderRepository? repository})
      : _repository = repository ?? OrderRepository() {
    refreshMyOrders();
  }

  Future<void> refreshMyOrders() async {
    try {
      final myOrders = await _repository.getMyOrders();
      if (myOrders.isNotEmpty) {
        _orderHistory.clear();
        _orderHistory.addAll(myOrders);
        _activeOrder ??= myOrders.first;
        notifyListeners();
      }
    } catch (_) {}
  }

  /// Syncs active order status live from backend
  Future<void> syncActiveOrder() async {
    if (_activeOrder == null) return;
    try {
      final freshOrder = await _repository.getOrderById(_activeOrder!.id);
      _activeOrder = freshOrder;
      notifyListeners();
    } catch (_) {}
  }

  Future<Order> createOrder({
    required String name,
    required String phone,
    required String email,
    required String address,
    required String paymentMethod,
    String? notes,
    required List<CartItem> items,
    required double subtotal,
    required double tax,
    required double deliveryFee,
    required double discount,
    required double total,
    required String deliveryType,
    String? couponCode,
  }) async {
    _isCreatingOrder = true;
    _orderError = null;
    notifyListeners();

    // Prepare API payload for common backend
    final orderPayload = {
      'customerName': name,
      'phone': phone,
      'email': email,
      'address': address,
      'deliveryType': deliveryType,
      'paymentMethod': paymentMethod,
      'paymentStatus': paymentMethod == 'COD' ? 'PENDING' : 'PAID',
      'orderNotes': notes,
      'subtotal': subtotal,
      'tax': tax,
      'deliveryFee': deliveryFee,
      'discount': discount,
      'total': total,
      'estimatedDeliveryTime': '30-40 mins',
      'couponCode': couponCode,
      'items': items.map((ci) => {
        'foodItemId': ci.foodItem.id,
        'name': ci.foodItem.name,
        'price': ci.unitPrice,
        'quantity': ci.quantity,
        'specialNotes': ci.specialNotes,
        'selectedAddOns': ci.selectedAddOns.map((a) => {
          'name': a.name,
          'price': a.price,
        }).toList(),
      }).toList(),
    };

    Order newOrder;

    try {
      final res = await _repository.createOrder(orderPayload);
      final orderId = res['orderId']?.toString() ?? 'NV404-${Random().nextInt(9000) + 1000}';
      
      // Attempt to fetch fresh order from server
      try {
        newOrder = await _repository.getOrderById(orderId);
      } catch (_) {
        // Fallback local representation if immediate fetch was slightly delayed
        newOrder = Order(
          id: orderId,
          customerName: name,
          phone: phone,
          email: email,
          address: address,
          deliveryType: deliveryType,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod == 'COD' ? 'PENDING' : 'PAID',
          orderNotes: notes,
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
            StatusMessage(
              status: OrderStatus.initialized,
              label: 'Order Initialized',
              timestamp: DateFormat('hh:mm a').format(DateTime.now()),
              codeLog: '> git init order-manifest.json\n> Connection handshake established. Pushed to master backend.',
            ),
          ],
        );
      }
    } catch (e) {
      _orderError = e.toString();
      // Graceful local generation if server is offline
      final randomId = 'NV404-${Random().nextInt(9000) + 1000}';
      newOrder = Order(
        id: randomId,
        customerName: name,
        phone: phone,
        email: email,
        address: address,
        deliveryType: deliveryType,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod == 'COD' ? 'PENDING' : 'PAID',
        orderNotes: notes,
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
          StatusMessage(
            status: OrderStatus.initialized,
            label: 'Order Initialized',
            timestamp: DateFormat('hh:mm a').format(DateTime.now()),
            codeLog: '> git init order-manifest.json\n> Connection established.',
          ),
        ],
      );
    }

    _activeOrder = newOrder;
    _orderHistory.insert(0, newOrder);
    _isCreatingOrder = false;
    notifyListeners();
    return newOrder;
  }

  // Advance simulation step for UI testing
  void advanceActiveOrderStatus() {
    if (_activeOrder == null) return;
    final now = DateTime.now();
    final timeStr = DateFormat('hh:mm a').format(now);

    switch (_activeOrder!.status) {
      case OrderStatus.initialized:
        _activeOrder!.status = OrderStatus.accepted;
        _activeOrder!.statusMessages.add(
          StatusMessage(
            status: OrderStatus.accepted,
            label: 'Kitchen Accepted',
            timestamp: timeStr,
            codeLog: '> npm install ingredients\n> Kitchen ticket acknowledged. Master chef on duty.',
          ),
        );
        break;
      case OrderStatus.accepted:
        _activeOrder!.status = OrderStatus.preparing;
        _activeOrder!.statusMessages.add(
          StatusMessage(
            status: OrderStatus.preparing,
            label: 'Grill Compilation',
            timestamp: timeStr,
            codeLog: '> compiling flavors on grill\n> Tandoor temperature calibrated at 450°C. Dum pot sealed.',
          ),
        );
        break;
      case OrderStatus.preparing:
        _activeOrder!.status = OrderStatus.ready;
        _activeOrder!.statusMessages.add(
          StatusMessage(
            status: OrderStatus.ready,
            label: 'Build Successful',
            timestamp: timeStr,
            codeLog: '> build successful (0 errors, 0 warnings)\n> Quality check passed. Packed in temperature-locking bag.',
          ),
        );
        break;
      case OrderStatus.ready:
        _activeOrder!.status = OrderStatus.outForDelivery;
        _activeOrder!.statusMessages.add(
          StatusMessage(
            status: OrderStatus.outForDelivery,
            label: 'Deployed to Courier',
            timestamp: timeStr,
            codeLog: '> deploying package to customer coordinates\n> Delivery pilot John S. dispatched on unit #404.',
          ),
        );
        break;
      case OrderStatus.outForDelivery:
        _activeOrder!.status = OrderStatus.delivered;
        _activeOrder!.statusMessages.add(
          StatusMessage(
            status: OrderStatus.delivered,
            label: '200 OK Delivered',
            timestamp: timeStr,
            codeLog: '> 200 OK: Process finished with exit code 0\n> Hunger resolved. Enjoy your meal!',
          ),
        );
        break;
      case OrderStatus.delivered:
        break;
    }
    notifyListeners();
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
    String resId = 'RES-404-${Random().nextInt(900) + 100}';

    try {
      resId = await _repository.createReservation({
        'customerName': name,
        'email': email,
        'phone': phone,
        'guests': guests,
        'date': date,
        'time': time,
        'tableType': tableType,
        'specialRequests': specialRequests,
      });
    } catch (_) {}

    final reservation = Reservation(
      id: resId,
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

    _reservations.insert(0, reservation);
    notifyListeners();
    return reservation;
  }
}
