import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { Lang } from '../constants/i18n';

export type UserType = 'tenant' | null;

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  userType: UserType;
  lang: Lang;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setLang: (lang: Lang) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  userType: null,
  lang: 'KR',
  hydrated: false,

  // 앱 시작 시 AsyncStorage에서 userType 및 language 복원
  hydrate: async () => {
    try {
      const [storedUserType, storedLang] = await Promise.all([
        AsyncStorage.getItem('userType'),
        AsyncStorage.getItem('language'),
      ]);
      const userType = (storedUserType as UserType) ?? null;
      const lang = (storedLang as Lang) ?? 'KR';
      set({ userType, lang, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    await AsyncStorage.setItem('userType', 'tenant');
    set({
      isLoading: false,
      isLoggedIn: true,
      userType: 'tenant',
      user: {
        id: '1',
        name: '홍길동',
        email,
        phone: '010-1234-5678',
        companyId: 'comp1',
        companyName: '(주)스타트업코리아',
        role: 'employee',
        isTenantVerified: true,
      },
    });
  },

  setLang: async (lang: Lang) => {
    await AsyncStorage.setItem('language', lang);
    set({ lang });
  },

  logout: async () => {
    await AsyncStorage.removeItem('userType');
    set({ user: null, isLoggedIn: false, userType: null });
  },
}));
