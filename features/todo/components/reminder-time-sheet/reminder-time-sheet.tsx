import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import CustomCalendar from "@/components/calendar/custom-calendar/custom-calendar";
import FormHeader from "@/components/form-header/form-header";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import TimePicker from "@/components/time-picker/time-picker";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { CalendarIcon } from "@/icons";
import { formatDateToYYYYMMDD, parseUtc } from "@/utils";

export interface ReminderTimeSheetProps {
  mode: "create" | "edit";
  initialRemindsAt?: string;
  scheduledOn: string;
  beginAt?: string;
  onClose: () => void;
  onSubmit: (remindsAt: string) => Promise<void> | void;
}

const parseLocalDateInfo = (iso: string) => {
  const localDate = parseUtc(iso);
  return {
    date: formatDateToYYYYMMDD(localDate),
    hour: localDate.getHours(),
    minute: localDate.getMinutes(),
  };
};

function ReminderTimeSheet({
  mode,
  initialRemindsAt,
  scheduledOn,
  beginAt,
  onClose,
  onSubmit,
}: ReminderTimeSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const iconStroke = useThemeColorToken("ui.icon.default");
  const spinnerColor = useThemeColorToken("role.text.inverse");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [dateWarning, setDateWarning] = useState("");
  const [timeWarning, setTimeWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  useEffect(() => {
    if (!initialRemindsAt) {
      setSelectedDate("");
      setHour(0);
      setMinute(0);
      return;
    }

    try {
      const parsed = parseLocalDateInfo(initialRemindsAt);
      setSelectedDate(parsed.date);
      setHour(parsed.hour);
      setMinute(parsed.minute);
    } catch {
      setSelectedDate("");
      setHour(0);
      setMinute(0);
    }
  }, [initialRemindsAt]);

  const markedDates = useMemo(
    () => (selectedDate ? { [selectedDate]: { selected: true } } : undefined),
    [selectedDate],
  );

  const handleSheetClose = () => {
    closeSheet();
    onClose();
  };

  const handleSubmit = async () => {
    setDateWarning("");
    setTimeWarning("");

    if (!selectedDate) {
      setDateWarning("날짜를 선택해주세요");
      return;
    }

    const reminderDateTime = new Date(
      `${selectedDate}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`,
    );
    if (Number.isNaN(reminderDateTime.getTime())) {
      setDateWarning("날짜를 선택해주세요");
      return;
    }

    if (beginAt) {
      const [startHour = "00", startMinute = "00"] = beginAt.split(":");
      const todoStartAt = new Date(`${scheduledOn}T${startHour}:${startMinute}:00`);

      if (
        !Number.isNaN(todoStartAt.getTime()) &&
        reminderDateTime.getTime() >= todoStartAt.getTime()
      ) {
        setTimeWarning("미리알림 시간은 투두 시작시간 이전이어야 해요");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit(reminderDateTime.toISOString());
      handleSheetClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      defaultHeight="80%"
      maxHeight="92%"
    >
      <View className="h-full w-full bg-role-surface-panel px-[2rem] pb-[1.6rem] dark:bg-role-dark-surface-panel">
        <FormHeader
          title={mode === "create" ? "미리알림 생성" : "미리알림 수정"}
          onPressBack={handleSheetClose}
          titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          iconStroke={iconStroke}
          className="px-[0.4rem] pb-[1.6rem] pt-[1.4rem]"
        />

        <View className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View className="gap-[1.2rem] pb-[1rem]">
              <View className="gap-[0.8rem]">
                <View className="items-center justify-center">
                  <Pressable
                    onPress={() => setIsCalendarOpen((prev) => !prev)}
                    className="flex-row items-center rounded-radius10 bg-role-surface-canvas px-[1.4rem] py-[0.8rem] dark:bg-role-dark-surface-canvas"
                  >
                    <CalendarIcon
                      size={16}
                      stroke={iconStroke}
                    />
                    <SpoqaText className="ml-[0.6rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
                      {selectedDate || "날짜 선택"}
                    </SpoqaText>
                  </Pressable>
                </View>
                {isCalendarOpen && (
                  <View>
                    <CustomCalendar
                      current={selectedDate || undefined}
                      markedDates={markedDates}
                      onDayPress={(day) => {
                        setSelectedDate(day.dateString);
                        setDateWarning("");
                        setIsCalendarOpen(false);
                      }}
                    />
                  </View>
                )}
                {dateWarning ? (
                  <SpoqaText className="text-size13 text-role-text-invalid dark:text-role-dark-text-invalid">
                    {dateWarning}
                  </SpoqaText>
                ) : null}
              </View>

              <View className="gap-[0.8rem] py-[1rem]">
                <View className="flex-row items-center justify-center">
                  <TimePicker
                    type="hour"
                    value={hour}
                    onChange={setHour}
                  />
                  <TimePicker
                    type="min"
                    value={minute}
                    onChange={setMinute}
                  />
                </View>
                {timeWarning ? (
                  <SpoqaText className="text-size13 text-role-text-invalid dark:text-role-dark-text-invalid">
                    {timeWarning}
                  </SpoqaText>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </View>

        <View className="flex-row gap-[0.8rem] border-t border-role-border-subtle pt-[1rem] dark:border-role-dark-border-subtle">
          <Pressable
            onPress={handleSubmit}
            className="h-[4.8rem] flex-1 items-center justify-center rounded-radius15 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
          >
            {isSubmitting ? (
              <ActivityIndicator color={spinnerColor} />
            ) : (
              <SpoqaText
                weight="semiBold"
                className="text-role-text-inverse dark:text-role-dark-text-inverse"
              >
                {mode === "create" ? "생성" : "수정"}
              </SpoqaText>
            )}
          </Pressable>

          <Pressable
            onPress={handleSheetClose}
            className="h-[4.8rem] flex-1 items-center justify-center rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas"
          >
            <SpoqaText className="text-role-text-primary dark:text-role-dark-text-primary">
              취소
            </SpoqaText>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

export default ReminderTimeSheet;
