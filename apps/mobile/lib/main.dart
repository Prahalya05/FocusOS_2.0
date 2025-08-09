import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: const String.fromEnvironment('SUPABASE_URL', defaultValue: ''),
    anonKey: const String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: ''),
  );
  runApp(const FocusOSApp());
}

class FocusOSApp extends StatelessWidget {
  const FocusOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'FocusOS',
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('FocusOS')),
      body: FutureBuilder(
        future: Supabase.instance.client.from('users').select('id, role, display_name').limit(1),
        builder: (context, snapshot) {
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Text('Supabase ready: ${snapshot.connectionState}')
          );
        },
      ),
    );
  }
}


