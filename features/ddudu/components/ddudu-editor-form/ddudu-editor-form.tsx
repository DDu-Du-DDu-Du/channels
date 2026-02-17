import { Pressable, TextInput as RNTextInput, View } from "react-native";

import { Button, FormSection, FormTitleInput, SpoqaText, TimeSet } from "@/components";
import { ChevronRightIcon } from "@/icons";

import type { DDuDuEditorStateType } from "../../ddudu.types";
import DDuDuDetailToggle from "../ddudu-detail-toggle/ddudu-detail-toggle";
import DDuDuReminderPanel from "../ddudu-reminder-panel/ddudu-reminder-panel";

export interface DDuDuEditorFormProps {
  mode: "create" | "edit";
  state: DDuDuEditorStateType;
  titleWarning: string;
  reminderWarning: string;
  isPending: boolean;
  onPressOpenCalendar: () => void;
  onPressOpenTimeSheet: () => void;
  onChangeTitle: (title: string) => void;
  onToggleDetail: () => void;
  onToggleReminder: (enabled: boolean) => void;
  onChangeReminderDay: (value: number) => void;
  onChangeReminderHour: (value: number) => void;
  onChangeReminderMinute: (value: number) => void;
  onChangeMemo: (memo: string) => void;
  onSubmit: () => void;
}

function DDuDuEditorForm({
  mode,
  state,
  titleWarning,
  reminderWarning,
  isPending,
  onPressOpenCalendar,
  onPressOpenTimeSheet,
  onChangeTitle,
  onToggleDetail,
  onToggleReminder,
  onChangeReminderDay,
  onChangeReminderHour,
  onChangeReminderMinute,
  onChangeMemo,
  onSubmit,
}: DDuDuEditorFormProps) {
  return (
    <View className="w-full gap-[1rem] px-[2.4rem] pb-[2.4rem]">
      <FormTitleInput
        required
        value={state.title}
        onChangeText={onChangeTitle}
        placeholder="뚜두 제목"
      />
      {titleWarning ? (
        <SpoqaText className="text-size13 text-example_red_500">{titleWarning}</SpoqaText>
      ) : null}

      <Pressable
        className="rounded-radius15 bg-white_100 px-[1.2rem] py-[1.2rem]"
        onPress={onPressOpenCalendar}
      >
        <SpoqaText className="mb-[0.4rem] text-size12 text-example_gray_900">날짜</SpoqaText>
        <SpoqaText className="text-size14 text-black">{state.scheduledOn}</SpoqaText>
      </Pressable>

      <DDuDuDetailToggle
        isOpen={state.detailOpen}
        onPress={onToggleDetail}
      />

      {state.detailOpen && (
        <View className="gap-[1rem]">
          <FormSection
            label="시간 설정"
            labelClassName="text-size14 text-black"
            className="rounded-radius15 bg-white_100 px-[1.2rem]"
            rightContent={
              <ChevronRightIcon
                size={14}
                fill="#505050"
              />
            }
            onPress={onPressOpenTimeSheet}
          />

          <TimeSet
            beginAt={state.beginAt || undefined}
            endAt={state.endAt || undefined}
            beginLabel="시작시간"
            endLabel="종료시간"
          />

          <DDuDuReminderPanel
            enabled={state.reminder.enabled}
            day={state.reminder.day}
            hour={state.reminder.hour}
            minute={state.reminder.minute}
            warningMessage={reminderWarning}
            onToggle={onToggleReminder}
            onChangeDay={onChangeReminderDay}
            onChangeHour={onChangeReminderHour}
            onChangeMinute={onChangeReminderMinute}
          />

          <View className="rounded-radius15 bg-white_100 p-[1.2rem]">
            <SpoqaText className="mb-[0.8rem] text-size14 text-black">메모 입력</SpoqaText>
            {/* TODO: to-be added after server implementation */}
            <RNTextInput
              value={state.memo}
              onChangeText={onChangeMemo}
              placeholder="메모를 입력해주세요"
              multiline
              textAlignVertical="top"
              className="h-[10rem] rounded-radius15 bg-example_gray_100 px-[1.2rem] py-[1rem] text-size14"
            />
          </View>
        </View>
      )}

      <Button
        label={mode === "create" ? "뚜두 생성" : "뚜두 수정"}
        onPress={onSubmit}
        className="mt-[0.4rem]"
        bodyClassName={`bg-main ${isPending ? "opacity-50" : ""}`}
        labelClassName="text-white"
      />
    </View>
  );
}

export default DDuDuEditorForm;
