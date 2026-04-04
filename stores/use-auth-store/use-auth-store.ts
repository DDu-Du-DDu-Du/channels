import useSettingsStore from "@/stores/use-settings-store/use-settings-store";
import { SessionStorage } from "@/utils/storage";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  // reactive hydrate
  hasHydrated: boolean;
  onRehydrate: () => void;
  handleHydrateGuestSession: () => void;

  isLoggedIn: boolean;
  sessionType: "none" | "guest" | "member";
  accessToken: string | null;
  refreshToken: string | null;
  isRefreshing: boolean;
  hasRegisteredDeviceToken: boolean;

  // actions
  authenticate: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  login: () => void;
  handleGuestLogin: () => void;
  setRefreshing: (isRefreshing: boolean) => void;
  markDeviceTokenRegistered: () => void;
  resetDeviceTokenRegistration: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      onRehydrate: () => set({ hasHydrated: true }),
      handleHydrateGuestSession: () => {
        useSettingsStore.getState().handleApplyGuestDefaults();
        set({ isLoggedIn: true, sessionType: "guest" });
      },

      isLoggedIn: false,
      sessionType: "none",
      accessToken: null,
      refreshToken: null,
      isRefreshing: false,
      hasRegisteredDeviceToken: false,

      authenticate: (accessToken, refreshToken) =>
        set({
          sessionType: "member",
          accessToken,
          refreshToken,
        }),

      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
          sessionType: "none",
          hasRegisteredDeviceToken: false,
        }),

      login: () => set({ isLoggedIn: true, sessionType: "member" }),
      handleGuestLogin: () => {
        useSettingsStore.getState().handleApplyGuestDefaults();
        set({
          isLoggedIn: true,
          sessionType: "guest",
          accessToken: null,
          refreshToken: null,
          hasRegisteredDeviceToken: false,
        });
      },
      setRefreshing: (isRefreshing) => set({ isRefreshing }),
      markDeviceTokenRegistered: () => set({ hasRegisteredDeviceToken: true }),
      resetDeviceTokenRegistration: () => set({ hasRegisteredDeviceToken: false }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => SessionStorage),
      partialize: (state) => ({
        sessionType: state.sessionType,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state, err) => {
        state?.onRehydrate();
        if (state?.sessionType === "guest") {
          state.handleHydrateGuestSession();
        }
      },
      skipHydration: true,
    },
  ),
);

export default useAuthStore;
