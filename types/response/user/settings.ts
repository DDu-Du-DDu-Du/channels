export type ServerWeekStartDayType = "MON" | "SUN";

export interface DisplaySettingsType {
  weekStartDay: ServerWeekStartDayType;
  isDarkMode: boolean;
}

export interface MenuActivationItemType {
  isActive: boolean;
  priority: number;
}

export interface MenuActivationSettingsType {
  calendar: MenuActivationItemType;
  dashboard: MenuActivationItemType;
  stats: MenuActivationItemType;
}

export interface RealtimeSyncSettingsType {
  notion: boolean;
  googleCalendar: boolean;
  microsoftTodo: boolean;
}

export interface AppConnectionSettingsType {
  realtimeSync: RealtimeSyncSettingsType;
}

export interface UserSettingsResponseType {
  display: DisplaySettingsType;
  menuActivation: MenuActivationSettingsType;
  appConnection: AppConnectionSettingsType;
}
