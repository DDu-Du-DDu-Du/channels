import { useTranslation } from "react-i18next";
import { View } from "react-native";

import SheetButton from "@/components/sheet-button/sheet-button";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { AlarmIcon, AnotherDayIcon, DailyIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

import type { TodoDetailType } from "../../todo-sheet.types";

export interface TodosubMenuProps {
  TodoDetail: TodoDetailType;
  handleSelectDifferentDate: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting: () => void;
  onRepeatCurrentDate: () => void;
}

function TodosubMenu({
  TodoDetail,
  handleSelectDifferentDate,
  handleAlarmSetting,
  onRepeatCurrentDate,
}: TodosubMenuProps) {
  const { t } = useTranslation();
  const { scheduledOn, status } = TodoDetail;
  const isTodoDateNow = formatDateToYYYYMMDD(new Date()) === scheduledOn;

  const handleRepeatTodoCurrentDate = () => {
    onRepeatCurrentDate();
  };

  const handleChangeTodoDate = () => {
    handleSelectDifferentDate("change", scheduledOn);
  };

  const handleRepeatTodoDate = () => {
    handleSelectDifferentDate("repeat", scheduledOn);
  };

  return (
    <View className="flex flex-col w-full max-w-[50rem] gap-[1rem]">
      {status === "COMPLETE" && (
        <>
          <SheetButton
            Icon={<DailyIcon />}
            title={t("todo.actions.repeatToday")}
            buttonType="sub"
            onPress={handleRepeatTodoCurrentDate}
          />
          <SheetButton
            Icon={<AnotherDayIcon fill="#FDB541" />}
            title={t("todo.actions.repeatDifferentDate")}
            buttonType="sub"
            onPress={handleRepeatTodoDate}
          />
          <SheetButton
            Icon={<AnotherDayIcon />}
            title={t("todo.actions.changeDate")}
            buttonType="sub"
            onPress={handleChangeTodoDate}
          />
        </>
      )}
      {status === "UNCOMPLETED" && isTodoDateNow && (
        <>
          <SheetButton
            Icon={<AlarmIcon />}
            title={t("todo.actions.setReminder")}
            buttonType="sub"
            rightPlace={
              <SpoqaText className="text-size13 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                {t("common.none")}
              </SpoqaText>
            }
            onPress={handleAlarmSetting}
          />
          <SheetButton
            Icon={<AnotherDayIcon fill="#FDB541" />}
            title={t("todo.actions.postpone")}
            buttonType="sub"
            onPress={handleChangeTodoDate}
          />
        </>
      )}
      {status === "UNCOMPLETED" && !isTodoDateNow && (
        <SheetButton
          Icon={<DailyIcon />}
          title={t("todo.actions.repeatToday")}
          buttonType="sub"
          onPress={handleRepeatTodoCurrentDate}
        />
      )}
      {status === "UNCOMPLETED" && (
        <SheetButton
          Icon={<AnotherDayIcon />}
          title={t("todo.actions.repeatDifferentDate")}
          buttonType="sub"
          onPress={handleRepeatTodoDate}
        />
      )}
    </View>
  );
}

export default TodosubMenu;
