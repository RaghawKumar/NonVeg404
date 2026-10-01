enum SpiceLevel {
  mild,
  medium,
  hot,
  codeRed;

  String get label {
    switch (this) {
      case SpiceLevel.mild:
        return 'Mild';
      case SpiceLevel.medium:
        return 'Medium';
      case SpiceLevel.hot:
        return 'Hot';
      case SpiceLevel.codeRed:
        return 'Code Red';
    }
  }

  static SpiceLevel fromString(String val) {
    switch (val.toLowerCase()) {
      case 'mild':
        return SpiceLevel.mild;
      case 'medium':
        return SpiceLevel.medium;
      case 'code red':
        return SpiceLevel.codeRed;
      default:
        return SpiceLevel.hot;
    }
  }
}

class FoodAddon {
  final String id;
  final String name;
  final double price;

  const FoodAddon({
    required this.id,
    required this.name,
    required this.price,
  });

  factory FoodAddon.fromJson(Map<String, dynamic> json) {
    return FoodAddon(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? json['addon_name']?.toString() ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 
             (json['addon_price'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'price': price,
  };
}

class FoodItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final double? originalPrice;
  final String image;
  final String category;
  final SpiceLevel spiceLevel;
  final bool availability;
  final bool isFeatured;
  final double rating;
  final int reviewsCount;
  final String prepTime;
  final int? calories;
  final List<FoodAddon> addOns;
  final String? techTag;

  const FoodItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.originalPrice,
    required this.image,
    required this.category,
    required this.spiceLevel,
    this.availability = true,
    this.isFeatured = false,
    this.rating = 4.8,
    this.reviewsCount = 120,
    required this.prepTime,
    this.calories,
    this.addOns = const [],
    this.techTag,
  });

  factory FoodItem.fromJson(Map<String, dynamic> json) {
    final addonsRaw = json['addOns'] ?? json['addons'] ?? json['food_addons'] ?? [];
    List<FoodAddon> parsedAddons = [];
    if (addonsRaw is List) {
      parsedAddons = addonsRaw
          .whereType<Map<String, dynamic>>()
          .map((a) => FoodAddon.fromJson(a))
          .toList();
    }

    final spiceStr = json['spiceLevel']?.toString() ?? json['spice_level']?.toString() ?? 'Hot';
    final isAvail = json['availability'] == true || json['availability'] == 1;
    final isFeat = json['isFeatured'] == true || json['is_featured'] == 1;

    return FoodItem(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      originalPrice: (json['originalPrice'] as num?)?.toDouble() ?? (json['original_price'] as num?)?.toDouble(),
      image: json['image']?.toString() ?? '',
      category: json['category']?.toString() ?? 'Main Course',
      spiceLevel: SpiceLevel.fromString(spiceStr),
      availability: isAvail,
      isFeatured: isFeat,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      reviewsCount: (json['reviewsCount'] as num?)?.toInt() ?? (json['reviews_count'] as num?)?.toInt() ?? 0,
      prepTime: json['prepTime']?.toString() ?? json['prep_time']?.toString() ?? '20 min',
      calories: (json['calories'] as num?)?.toInt(),
      addOns: parsedAddons,
      techTag: json['techTag']?.toString() ?? json['tech_tag']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'price': price,
    'originalPrice': originalPrice,
    'image': image,
    'category': category,
    'spiceLevel': spiceLevel.label,
    'availability': availability,
    'isFeatured': isFeatured,
    'rating': rating,
    'reviewsCount': reviewsCount,
    'prepTime': prepTime,
    'calories': calories,
    'addOns': addOns.map((a) => a.toJson()).toList(),
    'techTag': techTag,
  };
}
