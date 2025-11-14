import { View } from "react-native";

import { ReminderNotification } from "@/components";

export interface ReminderNotificationViewProps {
  id?: string | number;
  title?: string;
  body?: string;
  context?: string;
  bgColor?: string;
}

function ReminderNotificationView({
  id = "1",
  title = "제목을 입력해주세요.",
  body = "10분 전에 알림이 도착했습니다.",
  context = "?=",
  bgColor,
}: ReminderNotificationViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <ReminderNotification
        id={id}
        title={title}
        body={body}
        context={context}
        createdAt={new Date().toISOString()}
        bgColor={bgColor}
      />
    </View>
  );
}

export default ReminderNotificationView;
