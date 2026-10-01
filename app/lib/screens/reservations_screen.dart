import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../providers/order_provider.dart';
import '../providers/auth_provider.dart';
import '../data/mock_data.dart';
import '../widgets/tech_badge.dart';

class ReservationsScreen extends StatefulWidget {
  const ReservationsScreen({super.key});

  @override
  State<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends State<ReservationsScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  String _selectedTime = '08:00 PM';
  int _guests = 4;
  String _selectedZone = MockData.tableZones[0];

  final List<String> _timeSlots = [
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:30 PM',
    '12:00 AM (Dev Shift)',
  ];

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().currentUser;
    if (user != null) {
      _nameController.text = user.name;
      _emailController.text = user.email;
      _phoneController.text = user.phone;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _bookTable() async {
    if (!_formKey.currentState!.validate()) return;

    final dateStr = DateFormat('EEE, MMM dd, yyyy').format(_selectedDate);

    final res = await context.read<OrderProvider>().bookReservation(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      guests: _guests,
      date: dateStr,
      time: _selectedTime,
      tableType: _selectedZone,
      specialRequests: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
    );

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AppColors.primary, width: 1.5),
          borderRadius: BorderRadius.circular(16),
        ),
        title: Row(
          children: [
            const Icon(Icons.check_circle, color: AppColors.success, size: 24),
            const SizedBox(width: 8),
            Text('RESERVATION CONFIRMED', style: AppTheme.mono(fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your server table is reserved with high priority access.', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
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
                  Text('BOOKING TOKEN: ${res.id}', style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary)),
                  const SizedBox(height: 4),
                  Text('Date: $dateStr', style: AppTheme.mono(fontSize: 11, color: AppColors.textPrimary)),
                  Text('Time: $_selectedTime', style: AppTheme.mono(fontSize: 11, color: AppColors.textPrimary)),
                  Text('Party Size: $_guests Guests', style: AppTheme.mono(fontSize: 11, color: AppColors.textPrimary)),
                  Text('Zone: $_selectedZone', style: AppTheme.mono(fontSize: 11, color: AppColors.success)),
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
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text('CLOSE', style: AppTheme.mono(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final reservations = context.watch<OrderProvider>().reservations;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'SERVER TABLE RESERVATION',
          style: AppTheme.mono(fontSize: 15, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Intro Banner
              Container(
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
                        const TechBadge(text: 'DINE-IN ENGINE', color: AppColors.primary),
                        const Spacer(),
                        const Icon(Icons.table_restaurant, color: AppColors.primary),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Reserve Your Workstation',
                      style: AppTheme.mono(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'High-speed Wi-Fi, low-latency charcoal grill, and zero bugs guaranteed.',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Date & Guest Count
              Text('SELECT PARTY SIZE & DATE', style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
              const SizedBox(height: 10),
              Row(
                children: [
                  // Guests Stepper
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.people_outline, size: 16, color: AppColors.primary),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              '$_guests Guests',
                              style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          InkWell(
                            onTap: () {
                              if (_guests > 1) setState(() => _guests--);
                            },
                            borderRadius: BorderRadius.circular(4),
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: AppColors.surface,
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: const Icon(Icons.remove, size: 12),
                            ),
                          ),
                          const SizedBox(width: 4),
                          InkWell(
                            onTap: () {
                              if (_guests < 12) setState(() => _guests++);
                            },
                            borderRadius: BorderRadius.circular(4),
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: AppColors.surface,
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: const Icon(Icons.add, size: 12, color: AppColors.primary),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Date Picker
                  Expanded(
                    child: InkWell(
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: _selectedDate,
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 30)),
                        );
                        if (picked != null) setState(() => _selectedDate = picked);
                      },
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 11),
                        decoration: BoxDecoration(
                          color: AppColors.card,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.calendar_month_outlined, size: 16, color: AppColors.primary),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                DateFormat('MMM dd, yyyy').format(_selectedDate),
                                style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Time Slot Chips
              Text('TIME SLOT (LATE NIGHT AVAILABLE)', style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _timeSlots.map((slot) {
                  final isSelected = _selectedTime == slot;
                  return ChoiceChip(
                    label: Text(slot),
                    selected: isSelected,
                    onSelected: (selected) {
                      if (selected) setState(() => _selectedTime = slot);
                    },
                    labelStyle: AppTheme.mono(
                      fontSize: 11,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected ? Colors.black : AppColors.textPrimary,
                    ),
                    selectedColor: AppColors.primary,
                    backgroundColor: AppColors.card,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: BorderSide(color: isSelected ? AppColors.primary : AppColors.border),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 20),

              // Zone Selection
              Text('SELECT TABLE HARDWARE ZONE', style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
              const SizedBox(height: 10),
              ...MockData.tableZones.map((zone) {
                final isSelected = _selectedZone == zone;
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : AppColors.card,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
                  ),
                  child: InkWell(
                    onTap: () => setState(() => _selectedZone = zone),
                    borderRadius: BorderRadius.circular(10),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      child: Row(
                        children: [
                          Container(
                            width: 18,
                            height: 18,
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
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: AppColors.primary,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  )
                                : null,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              zone,
                              style: AppTheme.mono(
                                fontSize: 12,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),

              const SizedBox(height: 20),

              // Contact Details
              Text('CONTACT ALIAS', style: AppTheme.mono(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    TextFormField(
                      controller: _nameController,
                      style: AppTheme.mono(fontSize: 12),
                      validator: (v) => v == null || v.isEmpty ? 'Name required' : null,
                      decoration: InputDecoration(
                        labelText: 'Developer Name',
                        prefixIcon: const Icon(Icons.person_outline, size: 18),
                        filled: true,
                        fillColor: AppColors.surface,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: _phoneController,
                      style: AppTheme.mono(fontSize: 12),
                      validator: (v) => v == null || v.isEmpty ? 'Phone required' : null,
                      decoration: InputDecoration(
                        labelText: 'Phone',
                        prefixIcon: const Icon(Icons.phone_outlined, size: 18),
                        filled: true,
                        fillColor: AppColors.surface,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: _notesController,
                      style: AppTheme.mono(fontSize: 12),
                      decoration: InputDecoration(
                        labelText: 'Special Requests (e.g. Birthday, quiet booth)',
                        prefixIcon: const Icon(Icons.note_alt_outlined, size: 18),
                        filled: true,
                        fillColor: AppColors.surface,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Book Table Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _bookTable,
                  icon: const Icon(Icons.check),
                  label: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text('CONFIRM TABLE RESERVATION', style: AppTheme.mono(fontWeight: FontWeight.bold)),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Existing Reservations
              if (reservations.isNotEmpty) ...[
                Text('YOUR ACTIVE BOOKINGS', style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
                const SizedBox(height: 12),
                ...reservations.map((r) => Container(
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
                                Text(r.id, style: AppTheme.mono(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary)),
                                const SizedBox(height: 2),
                                Text(
                                  '${r.date} @ ${r.time}',
                                  style: const TextStyle(fontSize: 12),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  '${r.guests} Guests • ${r.tableType}',
                                  style: AppTheme.mono(fontSize: 10, color: AppColors.textMuted),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          TechBadge(text: r.status, color: AppColors.success, fontSize: 10),
                        ],
                      ),
                    )),
              ],
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
