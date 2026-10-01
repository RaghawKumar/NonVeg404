import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../providers/menu_provider.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/food_card.dart';
import '../widgets/terminal_banner.dart';
import '../widgets/tech_badge.dart';
import 'menu_screen.dart';
import 'reservations_screen.dart';
import 'offers_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final menu = context.watch<MenuProvider>();
    final featuredItems = menu.items.where((i) => i.isFeatured).toList();

    return Scaffold(
      appBar: const CustomAppBar(),
      body: RefreshIndicator(
        color: AppColors.primary,
        backgroundColor: AppColors.card,
        onRefresh: () => menu.refresh(),
        child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Banner
            _buildHeroBanner(context),

            const SizedBox(height: 16),

            // Quick Terminal Command
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TerminalBanner(
                title: 'root@nonveg404: /kitchen/grill',
                command: 'sudo cook --dish="Dum Biryani" --scoville=high',
              ),
            ),

            const SizedBox(height: 24),

            // Categories Section
            _buildCategoryChips(context),

            const SizedBox(height: 24),

            // Featured Dishes (Featured Builds)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.code, size: 20, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Text(
                        'FEATURED BUILDS',
                        style: AppTheme.mono(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const MenuScreen()),
                      );
                    },
                    child: Text(
                      'VIEW ALL >>',
                      style: AppTheme.mono(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Featured Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.65,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: featuredItems.length > 4 ? 4 : featuredItems.length,
                itemBuilder: (context, index) {
                  return FoodCard(item: featuredItems[index]);
                },
              ),
            ),

            const SizedBox(height: 28),

            // Quick Actions Cards (Book Table & Promo Codes)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildActionCard(
                      context: context,
                      title: 'BOOK TABLE',
                      subtitle: 'Reserve Server Booth',
                      tag: 'CORE #01',
                      icon: Icons.table_restaurant,
                      color: AppColors.primary,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const ReservationsScreen()),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionCard(
                      context: context,
                      title: 'DEV TOKENS',
                      subtitle: 'Up to 20% OFF',
                      tag: 'SUDO_50',
                      icon: Icons.confirmation_number_outlined,
                      color: AppColors.secondary,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const OffersScreen()),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Live Telemetry / Kitchen Stats
            _buildTelemetrySection(),

            const SizedBox(height: 28),

            // Git Commit Reviews
            _buildReviewsSection(),

            const SizedBox(height: 36),
          ],
        ),
      ),
    ),
  );
  }

  Widget _buildHeroBanner(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
        gradient: const RadialGradient(
          center: Alignment(0.8, -0.6),
          radius: 1.2,
          colors: [
            Color(0xFF281C0E),
            AppColors.surface,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.08),
            blurRadius: 20,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const TechBadge(
                text: 'v2.4 LTS RELEASE',
                color: AppColors.primary,
                icon: Icons.verified,
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.access_time, size: 12, color: AppColors.primary),
                    const SizedBox(width: 4),
                    Text(
                      'Open Till 2 AM',
                      style: AppTheme.mono(fontSize: 10, color: AppColors.textPrimary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            '404 // HUNGER NOT FOUND',
            style: AppTheme.mono(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.5,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '// Artisanal Dum Biryani, Tandoori BBQ & Smashed Burgers engineered with zero bugs.',
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 18),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const MenuScreen()),
                  );
                },
                icon: const Icon(Icons.restaurant, size: 16),
                label: Text(
                  'ORDER FEAST',
                  style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.textPrimary,
                  side: const BorderSide(color: AppColors.borderLight),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const ReservationsScreen()),
                  );
                },
                icon: const Icon(Icons.calendar_today, size: 14),
                label: Text(
                  'TABLE',
                  style: AppTheme.mono(fontSize: 12),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChips(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'CATEGORIES',
            style: AppTheme.mono(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: AppColors.textMuted,
            ),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 40,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: context.watch<MenuProvider>().categories.length,
            separatorBuilder: (context, index) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final cat = context.watch<MenuProvider>().categories[index];
              return InkWell(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => MenuScreen(initialCategory: cat),
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Center(
                    child: Text(
                      cat,
                      style: AppTheme.mono(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required BuildContext context,
    required String title,
    required String subtitle,
    required String tag,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
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
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 24),
                TechBadge(text: tag, color: color, fontSize: 9),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: AppTheme.mono(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTelemetrySection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
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
              const Icon(Icons.analytics_outlined, size: 18, color: AppColors.success),
              const SizedBox(width: 8),
              Text(
                'KITCHEN TELEMETRY & LIVE HEALTH',
                style: AppTheme.mono(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                  color: AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(child: _buildMetric('24m', 'Avg Build Time', AppColors.primary)),
              Container(width: 1, height: 32, color: AppColors.border),
              Expanded(child: _buildMetric('450°C', 'Grill Temperature', AppColors.danger)),
              Container(width: 1, height: 32, color: AppColors.border),
              Expanded(child: _buildMetric('99.9%', 'Flavor Uptime', AppColors.success)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetric(String value, String label, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: AppTheme.mono(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: color,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
        ),
      ],
    );
  }

  Widget _buildReviewsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              const Icon(Icons.commit, size: 20, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(
                'GIT COMMIT REVIEWS',
                style: AppTheme.mono(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 175,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: MockData.reviews.length,
            separatorBuilder: (context, index) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final rev = MockData.reviews[index];
              return Container(
                width: 290,
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            rev.author,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Row(
                          children: List.generate(
                            rev.rating.toInt(),
                            (_) => const Icon(Icons.star, size: 12, color: AppColors.primary),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      rev.role,
                      style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: Text(
                        '"${rev.comment}"',
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      rev.commitHash,
                      style: AppTheme.mono(fontSize: 9, color: AppColors.primary),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
