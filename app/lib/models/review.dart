class Review {
  final String id;
  final String author;
  final String role;
  final double rating;
  final String comment;
  final String date;
  final String commitHash;
  final String dishOrdered;

  const Review({
    required this.id,
    required this.author,
    required this.role,
    required this.rating,
    required this.comment,
    required this.date,
    required this.commitHash,
    required this.dishOrdered,
  });
}
