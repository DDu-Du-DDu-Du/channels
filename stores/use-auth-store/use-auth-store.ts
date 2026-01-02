import { SessionStorage } from "@/utils/storage";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  // reactive hydrate
  hasHydrated: boolean;
  onRehydrate: () => void;

  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isRefreshing: boolean;

  // actions
  authenticate: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  login: () => void;
  setRefreshing: (isRefreshing: boolean) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      onRehydrate: () => set({ hasHydrated: true }),

      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      isRefreshing: false,

      authenticate: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),

      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
        }),

      login: () => set({ isLoggedIn: true }),
      setRefreshing: (isRefreshing) => set({ isRefreshing }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => SessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state, err) => {
        state?.onRehydrate();
      },
      skipHydration: true,
    },
  ),
);

export default useAuthStore;
