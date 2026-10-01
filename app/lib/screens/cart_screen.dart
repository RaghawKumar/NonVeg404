import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../theme/app_theme.dart';
import '../providers/cart_provider.dart';
import '../data/mock_data.dart';
import 'checkout_screen.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();

  @override
  void dispose() {
    _couponController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CartProvider>(
      builder: (context, cart, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text(
              'ORDER BUFFER [ ${cart.itemCount} ITEMS ]',
              style: AppTheme.mono(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            actions: [
              if (cart.items.isNotEmpty)
                IconButton(
                  icon: const Icon(Icons.delete_sweep_outlined, color: AppColors.danger),
                  tooltip: 'Clear Cart',
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        backgroundColor: AppColors.card,
                        title: Text('PURGE BUFFER?', style: AppTheme.mono(color: AppColors.danger)),
                        content: const Text('Are you sure you want to remove all items from your order buffer?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.of(ctx).pop(),
                            child: const Text('CANCEL'),
                          ),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.danger),
                            onPressed: () {
                              cart.clearCart();
                              Navigator.of(ctx).pop();
                            },
                            child: const Text('PURGE', style: TextStyle(color: Colors.white)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
            ],
          ),
          body: cart.items.isEmpty
              ? _buildEmptyCart(context)
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Delivery / Pickup Toggle
                      _buildDeliveryToggle(cart),

                      const SizedBox(height: 18),

                      // Cart Items List
                      ...cart.items.map((item) => _buildCartItemCard(context, cart, item)),

                      const SizedBox(height: 16),

                      // Coupon Code Applicator
                      _buildCouponSection(context, cart),

                      const SizedBox(height: 20),

                      // Bill Summary
                      _buildBillSummary(cart),

                      const SizedBox(height: 24),

                      // Checkout CTA
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.black,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 4,
                            shadowColor: AppColors.primary.withValues(alpha: 0.4),
                          ),
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => const CheckoutScreen(),
                              ),
                            );
                          },
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.lock_outline, size: 18),
                                const SizedBox(width: 8),
                                Text(
                                  'PROCEED TO CHECKOUT // ₹${cart.total.toStringAsFixed(2)}',
                                  style: AppTheme.mono(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
        );
      },
    );
  }

  Widget _buildEmptyCart(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.surface,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.border),
              ),
              child: const Icon(Icons.shopping_bag_outlined, size: 56, color: AppColors.textMuted),
            ),
            const SizedBox(height: 20),
            Text(
              'BUFFER EMPTY: 0 DISHES ALLOCATED',
              style: AppTheme.mono(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Your hunger buffer is waiting for some hot biryani or tandoori chicken.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'BROWSE MENU',
                style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliveryToggle(CartProvider cart) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => cart.toggleDelivery(true),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: cart.isDelivery ? AppColors.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.delivery_dining,
                      size: 18,
                      color: cart.isDelivery ? Colors.black : AppColors.textMuted,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'DELIVERY',
                      style: AppTheme.mono(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: cart.isDelivery ? Colors.black : AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => cart.toggleDelivery(false),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: !cart.isDelivery ? AppColors.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.storefront,
                      size: 18,
                      color: !cart.isDelivery ? Colors.black : AppColors.textMuted,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'PICKUP',
                      style: AppTheme.mono(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: !cart.isDelivery ? Colors.black : AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartItemCard(BuildContext context, CartProvider cart, dynamic item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Food Image
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: CachedNetworkImage(
              imageUrl: item.foodItem.image,
              width: 70,
              height: 70,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 12),

          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.foodItem.name,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 2),
                Text(
                  '₹${item.unitPrice.toStringAsFixed(2)} each',
                  style: AppTheme.mono(fontSize: 12, color: AppColors.primary),
                ),

                // Selected Addons list
                if (item.selectedAddOns.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  ...item.selectedAddOns.map<Widget>((addon) => Text(
                        '+ ${addon.name} (₹${addon.price.toStringAsFixed(2)})',
                        style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted),
                      )),
                ],

                if (item.specialNotes != null && item.specialNotes!.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    '// ${item.specialNotes}',
                    style: AppTheme.mono(fontSize: 10, color: AppColors.secondary),
                  ),
                ],

                const SizedBox(height: 8),

                // Stepper + Total Price
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      height: 32,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            padding: EdgeInsets.zero,
                            iconSize: 16,
                            icon: const Icon(Icons.remove),
                            onPressed: () => cart.decrementQuantity(item.cartItemId),
                          ),
                          Text(
                            '${item.quantity}',
                            style: AppTheme.mono(fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                          IconButton(
                            padding: EdgeInsets.zero,
                            iconSize: 16,
                            icon: const Icon(Icons.add, color: AppColors.primary),
                            onPressed: () => cart.incrementQuantity(item.cartItemId),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '₹${item.totalPrice.toStringAsFixed(2)}',
                      style: AppTheme.mono(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCouponSection(BuildContext context, CartProvider cart) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.local_offer_outlined, size: 16, color: AppColors.primary),
              const SizedBox(width: 6),
              Text(
                'DEV PROMO CODE',
                style: AppTheme.mono(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Coupon Form
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _couponController,
                  textCapitalization: TextCapitalization.characters,
                  style: AppTheme.mono(fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'e.g. SUDO_50',
                    hintStyle: AppTheme.mono(fontSize: 12, color: AppColors.textMuted),
                    filled: true,
                    fillColor: AppColors.surface,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.surface,
                  foregroundColor: AppColors.primary,
                  side: const BorderSide(color: AppColors.primary),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                onPressed: () async {
                  final code = _couponController.text.trim().toUpperCase();
                  if (code.isEmpty) return;

                  final err = await cart.validateAndApplyCouponOnline(code);
                  if (!context.mounted) return;
                  if (err != null) {
                    final coupon = MockData.coupons.firstWhere(
                      (c) => c.code.toUpperCase() == code,
                      orElse: () => MockData.coupons[0],
                    );
                    final localErr = cart.applyCoupon(coupon);
                    if (localErr != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(err), backgroundColor: AppColors.danger),
                      );
                      return;
                    }
                  }
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Coupon $code authorized and applied!'),
                      backgroundColor: AppColors.success,
                    ),
                  );
                },
                child: Text('APPLY', style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ],
          ),

          // Quick coupon suggestions
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            children: MockData.coupons.map((c) {
              final isApplied = cart.appliedCoupon?.code == c.code;
              return ActionChip(
                label: Text(c.code),
                labelStyle: AppTheme.mono(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: isApplied ? Colors.black : AppColors.primary,
                ),
                backgroundColor: isApplied ? AppColors.primary : AppColors.surface,
                side: BorderSide(color: isApplied ? AppColors.primary : AppColors.border),
                onPressed: () {
                  _couponController.text = c.code;
                  cart.applyCoupon(c);
                },
              );
            }).toList(),
          ),

          if (cart.appliedCoupon != null) ...[
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Applied: ${cart.appliedCoupon!.code} (-₹${cart.discountAmount.toStringAsFixed(2)})',
                  style: AppTheme.mono(fontSize: 11, color: AppColors.success),
                ),
                GestureDetector(
                  onTap: () => cart.removeCoupon(),
                  child: Text(
                    'REMOVE',
                    style: AppTheme.mono(fontSize: 10, color: AppColors.danger),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildBillSummary(CartProvider cart) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'BILL MANIFEST',
            style: AppTheme.mono(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 12),
          _buildRow('Subtotal', '₹${cart.subtotal.toStringAsFixed(2)}'),
          if (cart.discountAmount > 0)
            _buildRow('Discount', '-₹${cart.discountAmount.toStringAsFixed(2)}', color: AppColors.success),
          _buildRow(
            'Delivery Fee',
            cart.deliveryFee == 0.0 ? 'FREE' : '₹${cart.deliveryFee.toStringAsFixed(2)}',
            color: cart.deliveryFee == 0.0 ? AppColors.success : null,
          ),
          _buildRow('Taxes & Surcharges (5%)', '₹${cart.taxAmount.toStringAsFixed(2)}'),
          const Divider(color: AppColors.border, height: 20),
          _buildRow(
            'TOTAL COMPILATION',
            '₹${cart.total.toStringAsFixed(2)}',
            isBold: true,
            color: AppColors.primary,
            fontSize: 16,
          ),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isBold = false, Color? color, double fontSize = 13}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: isBold ? AppColors.textPrimary : AppColors.textSecondary,
            ),
          ),
          Text(
            value,
            style: AppTheme.mono(
              fontSize: fontSize,
              fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
              color: color ?? AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
