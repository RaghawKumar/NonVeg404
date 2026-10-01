import 'dart:async';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'main_navigation.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final List<String> _bootLogs = [];
  int _logIndex = 0;
  Timer? _logTimer;

  final List<String> _allLogs = [
    '> initializing nonveg404 kernel v2.4 LTS...',
    '> checking grill temperature sensors... [ OK ]',
    '> loading chicken & mutton flavor modules... [ OK ]',
    '> compiling spice matrix (zero bugs detected)... [ OK ]',
    '> mounting tandoor oven on port :4000... [ 200 OK ]',
    '> launching customer experience interface...',
  ];

  @override
  void initState() {
    super.initState();
    _startBootSequence();
  }

  void _startBootSequence() {
    _logTimer = Timer.periodic(const Duration(milliseconds: 320), (timer) {
      if (_logIndex < _allLogs.length) {
        setState(() {
          _bootLogs.add(_allLogs[_logIndex]);
          _logIndex++;
        });
      } else {
        timer.cancel();
        Timer(const Duration(milliseconds: 600), _navigateToHome);
      }
    });
  }

  void _navigateToHome() {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const MainNavigation(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 400),
      ),
    );
  }

  @override
  void dispose() {
    _logTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Skip button
              Align(
                alignment: Alignment.topRight,
                child: TextButton(
                  onPressed: _navigateToHome,
                  child: Text(
                    'SKIP >>',
                    style: AppTheme.mono(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const Spacer(),

              // Brand Hero
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 110,
                      height: 110,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.primary, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.35),
                            blurRadius: 30,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/icon/app_icon.png',
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Title
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'NON VEG ',
                          style: AppTheme.mono(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.2,
                            color: Colors.white,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '404',
                            style: AppTheme.mono(
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              color: Colors.black,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      '// GOOD FOOD. NO BUGS. //',
                      style: AppTheme.mono(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '404 = Hunger Not Found',
                      style: AppTheme.mono(
                        fontSize: 11,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Terminal Logs Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
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
                        const Spacer(),
                        Text('bash --login', style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ..._bootLogs.map((log) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text(
                            log,
                            style: AppTheme.mono(
                              fontSize: 11,
                              color: log.contains('[ OK ]') || log.contains('[ 200 OK ]')
                                  ? AppColors.success
                                  : AppColors.textSecondary,
                            ),
                          ),
                        )),
                    if (_logIndex < _allLogs.length)
                      Container(
                        width: 8,
                        height: 14,
                        color: AppColors.primary,
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
