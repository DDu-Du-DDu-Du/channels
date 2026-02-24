import { SessionStorage } from "@/utils/storage";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WeekStartDay = "sun" | "mon";
export type MenuActivationKey = "calendar" | "dashboard" | "stats";
export type RealtimeSyncKey = "notion" | "googleCalendar" | "microsoftTodo";

export interface SettingsPayload {
  display: {
    weekStartDay: WeekStartDay;
    isDarkMode: boolean;
  };
  menuActivation: {
    calendar: boolean;
    dashboard: boolean;
    stats: boolean;
  };
  appConnection: {
    realtimeSync: {
      notion: boolean;
      googleCalendar: boolean;
      microsoftTodo: boolean;
    };
  };
}

interface SettingsRuntimeState {
  dirty: boolean;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  syncError: string | null;
}

interface SettingsAction {
  handleHydrateSettings: (payload: SettingsPayload) => void;
  handleSetWeekStartDay: (day: WeekStartDay) => void;
  handleSetDarkMode: (next: boolean) => void;
  handleSetMenuActivation: (key: MenuActivationKey, next: boolean) => void;
  handleSetRealtimeSync: (key: RealtimeSyncKey, next: boolean) => void;
  handleMarkSyncStart: () => void;
  handleMarkSyncSuccess: () => void;
  handleMarkSyncError: (message: string) => void;
  handleResetSettings: () => void;
  handleGetSettingsPayload: () => SettingsPayload;
}

type SettingsState = SettingsPayload & SettingsRuntimeState & SettingsAction;

const DEFAULT_SETTINGS_PAYLOAD: SettingsPayload = {
  display: {
    weekStartDay: "sun",
    isDarkMode: false,
  },
  menuActivation: {
    calendar: true,
    dashboard: true,
    stats: true,
  },
  appConnection: {
    realtimeSync: {
      notion: false,
      googleCalendar: false,
      microsoftTodo: false,
    },
  },
};

const DEFAULT_RUNTIME_STATE: SettingsRuntimeState = {
  dirty: false,
  isSyncing: false,
  lastSyncedAt: null,
  syncError: null,
};

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS_PAYLOAD,
      ...DEFAULT_RUNTIME_STATE,

      handleHydrateSettings: (payload) =>
        set({
          ...payload,
          dirty: false,
          syncError: null,
        }),

      handleSetWeekStartDay: (day) =>
        set((state) => ({
          display: {
            ...state.display,
            weekStartDay: day,
          },
          dirty: true,
        })),

      handleSetDarkMode: (next) =>
        set((state) => ({
          display: {
            ...state.display,
            isDarkMode: next,
          },
          dirty: true,
        })),

      handleSetMenuActivation: (key, next) =>
        set((state) => ({
          menuActivation: {
            ...state.menuActivation,
            [key]: next,
          },
          dirty: true,
        })),

      handleSetRealtimeSync: (key, next) =>
        set((state) => ({
          appConnection: {
            ...state.appConnection,
            realtimeSync: {
              ...state.appConnection.realtimeSync,
              [key]: next,
            },
          },
          dirty: true,
        })),

      handleMarkSyncStart: () =>
        set({
          isSyncing: true,
          syncError: null,
        }),

      handleMarkSyncSuccess: () =>
        set({
          dirty: false,
          isSyncing: false,
          syncError: null,
          lastSyncedAt: Date.now(),
        }),

      handleMarkSyncError: (message) =>
        set({
          dirty: true,
          isSyncing: false,
          syncError: message,
        }),

      handleResetSettings: () =>
        set({
          ...DEFAULT_SETTINGS_PAYLOAD,
          ...DEFAULT_RUNTIME_STATE,
        }),

      handleGetSettingsPayload: () => {
        const state = get();

        return {
          display: state.display,
          menuActivation: state.menuActivation,
          appConnection: state.appConnection,
        };
      },
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => SessionStorage),
      partialize: (state) => ({
        display: state.display,
        menuActivation: state.menuActivation,
        appConnection: state.appConnection,
        lastSyncedAt: state.lastSyncedAt,
      }),
    },
  ),
);

export default useSettingsStore;
