import { useSettingsStore } from "@/stores";

interface AppConnectionToggleState {
  isToggle: boolean;
  handleValueChange: (next: boolean) => void;
}

interface UseAppConnectionSettingsReturn {
  notion: AppConnectionToggleState;
  googleCalendar: AppConnectionToggleState;
  microsoftTodo: AppConnectionToggleState;
}

function useAppConnectionSettings(): UseAppConnectionSettingsReturn {
  const notion = useSettingsStore((state) => state.appConnection.realtimeSync.notion);
  const googleCalendar = useSettingsStore(
    (state) => state.appConnection.realtimeSync.googleCalendar,
  );
  const microsoftTodo = useSettingsStore((state) => state.appConnection.realtimeSync.microsoftTodo);
  const handleSetRealtimeSync = useSettingsStore((state) => state.handleSetRealtimeSync);

  const handleChangeNotion = (next: boolean) => {
    handleSetRealtimeSync("notion", next);
  };

  const handleChangeGoogleCalendar = (next: boolean) => {
    handleSetRealtimeSync("googleCalendar", next);
  };

  const handleChangeMicrosoftTodo = (next: boolean) => {
    handleSetRealtimeSync("microsoftTodo", next);
  };

  return {
    notion: {
      isToggle: notion,
      handleValueChange: handleChangeNotion,
    },
    googleCalendar: {
      isToggle: googleCalendar,
      handleValueChange: handleChangeGoogleCalendar,
    },
    microsoftTodo: {
      isToggle: microsoftTodo,
      handleValueChange: handleChangeMicrosoftTodo,
    },
  };
}

export default useAppConnectionSettings;
