import 'package:flutter_test/flutter_test.dart';
import 'package:app/main.dart';

void main() {
  testWidgets('NonVeg404 app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NonVeg404App());
    expect(find.byType(NonVeg404App), findsOneWidget);
  });
}
