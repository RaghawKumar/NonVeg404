class UserAddress {
  final String id;
  final String label; // Home, Office, Hackathon Lab
  final String fullAddress;
  final bool isDefault;

  const UserAddress({
    required this.id,
    required this.label,
    required this.fullAddress,
    this.isDefault = false,
  });

  factory UserAddress.fromJson(Map<String, dynamic> json) {
    return UserAddress(
      id: json['id']?.toString() ?? '',
      label: json['label']?.toString() ?? 'Default Address',
      fullAddress: json['fullAddress']?.toString() ?? json['address']?.toString() ?? '',
      isDefault: json['isDefault'] == true || json['is_default'] == 1,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'label': label,
    'fullAddress': fullAddress,
    'isDefault': isDefault,
  };
}

class UserProfile {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String devRole; // e.g. "Lead Backend Architect", "Staff SRE"
  final String loyaltyTier; // "Kernel VIP", "Sudo Dev", "Script Kiddie"
  final int rewardPoints; // e.g. 1450 XP
  final List<UserAddress> savedAddresses;

  const UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.devRole,
    required this.loyaltyTier,
    required this.rewardPoints,
    required this.savedAddresses,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    final addrsRaw = json['savedAddresses'] ?? json['addresses'] ?? [];
    List<UserAddress> parsedAddrs = [];
    if (addrsRaw is List) {
      parsedAddrs = addrsRaw
          .whereType<Map<String, dynamic>>()
          .map((a) => UserAddress.fromJson(a))
          .toList();
    }

    return UserProfile(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Developer',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      devRole: json['devRole']?.toString() ?? json['techRole']?.toString() ?? json['tech_role']?.toString() ?? 'Full Stack Dev',
      loyaltyTier: json['loyaltyTier']?.toString() ?? json['loyalty_tier']?.toString() ?? 'Kernel VIP',
      rewardPoints: (json['rewardPoints'] as num?)?.toInt() ?? 
                    (json['loyaltyPoints'] as num?)?.toInt() ?? 
                    (json['loyalty_points'] as num?)?.toInt() ?? 0,
      savedAddresses: parsedAddrs,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'phone': phone,
    'devRole': devRole,
    'loyaltyTier': loyaltyTier,
    'rewardPoints': rewardPoints,
    'savedAddresses': savedAddresses.map((a) => a.toJson()).toList(),
  };

  UserProfile copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? devRole,
    String? loyaltyTier,
    int? rewardPoints,
    List<UserAddress>? savedAddresses,
  }) {
    return UserProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      devRole: devRole ?? this.devRole,
      loyaltyTier: loyaltyTier ?? this.loyaltyTier,
      rewardPoints: rewardPoints ?? this.rewardPoints,
      savedAddresses: savedAddresses ?? this.savedAddresses,
    );
  }
}
