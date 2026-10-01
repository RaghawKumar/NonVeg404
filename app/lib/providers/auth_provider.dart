import 'package:flutter/foundation.dart';
import '../models/user_profile.dart';
import '../data/mock_data.dart';
import '../repositories/auth_repository.dart';

class AuthProvider with ChangeNotifier {
  final IAuthRepository _repository;

  UserProfile? _currentUser = MockData.defaultUser;
  bool _isLoading = false;
  String? _errorMessage;

  UserProfile? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider({IAuthRepository? repository})
      : _repository = repository ?? AuthRepository() {
    _initUser();
  }

  Future<void> _initUser() async {
    final cached = await _repository.getCurrentUser();
    if (cached != null) {
      _currentUser = cached;
      notifyListeners();
    }
  }

  void quickLoginAs(String profile) {
    if (profile == 'Ada') {
      _currentUser = const UserProfile(
        id: 'user-ada-101',
        name: 'Ada Lovelace',
        email: 'ada@firstalgo.dev',
        phone: '+1 (555) 018-9922',
        devRole: 'Algorithm Pioneer',
        loyaltyTier: 'Kernel VIP',
        rewardPoints: 2400,
        savedAddresses: [
          UserAddress(
            id: 'addr-ada-1',
            label: 'Analytical Engine Lab',
            fullAddress: '1843 Babbage Square, Suite 404, Tech District',
            isDefault: true,
          ),
        ],
      );
    } else {
      _currentUser = MockData.defaultUser;
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await _repository.login(email, password);
      _currentUser = user;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      // Fallback mock login for offline testing
      if (email.isNotEmpty) {
        _currentUser = UserProfile(
          id: 'user-${DateTime.now().millisecondsSinceEpoch}',
          name: email.split('@').first.toUpperCase(),
          email: email,
          phone: '+1 (555) 404-0000',
          devRole: 'Full Stack Engineer',
          loyaltyTier: 'Sudo Dev',
          rewardPoints: 500,
          savedAddresses: const [
            UserAddress(
              id: 'addr-default',
              label: 'Home Workstation',
              fullAddress: '742 Terminal Boulevard, Unit 4B',
              isDefault: true,
            ),
          ],
        );
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String name, String email, String phone, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await _repository.register(
        name: name,
        email: email,
        phone: phone,
        password: password,
      );
      _currentUser = user;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    _currentUser = null;
    notifyListeners();
  }

  void addAddress(dynamic labelOrAddress, [String? fullAddress]) {
    if (_currentUser == null) return;
    final UserAddress newAddr;
    if (labelOrAddress is UserAddress) {
      newAddr = labelOrAddress;
    } else {
      newAddr = UserAddress(
        id: 'addr-${DateTime.now().millisecondsSinceEpoch}',
        label: labelOrAddress.toString(),
        fullAddress: fullAddress ?? '',
        isDefault: _currentUser!.savedAddresses.isEmpty,
      );
    }
    final updatedList = List<UserAddress>.from(_currentUser!.savedAddresses)..add(newAddr);
    _currentUser = _currentUser!.copyWith(savedAddresses: updatedList);
    notifyListeners();
  }
}
