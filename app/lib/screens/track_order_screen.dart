import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../providers/order_provider.dart';
import '../models/order.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/tech_badge.dart';

class TrackOrderScreen extends StatelessWidget {
  const TrackOrderScreen({super.key});

  final List<Map<String, dynamic>> _pipelineStages = const [
    {'status': OrderStatus.initialized, 'label': 'INITIALIZED', 'cmd': 'git init order.json'},
    {'status': OrderStatus.accepted, 'label': 'ACCEPTED', 'cmd': 'npm install flavors'},
    {'status': OrderStatus.preparing, 'label': 'PREPARING', 'cmd': 'compile on 450°C grill'},
    {'status': OrderStatus.ready, 'label': 'READY', 'cmd': 'build passed, packaging'},
    {'status': OrderStatus.outForDelivery, 'label': 'OUT FOR DELIVERY', 'cmd': 'deploying to coordinates'},
    {'status': OrderStatus.delivered, 'label': 'DELIVERED', 'cmd': '200 OK Hunger Resolved'},
  ];

  int _getStageIndex(OrderStatus status) {
    switch (status) {
      case OrderStatus.initialized:
        return 0;
      case OrderStatus.accepted:
        return 1;
      case OrderStatus.preparing:
        return 2;
      case OrderStatus.ready:
        return 3;
      case OrderStatus.outForDelivery:
        return 4;
      case OrderStatus.delivered:
        return 5;
    }
  }

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final activeOrder = orderProvider.activeOrder;

