import { useEffect } from "react";
import { View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import FormHeader from "@/components/form-header/form-header";
import MemberGuide from "@/components/member-guide/member-guide";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { useReminderListQuery, useReminderMutations } from "@/features/reminder";
import TodoReminderListBox from "@/features/todo/components/todo-reminder-list-box/todo-reminder-list-box";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { getTodoDetail } from "@/service/feed/feed";
import { useAuthStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

export interface AlarmSheetProps {
  todoId: number;
  onClose: () => void;
}

function AlarmSheet({ todoId, onClose }: AlarmSheetProps) {
  const iconStroke = useThemeColorToken("ui.icon.default");
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const { data: todoDetail } = useQuery({
    queryKey: [FEED_KEY.Todo_DETAIL, todoId],
    queryFn: () => getTodoDetail({ id: todoId }),
    enabled: todoId > 0 && !isGuestSession,
  });

  const { data: reminders = [] } = useReminderListQuery({
    todoId,
    includeSent: true,
    enabled: todoId > 0 && !isGuestSession,
  });

  const { createReminderMutation, updateReminderMutation, deleteReminderMutation } =
    useReminderMutations({
      todoId,
      selectedTodoDate: todoDetail?.scheduledOn,
    });

  const handleCreateReminder = async (remindsAt: string) => {
    await createReminderMutation.mutateAsync({
      todoId,
      remindsAt,
    });
  };

  const handleUpdateReminder = async (
    _: number,
    reminder: { id?: number; remindsAt: string; remindedAt?: string | null },
    remindsAt: string,
  ) => {
    if (!reminder.id) {
      return;
    }

    await updateReminderMutation.mutateAsync({
      id: reminder.id,
      remindsAt,
    });
  };

  const handleDeleteReminder = async (
    _: number,
    reminder: { id?: number; remindsAt: string; remindedAt?: string | null },
  ) => {
    if (!reminder.id) {
      return;
    }

    await deleteReminderMutation.mutateAsync({ id: reminder.id });
  };

  const handleClose = () => {
    closeSheet();
    onClose();
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      fitContent
    >
      <View className="w-full bg-role-surface-panel px-[1.6rem] pb-[1.6rem] dark:bg-role-dark-surface-panel">
        <FormHeader
          title="미리알림 설정"
          onPressBack={handleClose}
          titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          iconStroke={iconStroke}
          className="px-[0.6rem] pb-[1.2rem] pt-[1.2rem]"
        />
        {isGuestSession ? (
          <MemberGuide className="w-full items-center px-[1.2rem] py-[0.8rem]" />
        ) : (
          <TodoReminderListBox
            reminders={reminders}
            scheduledOn={todoDetail?.scheduledOn ?? ""}
            beginAt={todoDetail?.beginAt ?? undefined}
            onCreateReminder={handleCreateReminder}
            onUpdateReminder={handleUpdateReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}
      </View>
    </BottomSheet>
  );
}

export default AlarmSheet;
