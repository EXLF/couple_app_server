class Anniversary {
  final String? id;
  final String title;
  final DateTime date;
  final String? description;
  final String? imageUrl;
  final bool isAddedToCalendar;
  final String? coupleId;
  final DateTime createdAt;
  final DateTime updatedAt;

  Anniversary({
    this.id,
    required this.title,
    required this.date,
    this.description,
    this.imageUrl,
    this.isAddedToCalendar = false,
    this.coupleId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Anniversary.fromJson(Map<String, dynamic> json) {
    return Anniversary(
      id: json['id'],
      title: json['title'],
      date: DateTime.parse(json['date']),
      description: json['description'],
      imageUrl: json['imageUrl'],
      isAddedToCalendar: json['isAddedToCalendar'] ?? false,
      coupleId: json['coupleId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date.toIso8601String(),
      'description': description,
      'imageUrl': imageUrl,
      'isAddedToCalendar': isAddedToCalendar,
      'coupleId': coupleId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
} 