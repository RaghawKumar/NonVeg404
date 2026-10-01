import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../providers/cart_provider.dart';
import '../providers/order_provider.dart';
import '../providers/auth_provider.dart';
import 'track_order_screen.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  String _paymentMethod = 'UPI';
  bool _isDeploying = false;

  final List<Map<String, dynamic>> _paymentOptions = [
    {'id': 'UPI', 'label': 'UPI Instant Transfer', 'icon': Icons.flash_on, 'sub': 'Google Pay, PhonePe, Paytm'},
    {'id': 'CARD', 'label': 'Credit / Debit Card', 'icon': Icons.credit_card, 'sub': 'Visa, Mastercard, RuPay'},
    {'id': 'NETBANKING', 'label': 'Net Banking', 'icon': Icons.account_balance, 'sub': 'All Major Banks'},
    {'id': 'COD', 'label': 'Cash on Delivery (COD)', 'icon': Icons.payments_outlined, 'sub': 'Pay at coordinates'},
  ];

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().currentUser;
    if (user != null) {
      _nameController.text = user.name;
      _phoneController.text = user.phone;
      _emailController.text = user.email;
      if (user.savedAddresses.isNotEmpty) {
        _addressController.text = user.savedAddresses.first.fullAddress;
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _compileAndDeployOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isDeploying = true);

    // Simulate compilation delay for developer flavor
    await Future.delayed(const Duration(milliseconds: 1200));

    if (!mounted) return;

    final cart = context.read<CartProvider>();
    final orderProvider = context.read<OrderProvider>();

    final createdOrder = await orderProvider.createOrder(
      name: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      email: _emailController.text.trim(),
      address: _addressController.text.trim(),
      paymentMethod: _paymentMethod,
      notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.taxAmount,
      deliveryFee: cart.deliveryFee,
      discount: cart.discountAmount,
      total: cart.total,
      deliveryType: cart.isDelivery ? 'delivery' : 'pickup',
      couponCode: cart.appliedCoupon?.code,
    );

    // Clear cart buffer
    cart.clearCart();

    if (!mounted) return;

    setState(() => _isDeploying = false);

    // Show celebration dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppColors.primary, width: 1.5),
          borderRadius: BorderRadius.circular(16),
        ),
        title: Row(
          children: [
            const Icon(Icons.check_circle, color: AppColors.success, size: 28),
            const SizedBox(width: 8),
            Text('BUILD SUCCESSFUL', style: AppTheme.mono(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Order pushed to master branch with zero conflicts.',
              style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ORDER COMMIT HASH:', style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted)),
                  Text(createdOrder.id, style: AppTheme.mono(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primary)),
                  const SizedBox(height: 6),
                  Text('ETA: ${createdOrder.estimatedDeliveryTime}', style: AppTheme.mono(fontSize: 11, color: AppColors.success)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.black,
            ),
            onPressed: () {
              Navigator.of(ctx).pop(); // dismiss modal
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const TrackOrderScreen()),
              );
            },
            child: Text('TRACK LIVE PIPELINE', style: AppTheme.mono(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'PIPELINE DEPLOYMENT',
          style: AppTheme.mono(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Contact Coordinates Card
              _buildSectionTitle('1. RECIPIENT COORDINATES', Icons.person_pin_circle_outlined),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    _buildTextField(
                      controller: _nameController,
                      label: 'Full Name / Developer Alias',
                      hint: 'Linus Torvalds',
                      icon: Icons.person_outline,
                      validator: (v) => v == null || v.isEmpty ? 'Name is required' : null,
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                      controller: _phoneController,
                      label: 'Phone Terminal',
                      hint: '+1 (555) 019-2834',
                      icon: Icons.phone_outlined,
                      keyboardType: TextInputType.phone,
                      validator: (v) => v == null || v.isEmpty ? 'Phone is required' : null,
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                      controller: _emailController,
                      label: 'Email',
                      hint: 'linus@kernel.dev',
                      icon: Icons.email_outlined,
                      keyboardType: TextInputType.emailAddress,
                      validator: (v) => v == null || v.isEmpty ? 'Email is required' : null,
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                      controller: _addressController,
                      label: cart.isDelivery ? 'Delivery Coordinates (Address)' : 'Pickup Counter Branch',
                      hint: '404 Kernel Way, Suite 8A, Tech City',
                      icon: Icons.home_outlined,
                      maxLines: 2,
                      validator: (v) => v == null || v.isEmpty ? 'Address is required' : null,
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                      controller: _notesController,
                      label: 'Courier Telemetry Instructions (Optional)',
                      hint: '// Ring buzzer twice, leave on server bench...',
                      icon: Icons.chat_bubble_outline,
                      maxLines: 1,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Payment Methods
              _buildSectionTitle('2. PAYMENT PROTOCOL', Icons.account_balance_wallet_outlined),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: _paymentOptions.map((opt) {
                    final isSelected = _paymentMethod == opt['id'];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : AppColors.surface,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSelected ? AppColors.primary : AppColors.border,
                        ),
                      ),
                      child: InkWell(
                        onTap: () => setState(() => _paymentMethod = opt['id'] as String),
                        borderRadius: BorderRadius.circular(10),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          child: Row(
                            children: [
                              Icon(opt['icon'] as IconData, color: isSelected ? AppColors.primary : AppColors.textMuted),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      opt['label'] as String,
                                      style: TextStyle(
                                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                        fontSize: 13,
                                      ),
                                    ),
                                    Text(
                                      opt['sub'] as String,
                                      style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                width: 20,
                                height: 20,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isSelected ? AppColors.primary : AppColors.borderLight,
                                    width: 2,
                                  ),
                                ),
                                child: isSelected
                                    ? Center(
                                        child: Container(
                                          width: 10,
                                          height: 10,
                                          decoration: const BoxDecoration(
                                            color: AppColors.primary,
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      )
                                    : null,
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 24),

              // Summary Preview
              _buildSectionTitle('3. MANIFEST CONFIRMATION', Icons.receipt_long_outlined),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Buffer Items Count:', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                        Text('${cart.itemCount} items', style: AppTheme.mono(fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total Cost to Commit:', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                        Text(
                          '₹${cart.total.toStringAsFixed(2)}',
                          style: AppTheme.mono(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Deploy Button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 5,
                    shadowColor: AppColors.primary.withValues(alpha: 0.5),
                  ),
                  onPressed: _isDeploying ? null : _compileAndDeployOrder,
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: _isDeploying
                            ? Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                                  ),
                                  const SizedBox(width: 12),
                                  Text('COMPILING FLAVORS ON GRILL...', style: AppTheme.mono(fontWeight: FontWeight.bold)),
                                ],
                              )
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.rocket_launch, size: 20),
                                  const SizedBox(width: 8),
                                  Text(
                                    'COMPILE & DEPLOY ORDER // ₹${cart.total.toStringAsFixed(2)}',
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
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String text, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(
          text,
          style: AppTheme.mono(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
            color: AppColors.textMuted,
          ),
        ),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    int maxLines = 1,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
        const SizedBox(height: 4),
        TextFormField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          validator: validator,
          style: AppTheme.mono(fontSize: 12),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, size: 18, color: AppColors.textMuted),
            hintText: hint,
            hintStyle: AppTheme.mono(fontSize: 11, color: AppColors.textMuted),
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
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.primary),
            ),
          ),
        ),
      ],
    );
  }
}
