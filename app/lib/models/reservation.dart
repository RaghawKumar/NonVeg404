class Reservation {
  final String id;
  final String customerName;
  final String email;
  final String phone;
  final int guests;
  final String date;
  final String time;
  final String tableType;
  final String? specialRequests;
  final String status;
  final DateTime createdAt;

  Reservation({
    required this.id,
    required this.customerName,
    required this.email,
    required this.phone,
    required this.guests,
    required this.date,
    required this.time,
    required this.tableType,
    this.specialRequests,
    this.status = 'CONFIRMED',
    required this.createdAt,
  });
}
