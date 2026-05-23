import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (user, token) =>
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isInitialized: true,
    }),

  setAccessToken: (token) =>
    set({ accessToken: token }),

  setUser: (user) =>
    set({ user }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),

  initialize: async () => {
    // Try to refresh the token on app startup (user might have a valid refresh cookie)
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.accessToken) {
          set({
            user: result.data.user || null,
            accessToken: result.data.accessToken,
            isAuthenticated: true,
            isInitialized: true,
          });
          return;
        }
      }
      // No valid refresh token
      set({ isInitialized: true });
    } catch {
      // Network error or server not running, just mark as initialized
      set({ isInitialized: true });
    }
  },
}));

export default useAuthStore;
