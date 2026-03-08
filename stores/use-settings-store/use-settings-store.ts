import { SessionStorage } from "@/utils/storage";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WeekStartDay = "sun" | "mon";
export type MenuActivationKey = "calendar" | "dashboard" | "stats";
export type RealtimeSyncKey = "notion" | "googleCalendar" | "microsoftTodo";
export interface MenuActivationItem {
  isActivated: boolean;
  priority: number;
}

export const MENU_ACTIVATION_KEYS: MenuActivationKey[] = ["calendar", "dashboard", "stats"];

export interface SettingsPayload {
  display: {
    weekStartDay: WeekStartDay;
    isDarkMode: boolean;
  };
  menuActivation: {
    calendar: MenuActivationItem;
    dashboard: MenuActivationItem;
    stats: MenuActivationItem;
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
  handleReorderMenuActivation: (nextOrder: MenuActivationKey[]) => void;
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
    calendar: {
      isActivated: true,
      priority: 1,
    },
    dashboard: {
      isActivated: true,
      priority: 2,
    },
    stats: {
      isActivated: true,
      priority: 3,
    },
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
            [key]: {
              ...state.menuActivation[key],
              isActivated: next,
            },
          },
          dirty: true,
        })),

      handleReorderMenuActivation: (nextOrder) =>
        set((state) => {
          const nextMenuActivation = { ...state.menuActivation };

          nextOrder.forEach((key, index) => {
            nextMenuActivation[key] = {
              ...nextMenuActivation[key],
              priority: index + 1,
            };
          });

          return {
            menuActivation: nextMenuActivation,
            dirty: true,
          };
        }),

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
      version: 2,
      storage: createJSONStorage(() => SessionStorage),
      migrate: (persistedState, version) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState as SettingsState;
        }

        if (version >= 2) {
          return persistedState as SettingsState;
        }

        const previousState = persistedState as Partial<SettingsState> & {
          menuActivation?: Partial<Record<MenuActivationKey, boolean>>;
        };

        const fallback = DEFAULT_SETTINGS_PAYLOAD.menuActivation;
        const previousMenuActivation = previousState.menuActivation;

        return {
          ...previousState,
          menuActivation: {
            calendar: {
              isActivated:
                typeof previousMenuActivation?.calendar === "boolean"
                  ? previousMenuActivation.calendar
                  : fallback.calendar.isActivated,
              priority: fallback.calendar.priority,
            },
            dashboard: {
              isActivated:
                typeof previousMenuActivation?.dashboard === "boolean"
                  ? previousMenuActivation.dashboard
                  : fallback.dashboard.isActivated,
              priority: fallback.dashboard.priority,
            },
            stats: {
              isActivated:
                typeof previousMenuActivation?.stats === "boolean"
                  ? previousMenuActivation.stats
                  : fallback.stats.isActivated,
              priority: fallback.stats.priority,
            },
          },
        } as SettingsState;
      },
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
