import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/mock_data.dart';
import '../models/user_profile.dart';
import '../repositories/auth_repository.dart';
import 'repository_providers.dart';

class AuthState {
  final UserProfile? user;
  final bool isLoading;
  final String? errorMessage;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.errorMessage,
  });

  bool get isAuthenticated => user != null;

  AuthState copyWith({
    UserProfile? user,
    bool? isLoading,
    String? errorMessage,
    bool clearUser = false,
  }) {
    return AuthState(
      user: clearUser ? null : (user ?? this.user),
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final IAuthRepository _repository;

  AuthNotifier(this._repository)
      : super(const AuthState(user: MockData.defaultUser)) {
    _initUser();
  }

  Future<void> _initUser() async {
    final cached = await _repository.getCurrentUser();
    if (cached != null) {
      state = state.copyWith(user: cached);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final user = await _repository.login(email, password);
      state = state.copyWith(user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final user = await _repository.register(
        name: name,
        email: email,
        phone: phone,
        password: password,
      );
      state = state.copyWith(user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
      return false;
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = state.copyWith(clearUser: true);
  }

  void quickLoginAs(String profile) {
    if (profile == 'Ada') {
      state = state.copyWith(
        user: const UserProfile(
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
        ),
      );
    } else {
      state = state.copyWith(user: MockData.defaultUser);
    }
  }

  void addAddress(dynamic labelOrAddress, [String? fullAddress]) {
    if (state.user == null) return;
    final UserAddress newAddr;
    if (labelOrAddress is UserAddress) {
      newAddr = labelOrAddress;
    } else {
      newAddr = UserAddress(
        id: 'addr-${DateTime.now().millisecondsSinceEpoch}',
        label: labelOrAddress.toString(),
        fullAddress: fullAddress ?? '',
        isDefault: state.user!.savedAddresses.isEmpty,
      );
    }
    final updatedList = List<UserAddress>.from(state.user!.savedAddresses)..add(newAddr);
    state = state.copyWith(
      user: state.user!.copyWith(savedAddresses: updatedList),
    );
  }
}

final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});
