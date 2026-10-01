import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../models/coupon.dart';
import '../providers/cart_provider.dart';
import '../repositories/coupon_repository.dart';
import '../widgets/tech_badge.dart';

class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key});

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  final ICouponRepository _couponRepo = CouponRepository();
  List<Coupon> _coupons = MockData.coupons;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadCoupons();
  }

  Future<void> _loadCoupons({bool forceRefresh = false}) async {
    setState(() => _isLoading = true);
    try {
      final remote = await _couponRepo.getCoupons(forceRefresh: forceRefresh);
      if (remote.isNotEmpty && mounted) {
        setState(() {
          _coupons = remote;
        });
      }
    } catch (_) {
      // Fallback to local default coupons if offline
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'DEV DISCOUNT TOKENS',
          style: AppTheme.mono(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primary),
            tooltip: 'Sync Coupons with Admin',
            onPressed: () => _loadCoupons(forceRefresh: true),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        backgroundColor: AppColors.card,
        onRefresh: () => _loadCoupons(forceRefresh: true),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2B1905), AppColors.surface],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const TechBadge(text: 'LIVE ADMIN SYNCED', color: AppColors.primary),
                    const SizedBox(height: 10),
                    Text(
                      'Elevate Your Meal Permissions',
                      style: AppTheme.mono(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Apply any coupon code directly to your cart buffer for immediate cost reduction.',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              if (_isLoading && _coupons.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(color: AppColors.primary),
                  ),
                )
              else
                ..._coupons.map((coupon) => _buildCouponCard(context, coupon)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCouponCard(BuildContext context, Coupon coupon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.primary, width: 1),
                ),
                child: Text(
                  coupon.code,
                  style: AppTheme.mono(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: AppColors.primary,
                    letterSpacing: 1,
                  ),
                ),
              ),
              TechBadge(
                text: coupon.discountType == 'percentage'
                    ? '${coupon.value.toInt()}% OFF'
                    : '₹${coupon.value.toStringAsFixed(2)} OFF',
                color: AppColors.success,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            coupon.description,
            style: const TextStyle(fontSize: 13, color: AppColors.textPrimary, height: 1.3),
          ),
          const SizedBox(height: 6),
          Text(
            'Min Order: ₹${coupon.minOrder.toStringAsFixed(0)}',
            style: AppTheme.mono(fontSize: 11, color: AppColors.textMuted),
          ),
          const Divider(color: AppColors.border, height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: coupon.code));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Copied ${coupon.code} to clipboard!'),
                      backgroundColor: AppColors.card,
                    ),
                  );
                },
                icon: const Icon(Icons.copy, size: 14, color: AppColors.textSecondary),
                label: Text('COPY CODE', style: AppTheme.mono(fontSize: 11, color: AppColors.textSecondary)),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () {
                  final cart = context.read<CartProvider>();
                  final err = cart.applyCoupon(coupon);
                  if (err != null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(err), backgroundColor: AppColors.danger),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Applied ${coupon.code} to your cart buffer!'),
                        backgroundColor: AppColors.success,
                      ),
                    );
                  }
                },
                child: Text('APPLY TO CART', style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
