import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../providers/auth_provider.dart';
import '../providers/order_provider.dart';
import '../models/user_profile.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/tech_badge.dart';
import 'login_screen.dart';
import 'reservations_screen.dart';
import 'offers_screen.dart';
import 'track_order_screen.dart';
import '../services/api_config.dart';
import '../services/api_service.dart';

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.currentUser;
    final orderProvider = context.watch<OrderProvider>();

    return Scaffold(
      appBar: const CustomAppBar(title: 'DEVELOPER PROFILE'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: user == null
            ? _buildLoggedOutView(context)
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Developer ID Card
                  _buildProfileCard(context, user),

                  const SizedBox(height: 16),

                  // Loyalty XP Meter Card
                  _buildLoyaltyCard(user),

                  const SizedBox(height: 20),

                  // Saved Coordinates (Addresses)
                  _buildAddressesSection(context, auth, user),

                  const SizedBox(height: 20),

                  // Past Orders Manifest
                  _buildPastOrdersSection(context, orderProvider),

                  const SizedBox(height: 20),

                  // Quick Settings & Shortcuts
                  _buildSettingsSection(context, auth),

                  const SizedBox(height: 28),
                ],
              ),
      ),
    );
  }

  Widget _buildLoggedOutView(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.person_off_outlined,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 16),
            Text(
              'GUEST SESSION ACTIVE',
              style: AppTheme.mono(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Sign in to access your order buffer history, loyalty perks, and saved delivery coordinates.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              onPressed: () {
                Navigator.of(
                  context,
                ).push(MaterialPageRoute(builder: (_) => const LoginScreen()));
              },
              child: Text(
                'LOG IN AS DEVELOPER',
                style: AppTheme.mono(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.textSecondary,
                side: const BorderSide(color: AppColors.border),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              onPressed: () => _showApiSettingsDialog(context),
              icon: const Icon(Icons.dns, size: 16, color: AppColors.primary),
              label: Text(
                'API: ${ApiConfig.baseUrl}',
                style: AppTheme.mono(fontSize: 11),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileCard(BuildContext context, UserProfile user) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.primary),
                ),
                child: Center(
                  child: Text(
                    user.name.substring(0, 1).toUpperCase(),
                    style: AppTheme.mono(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      user.devRole,
                      style: AppTheme.mono(
                        fontSize: 11,
                        color: AppColors.primary,
                      ),
                    ),
                    Text(
                      user.email,
                      style: AppTheme.mono(
                        fontSize: 11,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              TechBadge(
                text: user.loyaltyTier,
                color: AppColors.primary,
                isGlow: true,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLoyaltyCard(UserProfile user) {
    const maxPoints = 2000;
    final progress = (user.rewardPoints / maxPoints).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.military_tech,
                    color: AppColors.primary,
                    size: 20,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'KERNEL XP REWARDS',
                    style: AppTheme.mono(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Text(
                '${user.rewardPoints} / $maxPoints XP',
                style: AppTheme.mono(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: AppColors.card,
              valueColor: const AlwaysStoppedAnimation<Color>(
                AppColors.primary,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${maxPoints - user.rewardPoints} XP needed to elevate to Root Architect Tier (15% lifetime discount).',
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAddressesSection(
    BuildContext context,
    AuthProvider auth,
    UserProfile user,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'SAVED COORDINATES',
              style: AppTheme.mono(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.textMuted,
              ),
            ),
            GestureDetector(
              onTap: () {
                _showAddAddressDialog(context, auth);
              },
              child: Text(
                '+ ADD LOCATION',
                style: AppTheme.mono(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        ...user.savedAddresses.map(
          (addr) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.location_city,
                  color: AppColors.primary,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        addr.label,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                      Text(
                        addr.fullAddress,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                if (addr.isDefault) ...[
                  const SizedBox(width: 8),
                  const TechBadge(
                    text: 'DEFAULT',
                    color: AppColors.success,
                    fontSize: 9,
                  ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _showAddAddressDialog(BuildContext context, AuthProvider auth) {
    final labelCtrl = TextEditingController();
    final addressCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text(
          'NEW COORDINATES',
          style: AppTheme.mono(fontSize: 14, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: labelCtrl,
              style: AppTheme.mono(fontSize: 12),
              decoration: const InputDecoration(
                labelText: 'Label (e.g. Home Lab, Coworking)',
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: addressCtrl,
              style: AppTheme.mono(fontSize: 12),
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Full Address Coordinates',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('CANCEL'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.black,
            ),
            onPressed: () {
              if (labelCtrl.text.isNotEmpty && addressCtrl.text.isNotEmpty) {
                auth.addAddress(
                  UserAddress(
                    id: 'addr-${DateTime.now().millisecondsSinceEpoch}',
                    label: labelCtrl.text.trim(),
                    fullAddress: addressCtrl.text.trim(),
                  ),
                );
                Navigator.of(ctx).pop();
              }
            },
            child: const Text('SAVE'),
          ),
        ],
      ),
    );
  }

  Widget _buildPastOrdersSection(
    BuildContext context,
    OrderProvider orderProvider,
  ) {
    final orders = orderProvider.orderHistory;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'ORDER COMMIT HISTORY',
          style: AppTheme.mono(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppColors.textMuted,
          ),
        ),
        const SizedBox(height: 10),
        if (orders.isEmpty)
          Container(
            padding: const EdgeInsets.all(16),
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.border),
            ),
            child: Text(
              'No previous order commits recorded.',
              style: AppTheme.mono(fontSize: 11, color: AppColors.textMuted),
            ),
          )
        else
          ...orders.map(
            (ord) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          ord.id,
                          style: AppTheme.mono(
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${ord.items.length} items • ₹${ord.total.toStringAsFixed(2)}',
                          style: const TextStyle(fontSize: 12),
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          ord.status.label,
                          style: AppTheme.mono(
                            fontSize: 10,
                            color: AppColors.success,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.surface,
                      foregroundColor: AppColors.primary,
                      side: const BorderSide(color: AppColors.border),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                    ),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => const TrackOrderScreen(),
                        ),
                      );
                    },
                    child: Text(
                      'TRACK',
                      style: AppTheme.mono(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildSettingsSection(BuildContext context, AuthProvider auth) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          ListTile(
            leading: const Icon(
              Icons.table_restaurant,
              color: AppColors.primary,
            ),
            title: const Text('Table Bookings', style: TextStyle(fontSize: 14)),
            trailing: const Icon(
              Icons.chevron_right,
              color: AppColors.textMuted,
            ),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ReservationsScreen()),
              );
            },
          ),
          const Divider(color: AppColors.border, height: 1),
          ListTile(
            leading: const Icon(
              Icons.confirmation_number_outlined,
              color: AppColors.primary,
            ),
            title: const Text(
              'Active Coupons & Dev Tokens',
              style: TextStyle(fontSize: 14),
            ),
            trailing: const Icon(
              Icons.chevron_right,
              color: AppColors.textMuted,
            ),
            onTap: () {
              Navigator.of(
                context,
              ).push(MaterialPageRoute(builder: (_) => const OffersScreen()));
            },
          ),
          const Divider(color: AppColors.border, height: 1),
          ListTile(
            leading: const Icon(
              Icons.switch_account_outlined,
              color: AppColors.primary,
            ),
            title: const Text(
              'Switch Demo Character',
              style: TextStyle(fontSize: 14),
            ),
            trailing: const Icon(
              Icons.chevron_right,
              color: AppColors.textMuted,
            ),
            onTap: () {
              final isAda = auth.currentUser?.name == 'Ada Lovelace';
              auth.quickLoginAs(isAda ? 'Linus' : 'Ada');
            },
          ),
          const Divider(color: AppColors.border, height: 1),
          ListTile(
            leading: const Icon(Icons.dns_outlined, color: AppColors.primary),
            title: const Text(
              'Backend API Server Host',
              style: TextStyle(fontSize: 14),
            ),
            subtitle: Text(
              ApiConfig.baseUrl,
              style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted),
              overflow: TextOverflow.ellipsis,
            ),
            trailing: const Icon(
              Icons.chevron_right,
              color: AppColors.textMuted,
            ),
            onTap: () => _showApiSettingsDialog(context),
          ),
          const Divider(color: AppColors.border, height: 1),
          ListTile(
            leading: const Icon(Icons.logout, color: AppColors.danger),
            title: Text(
              'Kill Session (Log Out)',
              style: AppTheme.mono(fontSize: 13, color: AppColors.danger),
            ),
            onTap: () {
              auth.logout();
            },
          ),
        ],
      ),
    );
  }

  void _showApiSettingsDialog(BuildContext context) {
    final controller = TextEditingController(text: ApiConfig.baseUrl);
    String healthStatus = 'Unchecked';
    Color statusColor = AppColors.textMuted;
    bool checking = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (dialogCtx, setModalState) => AlertDialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(
            side: const BorderSide(color: AppColors.primary, width: 1.5),
            borderRadius: BorderRadius.circular(16),
          ),
          title: Row(
            children: [
              const Icon(Icons.dns, color: AppColors.primary, size: 22),
              const SizedBox(width: 8),
              Text(
                'BACKEND API HOST',
                style: AppTheme.mono(fontSize: 14, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Connected to the same backend & admin panel as customer website.',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controller,
                  style: AppTheme.mono(fontSize: 12),
                  decoration: const InputDecoration(
                    labelText: 'API Base URL',
                    prefixIcon: Icon(Icons.link, size: 18),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Quick Preset Presets:',
                  style: AppTheme.mono(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    ActionChip(
                      label: Text(
                        'Localhost',
                        style: AppTheme.mono(fontSize: 10),
                      ),
                      backgroundColor: AppColors.card,
                      side: const BorderSide(color: AppColors.border),
                      onPressed: () {
                        controller.text = 'http://localhost:4000/api';
                      },
                    ),
                    ActionChip(
                      label: Text(
                        'Android Emul (10.0.2.2)',
                        style: AppTheme.mono(fontSize: 10),
                      ),
                      backgroundColor: AppColors.card,
                      side: const BorderSide(color: AppColors.border),
                      onPressed: () {
                        controller.text = 'http://10.0.2.2:4000/api';
                      },
                    ),
                    ActionChip(
                      label: Text(
                        'LAN (${ApiConfig.lanHost})',
                        style: AppTheme.mono(fontSize: 10),
                      ),
                      backgroundColor: AppColors.card,
                      side: const BorderSide(color: AppColors.border),
                      onPressed: () {
                        controller.text =
                            'http://${ApiConfig.lanHost}:4000/api';
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Health: $healthStatus',
                      style: AppTheme.mono(
                        fontSize: 11,
                        color: statusColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    TextButton.icon(
                      onPressed: checking
                          ? null
                          : () async {
                              setModalState(() {
                                checking = true;
                                healthStatus = 'Pinging...';
                              });
                              await ApiConfig.setBaseUrl(controller.text);
                              final ok = await ApiService.checkHealth();
                              setModalState(() {
                                checking = false;
                                if (ok) {
                                  healthStatus = '200 OK ONLINE';
                                  statusColor = AppColors.success;
                                } else {
                                  healthStatus = 'OFFLINE/UNREACHABLE';
                                  statusColor = AppColors.danger;
                                }
                              });
                            },
                      icon: const Icon(Icons.bolt, size: 14),
                      label: Text('TEST', style: AppTheme.mono(fontSize: 11)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('CANCEL'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.black,
              ),
              onPressed: () async {
                await ApiConfig.setBaseUrl(controller.text.trim());
                if (ctx.mounted) {
                  Navigator.of(ctx).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'API Host updated to: ${ApiConfig.baseUrl}',
                      ),
                      backgroundColor: AppColors.success,
                    ),
                  );
                }
              },
              child: Text(
                'SAVE & RECONNECT',
                style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