    return Scaffold(
      appBar: CustomAppBar(
        title: 'LIVE PIPELINE TRACKER',
        actions: [
          IconButton(
            icon: const Icon(Icons.sync, color: AppColors.primary),
            tooltip: 'Sync with Kitchen Server',
            onPressed: () async {
              await orderProvider.syncActiveOrder();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Synced with live kitchen telemetry!'),
                    duration: Duration(seconds: 1),
                  ),
                );
              }
            },
          ),
        ],
      ),
      body: activeOrder == null
          ? _buildNoActiveOrder()
          : RefreshIndicator(
              color: AppColors.primary,
              backgroundColor: AppColors.card,
              onRefresh: () => orderProvider.syncActiveOrder(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Active Order Header Card
                  _buildHeaderCard(context, activeOrder),

                  const SizedBox(height: 18),

                  // Pipeline Stepper
                  _buildPipelineStepper(activeOrder),

                  const SizedBox(height: 18),

                  // Courier Telemetry Card (if out for delivery or preparing)
                  _buildCourierCard(activeOrder),

                  const SizedBox(height: 18),

                  // Terminal Live Logs
                  _buildTerminalLogs(activeOrder),

                  const SizedBox(height: 18),

                  // Items in this order
                  _buildOrderItemsManifest(activeOrder),

                  const SizedBox(height: 20),

                  // Interactive Demo Simulator Control
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.tune, size: 16, color: AppColors.primary),
                            const SizedBox(width: 6),
                            Text(
                              'DEMO SIMULATOR TOOLKIT',
                              style: AppTheme.mono(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Test the live cooking & delivery pipeline progression step-by-step.',
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 10),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.primary,
                              side: const BorderSide(color: AppColors.primary),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            onPressed: () {
                              orderProvider.advanceActiveOrderStatus();
                            },
                            icon: const Icon(Icons.fast_forward, size: 16),
                            label: Text(
                              'ADVANCE PIPELINE STATUS >>',
                              style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
    );
  }

  Widget _buildNoActiveOrder() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.radar, size: 64, color: AppColors.textMuted),
            const SizedBox(height: 16),
            Text(
              'NO ACTIVE PIPELINE FOUND',
              style: AppTheme.mono(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primary),
            ),
            const SizedBox(height: 8),
            const Text(
              'You have no active orders compiling in the kitchen right now.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderCard(BuildContext context, Order order) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ORDER COMMIT', style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted)),
                  Text(
                    order.id,
                    style: AppTheme.mono(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primary),
                  ),
                ],
              ),
              TechBadge(
                text: order.status.label,
                color: order.status == OrderStatus.delivered ? AppColors.success : AppColors.primary,
                isGlow: true,
              ),
            ],
          ),
          const Divider(color: AppColors.border, height: 24),
          Row(
            children: [
              const Icon(Icons.access_time, size: 16, color: AppColors.primary),
              const SizedBox(width: 6),
              Text(
                'ETA: ${order.estimatedDeliveryTime}',
                style: AppTheme.mono(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.location_on_outlined, size: 16, color: AppColors.textMuted),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  order.address,
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPipelineStepper(Order order) {
    final currentStage = _getStageIndex(order.status);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'CI/CD COMPILATION PIPELINE',
            style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textMuted),
          ),
          const SizedBox(height: 16),
          ...List.generate(_pipelineStages.length, (index) {
            final stage = _pipelineStages[index];
            final isCompleted = index <= currentStage;
            final isCurrent = index == currentStage;
            final isLast = index == _pipelineStages.length - 1;

            Color statusColor;
            if (isCurrent) {
              statusColor = AppColors.primary;
            } else if (isCompleted) {
              statusColor = AppColors.success;
            } else {
              statusColor = AppColors.borderLight;
            }

            return IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Dot and line
                  Column(
                    children: [
                      Container(
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          color: isCompleted ? statusColor.withValues(alpha: 0.2) : Colors.transparent,
                          shape: BoxShape.circle,
                          border: Border.all(color: statusColor, width: 2),
                        ),
                        child: Center(
                          child: isCompleted
                              ? Icon(
                                  isCurrent ? Icons.circle : Icons.check,
                                  size: isCurrent ? 8 : 12,
                                  color: statusColor,
                                )
                              : null,
                        ),
                      ),
                      if (!isLast)
                        Expanded(
                          child: Container(
                            width: 2,
                            color: isCompleted && index < currentStage ? AppColors.success : AppColors.border,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(width: 14),

                  // Stage Info
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                stage['label'] as String,
                                style: AppTheme.mono(
                                  fontSize: 13,
                                  fontWeight: isCurrent ? FontWeight.bold : FontWeight.w600,
                                  color: isCompleted ? AppColors.textPrimary : AppColors.textMuted,
                                ),
                              ),
                              if (isCurrent) ...[
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    'ACTIVE',
                                    style: AppTheme.mono(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.black),
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '> ${stage['cmd']}',
                            style: AppTheme.mono(
                              fontSize: 11,
                              color: isCurrent ? AppColors.primary : AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildCourierCard(Order order) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.two_wheeler, color: AppColors.primary, size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('COURIER UNIT #404', style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted)),
                const Text('Alex Miller (Lead Rider)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text('Vehicle: Dark Cruiser GT', style: AppTheme.mono(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
          IconButton(
            style: IconButton.styleFrom(
              backgroundColor: AppColors.surface,
              side: const BorderSide(color: AppColors.border),
            ),
            icon: const Icon(Icons.phone, color: AppColors.primary, size: 20),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildTerminalLogs(Order order) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle)),
              const SizedBox(width: 6),
              Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle)),
              const SizedBox(width: 6),
              Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle)),
              const SizedBox(width: 10),
              Text('terminal://logs/order-daemon.log', style: AppTheme.mono(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 12),
          ...order.statusMessages.map((msg) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '[${msg.timestamp}] ${msg.label}',
                      style: AppTheme.mono(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      msg.codeLog,
                      style: AppTheme.mono(fontSize: 11, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildOrderItemsManifest(Order order) {
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
          Text(
            'ORDER CONTENTS',
            style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textMuted),
          ),
          const SizedBox(height: 10),
          ...order.items.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        '${item.quantity}x ${item.foodItem.name}',
                        style: const TextStyle(fontSize: 13, color: AppColors.textPrimary),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      '₹${item.totalPrice.toStringAsFixed(2)}',
                      style: AppTheme.mono(fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              )),
          const Divider(color: AppColors.border),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Total Billed:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              Text(
                '₹${order.total.toStringAsFixed(2)}',
                style: AppTheme.mono(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primary),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
